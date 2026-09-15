import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PromptCard from "../components/PromptCard";

const PREVIEW_CARDS = [
  { gameType: "truth", text: "What's your biggest red flag?", rotate: -8 },
  {
    gameType: "dare",
    text: "Let the group choose your next challenge.",
    rotate: 4,
  },
  {
    gameType: "most_likely_to",
    text: "Who would survive a relationship the longest?",
    rotate: -2,
  },
  {
    gameType: "vote",
    text: "Things are about to get interesting.",
    isAdult: true,
    rotate: 9,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-10 pt-6 sm:px-10 sm:pt-8">
      <header className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-bold text-ink">
            A
          </span>
          <div className="font-display text-xl tracking-tight">AFTERHOURS</div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden text-mute sm:inline">
            No account. No awkward onboarding.
          </span>
          <a href="/admin" className="text-mute hover:text-bone">
            Admin
          </a>
        </div>
      </header>

      <main className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-16">
        <div className="reveal-up">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> The night
            starts here
          </div>
          <h1 className="max-w-xl font-display text-5xl leading-[0.96] sm:text-7xl">
            Your friends.
            <br />
            Your rules.
            <br />
            <span className="text-coral">Your chaos.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-mute sm:text-lg">
            Set up a room, invite the crew, and see where the night goes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate("/create")} className="px-7">
              Host a party <span aria-hidden="true">↗</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/join")}
              className="px-7"
            >
              Join a party
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-mute">
            {["Truths", "Dares", "Votes", "18+ mode"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[25rem] items-center justify-center overflow-hidden rounded-card border border-white/10 bg-surface/50 py-10 sm:min-h-[31rem]">
          <div className="absolute left-7 top-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-mute">
            Tonight's energy
          </div>
          <div className="absolute bottom-7 right-7 flex items-center gap-2 text-xs text-mute">
            <span className="h-2 w-2 animate-pulse rounded-full bg-coral" />{" "}
            Live room preview
          </div>
          <div className="landing-cards flex -space-x-16 sm:-space-x-20">
            {PREVIEW_CARDS.map((c, i) => (
              <PromptCard
                key={i}
                {...c}
                className="pointer-events-none select-none shadow-glow"
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} AFTERHOURS</span>
        <span>18+ content is gated behind an in-room confirmation.</span>
      </footer>
    </div>
  );
}
