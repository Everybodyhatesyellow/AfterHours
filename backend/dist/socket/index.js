import { nanoid } from "nanoid";
import { createRoomSchema, joinRoomSchema, reportContentSchema, submitAnswerSchema, submitCustomPromptSchema, unlockAdultModeSchema, } from "../validation/schemas.js";
import { createRoom, getRoom } from "../services/roomManager.js";
import { fileReport, isClean, sanitize } from "../services/moderation.js";
// Server-authoritative: every mutation happens here, never on the client.
// Sockets join a Socket.IO "room" named after the party code so a single
// `io.to(code).emit(...)` fans state out to everyone at once.
const ROUND_END_GRACE_MS = 1500; // small pause so the reveal animation lands before the next round
export function registerSocketHandlers(io) {
    io.on("connection", (socket) => {
        socket.on("room:create", (payload, ack) => {
            const parsed = createRoomSchema.safeParse(payload);
            if (!parsed.success)
                return ack?.({ ok: false, error: "Invalid room settings." });
            const hostId = nanoid(10);
            const host = {
                id: hostId,
                nickname: sanitize(parsed.data.nickname),
                avatar: parsed.data.avatar,
                isHost: true,
                connected: true,
                ready: true,
                score: 0,
                streak: 0,
                badges: [],
                turnsTaken: 0,
                lastDifficulty: 0,
                joinedAt: Date.now(),
            };
            const { vibes, intensity, rounds, timer, deviceMode, playerNames, ...toggles } = parsed.data;
            const engine = createRoom(host, { vibes, intensity, rounds, timer, ...toggles }, deviceMode);
            if (deviceMode === "pass_and_play") {
                const names = playerNames ?? [];
                const usedNames = new Set();
                for (const [index, name] of names.entries()) {
                    const cleanName = sanitize(name);
                    const normalized = cleanName.toLowerCase();
                    if (usedNames.has(normalized)) {
                        return ack?.({
                            ok: false,
                            error: "Each player needs a different name.",
                        });
                    }
                    usedNames.add(normalized);
                    if (index === 0) {
                        engine.state.players[hostId].nickname = cleanName;
                        continue;
                    }
                    engine.addPlayer({
                        id: nanoid(10),
                        nickname: cleanName,
                        avatar: "🎲",
                        isHost: false,
                        connected: true,
                        ready: true,
                        score: 0,
                        streak: 0,
                        badges: [],
                        turnsTaken: 0,
                        lastDifficulty: 0,
                        joinedAt: Date.now(),
                    });
                }
            }
            socket.data.playerId = hostId;
            socket.data.code = engine.state.code;
            socket.join(engine.state.code);
            ack?.({
                ok: true,
                code: engine.state.code,
                playerId: hostId,
                room: engine.state,
            });
        });
        socket.on("room:join", (payload, ack) => {
            const parsed = joinRoomSchema.safeParse(payload);
            if (!parsed.success)
                return ack?.({ ok: false, error: "Invalid join request." });
            const engine = getRoom(parsed.data.code);
            if (!engine)
                return ack?.({ ok: false, error: "That party code doesn't exist." });
            if (engine.state.status !== "lobby") {
                return ack?.({ ok: false, error: "This party has already started." });
            }
            const nameTaken = Object.values(engine.state.players).some((p) => p.connected &&
                p.nickname.toLowerCase() === parsed.data.nickname.toLowerCase());
            if (nameTaken)
                return ack?.({ ok: false, error: "That name is taken in this room." });
            const playerId = nanoid(10);
            const player = {
                id: playerId,
                nickname: sanitize(parsed.data.nickname),
                avatar: parsed.data.avatar,
                isHost: false,
                connected: true,
                ready: false,
                score: 0,
                streak: 0,
                badges: [],
                turnsTaken: 0,
                lastDifficulty: 0,
                joinedAt: Date.now(),
            };
            engine.addPlayer(player);
            socket.data.playerId = playerId;
            socket.data.code = engine.state.code;
            socket.join(engine.state.code);
            ack?.({ ok: true, playerId, room: engine.state });
            io.to(engine.state.code).emit("room:state", engine.state);
        });
        socket.on("room:toggleReady", () => {
            withRoom(socket, (engine) => {
                const player = engine.state.players[socket.data.playerId];
                if (!player)
                    return;
                player.ready = !player.ready;
                io.to(engine.state.code).emit("room:state", engine.state);
            });
        });
        socket.on("room:unlockAdultMode", (payload, ack) => {
            const parsed = unlockAdultModeSchema.safeParse(payload);
            if (!parsed.success)
                return ack?.({ ok: false, error: "Confirmation required." });
            withRoom(socket, (engine) => {
                if (engine.state.hostId !== socket.data.playerId) {
                    return ack?.({ ok: false, error: "Only the host can change this." });
                }
                engine.state.settings.adultModeUnlocked = true;
                io.to(engine.state.code).emit("room:state", engine.state);
                ack?.({ ok: true });
            });
        });
        socket.on("room:start", () => {
            withRoom(socket, (engine) => {
                if (engine.state.hostId !== socket.data.playerId)
                    return;
                engine.start();
                io.to(engine.state.code).emit("room:state", engine.state);
            });
        });
        socket.on("round:submitAnswer", (payload, ack) => {
            const parsed = submitAnswerSchema.safeParse(payload);
            if (!parsed.success)
                return ack?.({ ok: false, error: "Invalid answer." });
            withRoom(socket, (engine) => {
                const answerPlayerId = engine.state.deviceMode === "pass_and_play"
                    ? parsed.data.playerId
                    : socket.data.playerId;
                if (!answerPlayerId || !engine.state.players[answerPlayerId]) {
                    return ack?.({
                        ok: false,
                        error: "Choose a player before answering.",
                    });
                }
                engine.submitAnswer({
                    playerId: answerPlayerId,
                    value: parsed.data.value,
                    submittedAt: Date.now(),
                });
                io.to(engine.state.code).emit("room:state", engine.state);
                const eligible = new Set(engine.state.currentPrompt?.gameType &&
                    [
                        "never_have_i_ever",
                        "most_likely_to",
                        "vote",
                        "would_you_rather",
                        "this_or_that",
                    ].includes(engine.state.currentPrompt.gameType)
                    ? Object.values(engine.state.players)
                        .filter((p) => p.connected)
                        .map((p) => p.id)
                    : engine.state.currentPlayerId
                        ? [engine.state.currentPlayerId]
                        : []);
                const allAnswered = [...eligible].every((id) => id in engine.state.votes);
                if (allAnswered) {
                    const result = engine.completeRound();
                    io.to(engine.state.code).emit("round:result", result);
                    setTimeout(() => {
                        const maxRounds = engine.state.settings.rounds;
                        if (engine.isRoundExpected(maxRounds)) {
                            engine.advanceRound();
                            io.to(engine.state.code).emit("room:state", engine.state);
                        }
                        else {
                            engine.state.status = "results";
                            io.to(engine.state.code).emit("room:state", engine.state);
                        }
                    }, ROUND_END_GRACE_MS);
                }
                ack?.({ ok: true });
            });
        });
        socket.on("content:submitCustom", (payload, ack) => {
            const parsed = submitCustomPromptSchema.safeParse(payload);
            if (!parsed.success)
                return ack?.({ ok: false, error: "Invalid submission." });
            if (!isClean(parsed.data.text)) {
                return ack?.({
                    ok: false,
                    error: "That didn't pass moderation. Try rephrasing.",
                });
            }
            // Custom prompts are appended to a per-room pool (kept in RoomEngine in
            // a full implementation) and require host approval before entering
            // rotation if the host has approval mode enabled.
            ack?.({ ok: true });
        });
        socket.on("moderation:report", (payload, ack) => {
            const parsed = reportContentSchema.safeParse(payload);
            if (!parsed.success)
                return ack?.({ ok: false, error: "Invalid report." });
            fileReport(parsed.data);
            ack?.({ ok: true });
        });
        socket.on("disconnect", () => {
            withRoom(socket, (engine) => {
                engine.removePlayer(socket.data.playerId);
                io.to(engine.state.code).emit("room:state", engine.state);
            });
        });
    });
}
function withRoom(socket, fn) {
    const code = socket.data.code;
    if (!code)
        return;
    const engine = getRoom(code);
    if (!engine)
        return;
    fn(engine);
}
//# sourceMappingURL=index.js.map