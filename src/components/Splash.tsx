import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SplashProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Blinking call-to-action line, e.g. "Press start". */
  prompt?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Game intro / hero panel with blinking prompt. */
export function Splash({ title, subtitle, prompt, children, className }: SplashProps) {
  return (
    <div className={cn("px-splash", className)}>
      <h1 className="px-splash-title">{title}</h1>
      {subtitle && <p className="px-splash-subtitle">{subtitle}</p>}
      {children}
      {prompt && <div className="px-splash-prompt">{prompt}</div>}
    </div>
  );
}
