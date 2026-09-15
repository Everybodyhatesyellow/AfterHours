import clsx from "clsx";
import type { Vibe } from "../types/domain";

export const VIBE_OPTIONS: { id: Vibe; label: string; emoji: string }[] = [
  { id: "chaotic", label: "CHAOTIC", emoji: "😂" },
  { id: "wild", label: "WILD", emoji: "🔥" },
  { id: "flirty", label: "FLIRTY", emoji: "💘" },
  { id: "party", label: "PARTY", emoji: "🍻" },
  { id: "deep", label: "DEEP", emoji: "🧠" },
  { id: "competitive", label: "COMPETITIVE", emoji: "🏆" },
  { id: "adult", label: "18+ ADULTS", emoji: "🔞" },
  { id: "mix", label: "MIX EVERYTHING", emoji: "🎲" },
];

interface Props {
  selected: Vibe[];
  onToggle: (v: Vibe) => void;
}

export default function VibeGrid({ selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {VIBE_OPTIONS.map((v) => {
        const active = selected.includes(v.id);
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onToggle(v.id)}
            className={clsx(
              "focus-ring rounded-card border p-4 text-left transition-all",
              active
                ? "border-coral bg-coral/10 shadow-glow"
                : "border-white/10 bg-surface hover:border-white/20"
            )}
          >
            <div className="text-2xl">{v.emoji}</div>
            <div className="mt-2 text-xs font-semibold tracking-wide text-bone">{v.label}</div>
          </button>
        );
      })}
    </div>
  );
}
