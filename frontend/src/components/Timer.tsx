import { useEffect, useState } from "react";

interface Props {
  seconds: number; // 0 = no timer
  resetKey: string | number; // change this to restart the countdown
  onExpire?: () => void;
}

export default function Timer({ seconds, resetKey, onExpire }: Props) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
    if (seconds === 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, seconds]);

  if (seconds === 0) return null;

  const pct = Math.max(0, remaining / seconds);

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-mute">{remaining}s</span>
    </div>
  );
}
