import { cn } from "../lib/cn";

export type ProgressVariant = "default" | "success" | "danger" | "info";

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  striped?: boolean;
  animated?: boolean;
  /** Show "42%" centered on the bar. */
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant = "default",
  striped,
  animated,
  showLabel,
  label,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("px-progress", variant !== "default" && `px-progress--${variant}`, className)}
    >
      <div
        className={cn(
          "px-progress-fill",
          striped && "px-progress-fill--striped",
          animated && "px-progress-fill--animated",
        )}
        style={{ width: `${pct}%` }}
      />
      {showLabel && <span className="px-progress-label">{Math.round(pct)}%</span>}
    </div>
  );
}
