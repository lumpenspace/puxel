import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type HighlightTone = "accent" | "info" | "success" | "warning" | "danger";

export interface HighlightProps extends HTMLAttributes<HTMLElement> {
  tone?: HighlightTone;
  /** Draw a small hard-offset shadow under the mark. */
  raised?: boolean;
}

export function Highlight({
  tone = "accent",
  raised = true,
  className,
  ...rest
}: HighlightProps) {
  return (
    <mark
      className={cn(
        "px-highlight",
        tone !== "accent" && `px-highlight--${tone}`,
        raised && "px-highlight--raised",
        className,
      )}
      {...rest}
    />
  );
}
