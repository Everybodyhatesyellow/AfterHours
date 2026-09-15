import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { emitWithAck } from "../lib/socket";
import { useSession } from "../lib/store";
import type { RoomState } from "../types/domain";

const AVATARS = ["😈", "🔥", "💋", "🥶", "👀", "🎉", "🧃", "🐍", "🦋", "🍒"];

export default function JoinParty() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setPlayerId = useSession((s) => s.setPlayerId);
  const setRoom = useSession((s) => s.setRoom);

  const [code, setCode] = useState(params.get("code") ?? "");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (code.trim().length !== 5) return setError("Party codes are 5 characters.");
    if (!nickname.trim()) return setError("What's your party name?");
    setError(null);
    setLoading(true);
    try {
      const res = await emitWithAck<{ playerId: string; room: RoomState }>("room:join", {
        code: code.toUpperCase(),
        nickname,
        avatar,
      });
      setPlayerId(res.playerId);
      setRoom(res.room);
      navigate(`/room/${res.room.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't join that room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <button onClick={() => navigate("/")} className="mb-6 self-start text-sm text-mute hover:text-bone">
        ← Back
      </button>
      <h1 className="font-display text-4xl">Join the party</h1>
      <p className="mt-2 text-mute">Less than 10 seconds, we promise.</p>

      <div className="mt-8 space-y-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="PARTY CODE"
          maxLength={5}
          className="focus-ring w-full rounded-card border border-white/10 bg-surface px-4 py-4 text-center font-display text-2xl tracking-[0.3em] text-bone placeholder:text-mute"
        />
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="What's your party name?"
          maxLength={20}
          className="focus-ring w-full rounded-full border border-white/10 bg-surface px-4 py-3 text-bone placeholder:text-mute"
        />
        <div className="flex flex-wrap gap-1.5">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`focus-ring h-10 w-10 rounded-full text-lg ${
                avatar === a ? "bg-coral/20 ring-2 ring-coral" : "bg-surfaceHigh"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-coral">{error}</p>}

      <Button className="mt-6" onClick={handleJoin} disabled={loading}>
        {loading ? "Joining..." : "Join room"}
      </Button>
    </div>
  );
}
