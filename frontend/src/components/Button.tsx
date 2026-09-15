import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body font-semibold tracking-tight transition-transform active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        variant === "primary" && "bg-coral text-ink hover:brightness-110 shadow-glow",
        variant === "secondary" && "bg-surfaceHigh text-bone hover:bg-white/10 border border-white/10",
        variant === "ghost" && "text-mute hover:text-bone",
        className
      )}
      {...rest}
    />
  );
}
