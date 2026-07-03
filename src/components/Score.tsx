import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface ScoreProps {
  label: string;
  value: number;
  /** Zero-pad to this many digits, arcade style. */
  digits?: number;
  /** Animate value changes by counting up/down. */
  animate?: boolean;
  /** Light variant on surface instead of ink. */
  surface?: boolean;
  className?: string;
}

/** Arcade score display: SCORE 00042350 */
export function Score({ label, value, digits = 8, animate = true, surface, className }: ScoreProps) {
  const [shown, setShown] = useState(value);
  const raf = useRef(0);

  useEffect(() => {
    if (!animate || typeof window === "undefined") {
      setShown(value);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(value);
      return;
    }
    const from = shown;
    const start = performance.now();
    const dur = 500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setShown(Math.round(from + (value - from) * t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animate]);

  return (
    <div className={cn("px-score", surface && "px-score--surface", className)}>
      <span className="px-score-label">{label}</span>
      <span className="px-score-value">{String(Math.max(0, shown)).padStart(digits, "0")}</span>
    </div>
  );
}

export interface StatProps {
  label: string;
  value: string;
  delta?: string;
  direction?: "up" | "down";
  className?: string;
}

/** Dashboard stat: label, big value, delta chip. */
export function Stat({ label, value, delta, direction = "up", className }: StatProps) {
  return (
    <div className={cn("px-stat", className)}>
      <div className="px-stat-label">{label}</div>
      <div className="px-stat-value">{value}</div>
      {delta && (
        <span className={cn("px-stat-delta", `px-stat-delta--${direction}`)}>
          {direction === "up" ? "▲" : "▼"} {delta}
        </span>
      )}
    </div>
  );
}
