import clsx from "clsx";

interface Option<T> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}

export default function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-mute">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              value === opt.value
                ? "border-lilac bg-lilac/15 text-bone"
                : "border-white/10 bg-surface text-mute hover:text-bone"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
