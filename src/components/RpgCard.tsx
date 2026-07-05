import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { GradientBg } from "./GradientBg";

export type RpgStatBarTone =
  | "hp"
  | "mp"
  | "xp"
  | "accent"
  | "danger"
  | "info"
  | "success"
  | "warning"
  | "generic";

export interface RpgStatBar {
  value: number;
  max: number;
  label?: ReactNode;
  /** Right-side readout. Defaults to "value/max" when the meter shows values. */
  valueLabel?: ReactNode;
  /** Defaults vary by component slot: profile bars show values, EXP card bars do not. */
  showValue?: boolean;
  tone?: RpgStatBarTone;
  ariaLabel?: string;
}

export type RpgCardTone = "default" | "accent" | "danger" | "info" | "success" | "warning";

export interface RpgCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  avatar?: ReactNode;
  level?: ReactNode | number;
  hp?: RpgStatBar;
  exp?: RpgStatBar;
  tone?: RpgCardTone;
}

export interface PlayerProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  avatar?: ReactNode;
  /** Dedicated HP bar prop. */
  hp?: RpgStatBar;
  /** Dedicated MP bar prop. */
  mp?: RpgStatBar;
  /** Dedicated XP bar prop. */
  xp?: RpgStatBar;
  compact?: boolean;
}

interface RpgMeterProps {
  bar: RpgStatBar;
  defaultLabel: ReactNode;
  defaultTone: RpgStatBarTone;
  defaultShowValue: boolean;
}

const RPG_CARD_AVATAR_BG_COLORS = [
  "--px-rpg-card-avatar-bg-0",
  "--px-rpg-card-avatar-bg-1",
  "--px-rpg-card-avatar-bg-2",
  "--px-rpg-card-avatar-bg-3",
  "--px-rpg-card-avatar-bg-4",
  "--px-rpg-card-avatar-bg-5",
  "--px-rpg-card-avatar-bg-6",
];

function percent(value: number, max: number) {
  return max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
}

function RpgCardAvatar({ children }: { children: ReactNode }) {
  return (
    <div className="px-rpg-card-avatar">
      <GradientBg
        className="px-rpg-card-avatar-bg"
        colors={RPG_CARD_AVATAR_BG_COLORS}
        direction="down-right"
        pixelation={12}
      />
      <div className="px-rpg-card-avatar-content">{children}</div>
    </div>
  );
}

function RpgMeter({ bar, defaultLabel, defaultTone, defaultShowValue }: RpgMeterProps) {
  const label = bar.label ?? defaultLabel;
  const tone = bar.tone ?? defaultTone;
  const showValue = bar.showValue ?? defaultShowValue;
  const valueLabel = bar.valueLabel ?? `${bar.value}/${bar.max}`;
  const ariaLabel = bar.ariaLabel ?? (typeof label === "string" ? label : "Stat");

  return (
    <div
      className={cn("px-rpg-meter", !showValue && "px-rpg-meter--no-value")}
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={bar.max}
      aria-valuenow={bar.value}
    >
      <span className="px-rpg-meter-label">{label}</span>
      <span className="px-rpg-meter-track" aria-hidden="true">
        <span
          className={cn("px-rpg-meter-fill", `px-rpg-meter-fill--${tone}`)}
          style={{ "--px-rpg-meter-value": `${percent(bar.value, bar.max)}%` } as CSSProperties}
        />
      </span>
      {showValue && <span className="px-rpg-meter-value">{valueLabel}</span>}
    </div>
  );
}

export function RpgCard({
  title,
  avatar,
  level,
  hp,
  exp,
  tone = "default",
  className,
  children,
  ...rest
}: RpgCardProps) {
  const levelText = typeof level === "number" ? `LV. ${level}` : level;

  return (
    <div
      className={cn("px-rpg-card", tone !== "default" && `px-rpg-card--${tone}`, className)}
      {...rest}
    >
      {title != null && <div className="px-rpg-card-title">{title}</div>}
      {avatar != null && <RpgCardAvatar>{avatar}</RpgCardAvatar>}
      {levelText != null && <div className="px-rpg-card-level">{levelText}</div>}
      {(hp != null || exp != null) && (
        <div className="px-rpg-card-stats">
          {hp != null && <RpgMeter bar={hp} defaultLabel="HP" defaultTone="hp" defaultShowValue />}
          {exp != null && <RpgMeter bar={exp} defaultLabel="EXP" defaultTone="xp" defaultShowValue={false} />}
        </div>
      )}
      {children}
    </div>
  );
}

export function PlayerProfile({
  title,
  avatar,
  hp,
  mp,
  xp,
  compact,
  className,
  children,
  ...rest
}: PlayerProfileProps) {
  return (
    <div className={cn("px-player-profile", compact && "px-player-profile--compact", className)} {...rest}>
      {title != null && <div className="px-player-profile-title">{title}</div>}
      <div className="px-player-profile-body">
        {avatar != null && <div className="px-player-profile-avatar">{avatar}</div>}
        <div className="px-player-profile-bars">
          {hp != null && <RpgMeter bar={hp} defaultLabel="HP" defaultTone="hp" defaultShowValue />}
          {mp != null && <RpgMeter bar={mp} defaultLabel="MP" defaultTone="mp" defaultShowValue />}
          {xp != null && <RpgMeter bar={xp} defaultLabel="XP" defaultTone="xp" defaultShowValue />}
        </div>
      </div>
      {children}
    </div>
  );
}
