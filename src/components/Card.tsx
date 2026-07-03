import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** No drop shadow. */
  flat?: boolean;
  /** Lift on hover — for clickable cards. */
  hoverable?: boolean;
}

export function Card({ flat, hoverable, className, ...rest }: CardProps) {
  return (
    <div
      className={cn("px-card", flat && "px-card--flat", hoverable && "px-card--hover", className)}
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
