import Button from "./Button";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AgeGateModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-card border border-lilac/30 bg-surface p-7 text-center shadow-glow">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lilac/15 text-2xl">
          🔞
        </div>
        <h2 className="font-display text-2xl">18+ Only</h2>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          This is adult-only content: bold, flirty, and a little chaotic. It’s
          not graphic — just more grown-up. Everyone in the room needs to be 18
          or older to keep going.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onConfirm} className="w-full">
            I’m 18+
          </Button>
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
