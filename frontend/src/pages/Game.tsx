import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PromptCard from "../components/PromptCard";
import PlayerChip from "../components/PlayerChip";
import Timer from "../components/Timer";
import Button from "../components/Button";
import { useRoomSync } from "../hooks/useRoomSync";
import { useSession } from "../lib/store";
import { emitWithAck } from "../lib/socket";

const EVERYONE_ANSWERS_TYPES = [
  "never_have_i_ever",
  "most_likely_to",
  "vote",
  "would_you_rather",
  "this_or_that",
];

export default function Game() {
  useRoomSync();
  const navigate = useNavigate();
  const { code } = useParams();
  const room = useSession((s) => s.room);
  const lastResult = useSession((s) => s.lastResult);
  const playerId = useSession((s) => s.playerId);
  const [submitted, setSubmitted] = useState(false);
  const [reported, setReported] = useState(false);

  const round = room?.round;
  useEffect(() => setSubmitted(false), [round]);

  useEffect(() => {
    if (room?.status === "results") navigate(`/room/${code}/results`);
  }, [room?.status, code, navigate]);

  const prompt = room?.currentPrompt;
  const gameType = prompt?.gameType;
  useEffect(() => setReported(false), [prompt?.id]);
  const isEveryoneRound = gameType
    ? EVERYONE_ANSWERS_TYPES.includes(gameType)
    : false;
  const activePlayer = room?.currentPlayerId
    ? room.players[room.currentPlayerId]
    : null;
  const passAndPlay = room?.deviceMode === "pass_and_play";
  const passPlayer = passAndPlay
    ? Object.values(room?.players ?? {}).find(
        (player) => !room?.votes[player.id],
      )
    : null;
  const actingPlayer = passAndPlay
    ? isEveryoneRound
      ? passPlayer
      : activePlayer
    : isEveryoneRound
      ? room?.players[playerId ?? ""]
      : activePlayer;
  const isMyTurn = passAndPlay
    ? Boolean(actingPlayer)
    : isEveryoneRound
      ? Boolean(actingPlayer)
      : activePlayer?.id === playerId;

  const otherPlayers = useMemo(
    () =>
      room ? Object.values(room.players).filter((p) => p.id !== playerId) : [],
    [room, playerId],
  );

  if (!room || !prompt) {
    return (
      <div className="flex min-h-screen items-center justify-center text-mute">
        Loading the next round...
      </div>
    );
  }

  async function respond(value: string) {
    if (submitted || !actingPlayer) return;
    setSubmitted(true);
    try {
      await emitWithAck("round:submitAnswer", {
        code: room!.code,
        value,
        playerId: actingPlayer.id,
      });
    } catch {
      setSubmitted(false);
    }
  }

  async function reportPrompt() {
    if (reported || !prompt) return;
    try {
      await emitWithAck("moderation:report", {
        code: room.code,
        promptId: prompt.id,
        reason: "Player reported this prompt",
      });
      setReported(true);
    } catch {
      setReported(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8 sm:px-10">
      <div className="flex items-center justify-between text-xs text-mute">
        <span>
          Round {room.round}
          {room.settings.rounds !== -1 ? ` of ${room.settings.rounds}` : ""}
        </span>
        <Timer
          seconds={room.settings.timer}
          resetKey={room.round}
          onExpire={() => respond("SKIP")}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {Object.values(room.players).map((p) => (
          <PlayerChip
            key={p.id}
            player={p}
            highlight={p.id === activePlayer?.id}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center justify-center">
        {passAndPlay && actingPlayer && (
          <p className="mb-4 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-center text-sm text-gold">
            Pass the phone to {actingPlayer.nickname}
          </p>
        )}
        {!isEveryoneRound && activePlayer && (
          <p className="mb-4 text-sm text-mute">
            {isMyTurn ? "It's your turn" : `${activePlayer.nickname}'s turn`}
          </p>
        )}
        {!isEveryoneRound &&
          actingPlayer &&
          (gameType === "two_truths_and_a_lie" || gameType === "hot_seat") && (
            <p className="mb-4 max-w-md text-center text-sm text-mute">
              {gameType === "hot_seat"
                ? "Take the seat. Everyone gets one question, and you can skip once."
                : "Say your three statements out loud. Let the group guess before you finish the round."}
            </p>
          )}

        <PromptCard
          gameType={prompt.gameType}
          text={prompt.text}
          choices={prompt.choices}
          isAdult={prompt.ageRating !== "all"}
          className="w-full max-w-md"
        />
        <button
          type="button"
          onClick={reportPrompt}
          disabled={reported}
          className="focus-ring mt-3 text-xs text-mute underline decoration-white/20 underline-offset-4 hover:text-bone disabled:no-underline disabled:opacity-60"
        >
          {reported ? "Reported for review" : "Report this prompt"}
        </button>

        <div className="mt-8 w-full max-w-md">
          {!isEveryoneRound && (isMyTurn || passAndPlay) && (
            <div className="flex gap-3">
              <Button
                onClick={() => respond("DONE")}
                disabled={submitted}
                className="flex-1"
              >
                Done
              </Button>
              {prompt.allowSkip && (
                <Button
                  variant="secondary"
                  onClick={() => respond("SKIP")}
                  disabled={submitted}
                  className="flex-1"
                >
                  Skip
                </Button>
              )}
            </div>
          )}

          {!isEveryoneRound && !isMyTurn && !passAndPlay && (
            <p className="text-center text-sm text-mute">
              Waiting for {activePlayer?.nickname}...
            </p>
          )}

          {isEveryoneRound &&
            gameType === "would_you_rather" &&
            (isMyTurn || passAndPlay) && (
              <div className="grid gap-3">
                {prompt.choices?.map((choice, index) => (
                  <Button
                    key={choice}
                    onClick={() => respond(index === 0 ? "A" : "B")}
                    disabled={submitted}
                    className="w-full"
                  >
                    {index === 0 ? "A" : "B"}. {choice}
                  </Button>
                ))}
              </div>
            )}

          {isEveryoneRound &&
            gameType === "this_or_that" &&
            (isMyTurn || passAndPlay) && (
              <div className="grid gap-3">
                {prompt.choices?.map((choice, index) => (
                  <Button
                    key={choice}
                    onClick={() => respond(index === 0 ? "A" : "B")}
                    disabled={submitted}
                    className="w-full"
                  >
                    {index === 0 ? "A" : "B"}. {choice}
                  </Button>
                ))}
              </div>
            )}

          {isEveryoneRound &&
            gameType === "never_have_i_ever" &&
            (isMyTurn || passAndPlay) && (
              <div className="flex gap-3">
                <Button
                  onClick={() => respond("I_HAVE")}
                  disabled={submitted}
                  className="flex-1"
                >
                  I have
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => respond("NEVER")}
                  disabled={submitted}
                  className="flex-1"
                >
                  Never
                </Button>
              </div>
            )}

          {isEveryoneRound &&
            (gameType === "most_likely_to" || gameType === "vote") &&
            (isMyTurn || passAndPlay) && (
              <div className="grid grid-cols-2 gap-2">
                {(passAndPlay
                  ? Object.values(room.players).filter(
                      (p) => p.id !== actingPlayer?.id,
                    )
                  : otherPlayers
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => respond(p.id)}
                    disabled={submitted}
                    className="focus-ring rounded-card border border-white/10 bg-surface px-3 py-3 text-sm hover:border-lilac disabled:opacity-40"
                  >
                    {p.avatar} {p.nickname}
                  </button>
                ))}
              </div>
            )}

          {submitted && (
            <p className="mt-4 text-center text-xs text-mute">
              Locked in. Waiting on the room...
            </p>
          )}
        </div>
      </div>

      {lastResult && (
        <div className="mt-6 rounded-card border border-gold/30 bg-gold/5 px-4 py-3 text-center text-sm text-gold">
          {lastResult.summary}
        </div>
      )}
    </div>
  );
}
