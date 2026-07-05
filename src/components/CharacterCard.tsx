import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type CharacterCardTone = "default" | "danger" | "info" | "accent";
export type CharacterCardState = "idle" | "talking" | "thinking";

export interface CharacterCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Avatar element (e.g. a <SpriteAvatar>) rendered in the left slot. */
  avatar?: ReactNode;
  name?: ReactNode;
  role?: ReactNode;
  /** Secondary identity line, e.g. a model name with a glyph. */
  model?: ReactNode;
  /** Status line (e.g. "speaking", "thinking…"). */
  status?: ReactNode;
  /** Washes the frame + border in a semantic colour. */
  tone?: CharacterCardTone;
  /** Retints the border for a transient state. */
  state?: CharacterCardState;
  /** Square corners with a hard offset shadow instead of the pixel-rounded frame. */
  square?: boolean;
  /** Row for roster/sidebar cards, stack for portrait cards. */
  layout?: "row" | "stack";
  /** Tighter spacing for dense rosters and preview cards. */
  compact?: boolean;
  /** Extra content after the info stack (e.g. a speech bubble). */
  children?: ReactNode;
}

export function CharacterCard({
  avatar,
  name,
  role,
  model,
  status,
  tone = "default",
  state = "idle",
  square,
  layout = "row",
  compact,
  className,
  children,
  ...rest
}: CharacterCardProps) {
  return (
    <div
      className={cn(
        "px-character-card",
        tone !== "default" && `px-character-card--${tone}`,
        state !== "idle" && `px-character-card--${state}`,
        square && "px-character-card--square",
        layout !== "row" && `px-character-card--${layout}`,
        compact && "px-character-card--compact",
        className,
      )}
      {...rest}
    >
      {avatar != null && <div className="px-character-card-avatar">{avatar}</div>}
      <div className="px-character-card-info">
        {name != null && <div className="px-character-card-name">{name}</div>}
        {role != null && <div className="px-character-card-role">{role}</div>}
        {model != null && <div className="px-character-card-model">{model}</div>}
        {status != null && <div className="px-character-card-status">{status}</div>}
      </div>
      {children}
    </div>
  );
}
