import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import PlayerChip from "../components/PlayerChip";
import AgeGateModal from "../components/AgeGateModal";
import { useRoomSync } from "../hooks/useRoomSync";
import { useSession } from "../lib/store";
import { emitWithAck, getSocket } from "../lib/socket";

export default function Lobby() {
  useRoomSync();
  const navigate = useNavigate();
  const { code } = useParams();
  const room = useSession((s) => s.room);
  const playerId = useSession((s) => s.playerId);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (room?.status === "in_progress") navigate(`/room/${code}/play`);
  }, [room?.status, code, navigate]);

  if (!room || !playerId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-mute">
        Reconnecting to room {code}...
      </div>
    );
  }

  const players = Object.values(room.players);
  const isHost = room.hostId === playerId;
  const me = room.players[playerId];
  const wantsAdult = room.settings.vibes.includes("adult");
  const inviteUrl = `${window.location.origin}/join?code=${room.code}`;

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function toggleReady() {
    getSocket().emit("room:toggleReady");
  }

  async function startParty() {
    if (wantsAdult && !room!.settings.adultModeUnlocked) {
      setShowAgeGate(true);
      return;
    }
    await emitWithAck("room:start", {});
  }

  async function confirmAdult() {
    await emitWithAck("room:unlockAdultMode", {
      code: room!.code,
      confirmed18: true,
    });
    setShowAgeGate(false);
    await emitWithAck("room:start", {});
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <span className="text-sm text-mute">
          🔥{" "}
          {room.deviceMode === "pass_and_play" ? "PASS & PLAY" : "PARTY ROOM"}
        </span>
        <span className="text-xs text-mute">{players.length} joined</span>
      </div>

      <h1 className="mt-3 font-display text-5xl tracking-[0.08em]">
        {room.deviceMode === "pass_and_play" ? "ONE PHONE" : room.code}
      </h1>

      {room.deviceMode === "pass_and_play" ? (
        <p className="mt-3 max-w-md text-sm text-mute">
          Everyone is already here. Pass the phone around when a name lights up.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={copyLink}>
            {copied ? "Copied!" : "Copy invite link"}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(`Join my party: ${inviteUrl}`)}`,
                "_blank",
              )
            }
          >
            Share to WhatsApp
          </Button>
        </div>
      )}

      <div className="mt-8 rounded-card border border-white/10 bg-surface p-5">
        <div className="flex flex-wrap gap-2">
          {players.map((p) => (
            <PlayerChip key={p.id} player={p} />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-card border border-white/10 bg-surface p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-mute">
          Tonight's lineup
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {room.playlist.length > 0 ? (
            room.playlist.map((mode) => (
              <span
                key={mode}
                className="rounded-full border border-white/10 bg-surfaceHigh px-3 py-1.5 text-xs text-bone"
              >
                {modeLabel(mode)}
              </span>
            ))
          ) : (
            <span className="text-sm text-mute">
              Your playlist appears when the party starts.
            </span>
          )}
        </div>
      </div>

      {wantsAdult && (
        <p className="mt-4 text-xs text-lilac">
          🔞 This party includes an 18+ mode. Everyone will see an age
          confirmation before it kicks in.
        </p>
      )}

      <div className="mt-8">
        {isHost ? (
          <Button onClick={startParty} disabled={players.length < 2}>
            {players.length < 2 ? "Waiting for more friends..." : "Start party"}
          </Button>
        ) : (
          <Button
            variant={me?.ready ? "secondary" : "primary"}
            onClick={toggleReady}
          >
            {me?.ready ? "Ready ✓" : "I'm ready"}
          </Button>
        )}
      </div>

      {showAgeGate && (
        <AgeGateModal
          onConfirm={confirmAdult}
          onCancel={() => setShowAgeGate(false)}
        />
      )}
    </div>
  );
}

function modeLabel(mode: string) {
  return mode
     .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
