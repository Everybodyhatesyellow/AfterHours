import { selectPrompt, selectNextPlayer, } from "../game-engine/contentSelector.js";
import { pointsForCompletion } from "../game-engine/scoring.js";
/** Shared behaviour for single-player "answer or skip" modes (Truth/Dare). */
class SinglePlayerMode {
    getEligiblePlayers(room) {
        return Object.values(room.players).filter((p) => p.connected);
    }
    generatePrompt(room) {
        return selectPrompt(room, this.type);
    }
    handleAnswer(room, answer) {
        room.votes[answer.playerId] = answer.value; // reuse votes map as an answer log for this round
    }
    calculateScore(room, answer) {
        if (answer.value === "SKIP")
            return 0;
        const player = room.players[answer.playerId];
        const intensity = room.currentPrompt?.intensity ?? "normal";
        return pointsForCompletion(this.type, intensity, player).points;
    }
    handleCompletion(room) {
        const activePlayerId = room.currentPlayerId;
        const player = room.players[activePlayerId];
        const answer = room.votes[activePlayerId] ?? "SKIP";
        if (answer === "SKIP") {
            player.streak = 0;
            return { scoreEvents: [], summary: `${player.nickname} passed.` };
        }
        const intensity = room.currentPrompt?.intensity ?? "normal";
        const event = pointsForCompletion(this.type, intensity, player);
        player.score += event.points;
        player.streak += 1;
        player.turnsTaken += 1;
        player.lastDifficulty = room.currentPrompt?.difficulty ?? 1;
        return {
            scoreEvents: [event],
            summary: `${player.nickname} completed the ${this.type} (+${event.points}).`,
        };
    }
}
export class TruthMode extends SinglePlayerMode {
    type = "truth";
}
export class DareMode extends SinglePlayerMode {
    type = "dare";
}
class SocialTurnMode {
    type;
    constructor(type) {
        this.type = type;
    }
    getEligiblePlayers(room) {
        return Object.values(room.players).filter((p) => p.connected);
    }
    generatePrompt(room) {
        return selectPrompt(room, this.type);
    }
    handleAnswer(room, answer) {
        room.votes[answer.playerId] = answer.value;
    }
    calculateScore(_room, answer) {
        return answer.value === "SKIP" ? 0 : 15;
    }
    handleCompletion(room) {
        const playerId = room.currentPlayerId;
        const player = room.players[playerId];
        const answer = room.votes[playerId] ?? "SKIP";
        if (answer === "SKIP") {
            player.streak = 0;
            return { scoreEvents: [], summary: `${player.nickname} passed.` };
        }
        player.score += 15;
        player.streak += 1;
        player.turnsTaken += 1;
        return {
            scoreEvents: [
                {
                    playerId,
                    points: 15,
                    reason: this.type === "hot_seat" ? "Hot Seat" : "Two Truths & a Lie",
                },
            ],
            summary: `${player.nickname} finished the ${this.type === "hot_seat" ? "hot seat" : "three statements"}.`,
        };
    }
}
/** Never Have I Ever — every player answers "I HAVE" or "NEVER" simultaneously. */
export class NeverHaveIEverMode {
    type = "never_have_i_ever";
    getEligiblePlayers(room) {
        return Object.values(room.players).filter((p) => p.connected);
    }
    generatePrompt(room) {
        return selectPrompt(room, "never_have_i_ever");
    }
    handleAnswer(room, answer) {
        room.votes[answer.playerId] = answer.value; // "I_HAVE" | "NEVER"
    }
    calculateScore() {
        return 5; // flat participation points, spec treats this as a stats round not a scoring round
    }
    handleCompletion(room) {
        const events = Object.entries(room.votes).map(([playerId, value]) => {
            const player = room.players[playerId];
            player.score += 5;
            player.turnsTaken += 1;
            return { playerId, points: 5, reason: "Never Have I Ever" };
        });
        const haveCount = Object.values(room.votes).filter((v) => v === "I_HAVE").length;
        const total = Object.keys(room.votes).length;
        return {
            scoreEvents: events,
            summary: `${haveCount} of ${total} players have done it.`,
            reveal: { haveCount, total },
        };
    }
}
/** Most Likely To / Vote — anonymous voting for another player, reveal tally. */
export class VotingMode {
    type;
    constructor(type) {
        this.type = type;
    }
    getEligiblePlayers(room) {
        return Object.values(room.players).filter((p) => p.connected);
    }
    generatePrompt(room) {
        return selectPrompt(room, this.type);
    }
    handleAnswer(room, answer) {
        room.votes[answer.playerId] = answer.value; // targetPlayerId
    }
    calculateScore() {
        return 5;
    }
    handleCompletion(room) {
        const tally = {};
        for (const targetId of Object.values(room.votes)) {
            tally[targetId] = (tally[targetId] ?? 0) + 1;
        }
        let winnerId = null;
        let winnerVotes = -1;
        for (const [id, count] of Object.entries(tally)) {
            if (count > winnerVotes) {
                winnerId = id;
                winnerVotes = count;
            }
        }
        const scoreEvents = [];
        if (winnerId && room.players[winnerId]) {
            room.players[winnerId].score += 15;
            scoreEvents.push({
                playerId: winnerId,
                points: 15,
                reason: "Most votes",
            });
        }
        const winnerName = winnerId ? room.players[winnerId]?.nickname : null;
        return {
            scoreEvents,
            summary: winnerName
                ? `${winnerName} won the vote.`
                : "No votes were cast.",
            reveal: { tally },
        };
    }
}
/** Would You Rather — everyone picks one side, then the room sees the split. */
export class WouldYouRatherMode {
    type = "would_you_rather";
    getEligiblePlayers(room) {
        return Object.values(room.players).filter((p) => p.connected);
    }
    generatePrompt(room) {
        return selectPrompt(room, this.type);
    }
    handleAnswer(room, answer) {
        room.votes[answer.playerId] = answer.value;
    }
    calculateScore() {
        return 5;
    }
    handleCompletion(room) {
        const tally = Object.values(room.votes).reduce((counts, choice) => {
            counts[choice] = (counts[choice] ?? 0) + 1;
            return counts;
        }, {});
        const events = Object.keys(room.votes).map((playerId) => {
            room.players[playerId].score += 5;
            room.players[playerId].turnsTaken += 1;
            return { playerId, points: 5, reason: "Would You Rather" };
        });
        return {
            scoreEvents: events,
            summary: `${tally.A ?? 0} chose A and ${tally.B ?? 0} chose B.`,
            reveal: { tally },
        };
    }
}
export class ThisOrThatMode {
    type = "this_or_that";
    getEligiblePlayers(room) {
        return Object.values(room.players).filter((p) => p.connected);
    }
    generatePrompt(room) {
        return selectPrompt(room, this.type);
    }
    handleAnswer(room, answer) {
        room.votes[answer.playerId] = answer.value;
    }
    calculateScore() {
        return 5;
    }
    handleCompletion(room) {
        const tally = Object.values(room.votes).reduce((counts, choice) => {
            counts[choice] = (counts[choice] ?? 0) + 1;
            return counts;
        }, {});
        const scoreEvents = Object.keys(room.votes).map((playerId) => {
            room.players[playerId].score += 5;
            room.players[playerId].turnsTaken += 1;
            return { playerId, points: 5, reason: "This or That" };
        });
        return {
            scoreEvents,
            summary: `${tally.A ?? 0} picked A and ${tally.B ?? 0} picked B.`,
            reveal: { tally },
        };
    }
}
export function createBasicModes() {
    return {
        truth: new TruthMode(),
        dare: new DareMode(),
        never_have_i_ever: new NeverHaveIEverMode(),
        most_likely_to: new VotingMode("most_likely_to"),
        vote: new VotingMode("vote"),
        would_you_rather: new WouldYouRatherMode(),
        this_or_that: new ThisOrThatMode(),
        two_truths_and_a_lie: new SocialTurnMode("two_truths_and_a_lie"),
        hot_seat: new SocialTurnMode("hot_seat"),
    };
}
export { selectNextPlayer };
//# sourceMappingURL=basicModes.js.map