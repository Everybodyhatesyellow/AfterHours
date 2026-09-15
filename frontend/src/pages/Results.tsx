import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useRoomSync } from "../hooks/useRoomSync";
import { useSession } from "../lib/store";
import type { Player } from "../types/domain";

interface Superlative {
  title: string;
  player: Player;
}

function computeSuperlatives(players: Player[]): Superlative[] {
  if (players.length === 0) return [];
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const byStreak = [...players].sort((a, b) => b.streak - a.streak);
  const byTurns = [...players].sort((a, b) => b.turnsTaken - a.turnsTaken);

  const results: Superlative[] = [{ title: "Party Champion", player: sorted[0] }];
  if (byStreak[0] && byStreak[0].streak > 0) {
    results.push({ title: "Biggest Menace", player: byStreak[0] });
  }
  if (byTurns[0]) {
    results.push({ title: "Most Daring", player: byTurns[0] });
  }
  return results;
}

export default function Results() {
  useRoomSync();
  const navigate = useNavigate();
  const room = useSession((s) => s.room);
  const reset = useSession((s) => s.reset);
  const [copied, setCopied] = useState(false);

  const players = useMemo(() => (room ? Object.values(room.players) : []), [room]);
  const superlatives = useMemo(() => computeSuperlatives(players), [players]);
  const ranked = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);

  if (!room) {
    return <div className="flex min-h-screen items-center justify-center text-mute">Loading results...</div>;
  }

  function shareResults() {
    const text = superlatives.map((s) => `${s.title}: ${s.player.nickname}`).join("\n");
    navigator.clipboard.writeText(`We survived AFTERHOURS 🔥\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-10">
      <h1 className="font-display text-5xl">WE SURVIVED.</h1>
      <p className="mt-2 text-mute">That got awkward. In the best way.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {superlatives.map((s) => (
          <div key={s.title} className="rounded-card border border-white/10 bg-surface p-5">
            <div className="text-xs uppercase tracking-wide text-mute">{s.title}</div>
            <div className="mt-2 font-display text-2xl">
              {s.player.avatar} {s.player.nickname}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-card border border-white/10 bg-surface p-5">
        <div className="text-xs uppercase tracking-wide text-mute">Final scores</div>
        <div className="mt-3 space-y-2">
          {ranked.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span>
                {i + 1}. {p.avatar} {p.nickname}
              </span>
              <span className="text-gold">{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={shareResults}>{copied ? "Copied!" : "Share results"}</Button>
        <Button
          variant="secondary"
          onClick={() => {
            reset();
            navigate("/create");
          }}
        >
          Create new party
        </Button>
        <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
      </div>
    </div>
  );
}
