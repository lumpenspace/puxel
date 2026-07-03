import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type AvatarStatus = "online" | "away" | "busy" | "offline";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** Initials fallback when no image. */
  initials?: string;
  size?: "sm" | "md" | "lg";
  status?: AvatarStatus;
}

export function Avatar({ src, alt, initials, size = "md", status, className, ...rest }: AvatarProps) {
  return (
    <span
      className={cn("px-avatar", size !== "md" && `px-avatar--${size}`, className)}
      {...rest}
    >
      {src ? <img src={src} alt={alt ?? ""} /> : initials}
      {status && (
        <span
          className={cn("px-avatar-status", status !== "online" && `px-avatar-status--${status}`)}
          aria-label={status}
        />
      )}
    </span>
  );
}

export function AvatarGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-avatar-group", className)} {...rest} />;
}
