import clsx from "clsx";

const GAME_TYPE_LABEL: Record<
  string,
  { label: string; emoji: string; accent: string }
> = {
  truth: { label: "TRUTH", emoji: "🔥", accent: "from-coral/30" },
  dare: { label: "DARE", emoji: "😈", accent: "from-lilac/30" },
  never_have_i_ever: {
    label: "NEVER HAVE I EVER",
    emoji: "🙈",
    accent: "from-gold/30",
  },
  most_likely_to: {
    label: "MOST LIKELY TO",
    emoji: "👀",
    accent: "from-lilac/30",
  },
  vote: { label: "GROUP VOTE", emoji: "🗳️", accent: "from-coral/30" },
  would_you_rather: {
    label: "WOULD YOU RATHER",
    emoji: "🤔",
    accent: "from-gold/30",
  },
  this_or_that: {
    label: "THIS OR THAT",
    emoji: "⚡",
    accent: "from-gold/30",
  },
  two_truths_and_a_lie: {
    label: "TWO TRUTHS & A LIE",
    emoji: "🎭",
    accent: "from-lilac/30",
  },
  hot_seat: { label: "HOT SEAT", emoji: "🔥", accent: "from-coral/30" },
};

interface Props {
  gameType: string;
  text: string;
  isAdult?: boolean;
  choices?: [string, string];
  rotate?: number; // for the stacked hero display
  className?: string;
}

export default function PromptCard({
  gameType,
  text,
  isAdult,
  choices,
  rotate,
  className,
}: Props) {
  const meta = GAME_TYPE_LABEL[gameType] ?? {
    label: gameType.toUpperCase(),
    emoji: "🎲",
    accent: "from-coral/30",
  };

  return (
    <div
      style={
        rotate !== undefined ? { transform: `rotate(${rotate}deg)` } : undefined
      }
      className={clsx(
        "relative w-72 shrink-0 rounded-card border border-white/10 bg-surface p-6 shadow-2xl",
        "bg-gradient-to-br",
        meta.accent,
        "to-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-mute">
          {meta.emoji} {meta.label}
        </span>
        {isAdult && (
          <span className="rounded-full bg-lilac/20 px-2 py-0.5 text-[10px] font-bold text-lilac">
            18+
          </span>
        )}
      </div>
      <p className="mt-5 font-display text-xl leading-snug text-bone">{text}</p>
      {choices && (
        <div className="mt-5 grid gap-2 text-sm text-mute">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            A. {choices[0]}
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            B. {choices[1]}
          </div>
        </div>
      )}
    </div>
  );
}
