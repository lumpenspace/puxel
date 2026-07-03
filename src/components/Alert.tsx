import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const ICONS: Record<AlertVariant, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "✕",
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
}

export function Alert({ variant = "info", title, children, className, ...rest }: AlertProps) {
  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={cn("px-alert", `px-alert--${variant}`, className)}
      {...rest}
    >
      <span className="px-alert-icon" aria-hidden="true">
        {ICONS[variant]}
      </span>
      <div>
        {title && <p className="px-alert-title">{title}</p>}
        <p className="px-alert-body">{children}</p>
      </div>
    </div>
  );
}
