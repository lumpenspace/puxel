import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type CardTone = "default" | "accent" | "danger" | "info" | "success" | "warning";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** No drop shadow. */
  flat?: boolean;
  /** Lift on hover — for clickable cards. */
  hoverable?: boolean;
  /** Semantic frame/fill wash. */
  tone?: CardTone;
  /** Tighter header/body/footer padding. */
  compact?: boolean;
  /** Square tile for icons, inventory items, sprites, or small media. */
  tile?: boolean;
  /** Stepped 8-bit corner silhouette (clips the card and its content). */
  pixelated?: boolean;
  /** Pixel-rounded frame painted behind the content: children aren't clipped
      and every outer pixel reads as the border colour. */
  round?: boolean;
}

export function Card({
  flat,
  hoverable,
  tone = "default",
  compact,
  tile,
  pixelated,
  round,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "px-card",
        flat && "px-card--flat",
        hoverable && "px-card--hover",
        tone !== "default" && `px-card--${tone}`,
        compact && "px-card--compact",
        tile && "px-card--tile",
        pixelated && "px-pixelated",
        round && "px-card--round",
        className,
      )}
      {...rest}
    />
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
}

export function CardHeader({ accent, className, ...rest }: CardHeaderProps) {
  return (
    <div className={cn("px-card-header", accent && "px-card-header--accent", className)} {...rest} />
  );
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("px-card-title", className)} {...rest} />;
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-card-body", className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-card-footer", className)} {...rest} />;
}
