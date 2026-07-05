import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { PixelShader, type PixelShaderProps } from "./PixelShader";

export interface SplashProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Blinking call-to-action line, e.g. "Press start". */
  prompt?: ReactNode;
  /** Animated pixel-shader background: `true` for defaults, or PixelShader props. */
  shader?: boolean | PixelShaderProps;
  children?: ReactNode;
  className?: string;
}

/** Game intro / hero panel with blinking prompt. */
export function Splash({ title, subtitle, prompt, shader, children, className }: SplashProps) {
  return (
    <div className={cn("px-splash", className)}>
      {shader && <PixelShader {...(typeof shader === "object" ? shader : undefined)} />}
      <h1 className="px-splash-title">{title}</h1>
      {subtitle && <p className="px-splash-subtitle">{subtitle}</p>}
      {children}
      {prompt && <div className="px-splash-prompt">{prompt}</div>}
    </div>
  );
}
