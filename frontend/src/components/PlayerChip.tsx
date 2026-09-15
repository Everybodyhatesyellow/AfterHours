import clsx from "clsx";
import type { Player } from "../types/domain";

interface Props {
  player: Player;
  highlight?: boolean;
}

export default function PlayerChip({ player, highlight }: Props) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
        highlight
          ? "border-coral bg-coral/10 text-bone"
          : "border-white/10 bg-surfaceHigh text-mute",
        !player.connected && "opacity-40"
      )}
    >
      <span>{player.avatar}</span>
      <span className="font-medium">{player.nickname}</span>
      {player.isHost && <span className="text-[10px] uppercase text-gold">Host</span>}
      {player.ready && !player.isHost && <span className="text-[10px] uppercase text-lilac">Ready</span>}
      {player.score > 0 && <span className="ml-1 text-xs text-gold">{player.score}</span>}
    </div>
  );
}
