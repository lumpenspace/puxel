import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render the label in the pixel display font. */
  pixel?: boolean;
  /** Square padding for icon-only buttons. Provide aria-label. */
  icon?: boolean;
  /** Stepped 8-bit corner silhouette. */
  pixelated?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "default", size = "md", pixel, icon, pixelated, className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "px-btn",
          variant !== "default" && `px-btn--${variant}`,
          size !== "md" && `px-btn--${size}`,
          pixel && "px-btn--pixel",
          icon && "px-btn--icon",
          pixelated && "px-pixelated",
          className,
        )}
        {...rest}
      />
    );
  },
);
