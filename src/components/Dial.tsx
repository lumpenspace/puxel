import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type DialTone = "default" | "danger" | "info" | "accent" | "success";

export interface DialProps extends HTMLAttributes<HTMLDivElement> {
  /** Current amount of the gauge (clamped to 0..max). */
  value: number;
  /** Full amount. When <= 0 the ring is hidden and only the center shows. */
  max?: number;
  /** Colour of the draining fill arc. */
  tone?: DialTone;
  size?: "sm" | "md" | "lg";
  /** Centre content — a turn number, a countdown, an icon. */
  children?: ReactNode;
}

const R = 52;
const C = 2 * Math.PI * R;

export function Dial({
  value,
  max = 0,
  tone = "default",
  size = "md",
  children,
  className,
  ...rest
}: DialProps) {
  const hasRing = max > 0;
  const frac = hasRing ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div
      className={cn(
        "px-dial",
        size !== "md" && `px-dial--${size}`,
        tone !== "default" && `px-dial--${tone}`,
        className,
      )}
      {...rest}
    >
      {hasRing && (
        <svg className="px-dial-ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="px-dial-track" cx="60" cy="60" r={R} />
          <circle
            className="px-dial-fill"
            cx="60"
            cy="60"
            r={R}
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - frac) }}
          />
        </svg>
      )}
      <div className="px-dial-center">{children}</div>
    </div>
  );
}
