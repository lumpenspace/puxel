import { cn } from "../lib/cn";

export type HealthBarKind = "hp" | "mp" | "xp" | "generic";

export interface HealthBarProps {
  value: number;
  max: number;
  /** Number of cells to render. */
  cells?: number;
  kind?: HealthBarKind;
  label?: string;
  /** Blink when at or below this fraction (default 0.25); set 0 to disable. */
  criticalBelow?: number;
  className?: string;
}

/** Segmented RPG-style resource bar (HP/MP/XP). */
export function HealthBar({
  value,
  max,
  cells = 10,
  kind = "hp",
  label,
  criticalBelow = 0.25,
  className,
}: HealthBarProps) {
  const fraction = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const filled = Math.round(fraction * cells);
  const critical = criticalBelow > 0 && fraction > 0 && fraction <= criticalBelow;
  const name = label ?? kind.toUpperCase();
  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={name}
      className={cn(
        "px-healthbar",
        kind !== "generic" && `px-healthbar--${kind}`,
        critical && "px-healthbar--critical",
        className,
      )}
    >
      <span className="px-healthbar-label" aria-hidden="true">
        {name}
      </span>
      <span className="px-healthbar-cells">
        {Array.from({ length: cells }, (_, i) => (
          <span key={i} className={cn("px-healthbar-cell", i < filled && "px-healthbar-cell--full")} />
        ))}
      </span>
    </div>
  );
}
