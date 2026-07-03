import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Render in the pixel display font. */
  pixel?: boolean;
}

export function Badge({ variant = "default", pixel, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-badge",
        variant !== "default" && `px-badge--${variant}`,
        pixel && "px-badge--pixel",
        className,
      )}
      {...rest}
    />
  );
}
