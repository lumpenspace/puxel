import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface TooltipProps {
  content: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Hover/focus tooltip. Wrap exactly one focusable child. */
export function Tooltip({ content, className, children }: TooltipProps) {
  const id = useId();
  return (
    <span className={cn("px-tooltip-wrap", className)} aria-describedby={id}>
      {children}
      <span role="tooltip" id={id} className="px-tooltip">
        {content}
      </span>
    </span>
  );
}
