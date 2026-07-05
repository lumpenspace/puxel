import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

// Pixel-art glyphs from the Pixel Icon Library (@hackernoon/pixel-icon-library),
// imported raw and injected inline so they tint with `currentColor` (the paths
// ship unfilled — see .px-icon) and scale with font-size. Curated set; the raw
// SVG strings are bundled into the package, so consumers need no icon dependency.
import times from "@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg?raw";
import check from "@hackernoon/pixel-icon-library/icons/SVG/regular/check.svg?raw";
import comment from "@hackernoon/pixel-icon-library/icons/SVG/regular/comment.svg?raw";
import soundOn from "@hackernoon/pixel-icon-library/icons/SVG/regular/sound-on.svg?raw";
import soundMute from "@hackernoon/pixel-icon-library/icons/SVG/regular/sound-mute.svg?raw";
import music from "@hackernoon/pixel-icon-library/icons/SVG/regular/music.svg?raw";
import angleLeft from "@hackernoon/pixel-icon-library/icons/SVG/regular/angle-left.svg?raw";
import angleRight from "@hackernoon/pixel-icon-library/icons/SVG/regular/angle-right.svg?raw";
import angleUp from "@hackernoon/pixel-icon-library/icons/SVG/regular/angle-up.svg?raw";
import angleDown from "@hackernoon/pixel-icon-library/icons/SVG/regular/angle-down.svg?raw";
import play from "@hackernoon/pixel-icon-library/icons/SVG/regular/play.svg?raw";
import pause from "@hackernoon/pixel-icon-library/icons/SVG/regular/pause.svg?raw";
import expand from "@hackernoon/pixel-icon-library/icons/SVG/regular/expand.svg?raw";
import star from "@hackernoon/pixel-icon-library/icons/SVG/regular/star.svg?raw";
import heart from "@hackernoon/pixel-icon-library/icons/SVG/regular/heart.svg?raw";
import heartSolid from "@hackernoon/pixel-icon-library/icons/SVG/solid/heart-solid.svg?raw";
import search from "@hackernoon/pixel-icon-library/icons/SVG/regular/search.svg?raw";
import user from "@hackernoon/pixel-icon-library/icons/SVG/regular/user.svg?raw";
import cog from "@hackernoon/pixel-icon-library/icons/SVG/regular/cog.svg?raw";
import home from "@hackernoon/pixel-icon-library/icons/SVG/regular/home.svg?raw";
import plus from "@hackernoon/pixel-icon-library/icons/SVG/regular/plus.svg?raw";
import minus from "@hackernoon/pixel-icon-library/icons/SVG/regular/minus.svg?raw";
import trash from "@hackernoon/pixel-icon-library/icons/SVG/regular/trash.svg?raw";
import bars from "@hackernoon/pixel-icon-library/icons/SVG/regular/bars.svg?raw";
import clock from "@hackernoon/pixel-icon-library/icons/SVG/regular/clock.svg?raw";
import github from "@hackernoon/pixel-icon-library/icons/SVG/brands/github.svg?raw";
import npm from "@hackernoon/pixel-icon-library/icons/SVG/brands/npm.svg?raw";

const ICONS = {
  times,
  check,
  comment,
  "sound-on": soundOn,
  "sound-mute": soundMute,
  music,
  "angle-left": angleLeft,
  "angle-right": angleRight,
  "angle-up": angleUp,
  "angle-down": angleDown,
  play,
  pause,
  expand,
  star,
  heart,
  "heart-solid": heartSolid,
  search,
  user,
  cog,
  home,
  plus,
  minus,
  trash,
  bars,
  clock,
  github,
  npm,
};

export type IconName = keyof typeof ICONS;

/** The names available to <Icon name>. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

// drop the XML prolog so the markup injects cleanly as inline HTML
const clean = (svg: string) => svg.replace(/<\?xml[^?]*\?>/, "");

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: IconName;
  /** Pixel size (sets font-size; the glyph renders at 1em). Defaults to inherited font-size. */
  size?: number;
}

export function Icon({ name, size, className, style, ...rest }: IconProps) {
  const svg = ICONS[name];
  if (!svg) return null;
  return (
    <span
      aria-hidden="true"
      {...rest}
      className={cn("px-icon", className)}
      style={size ? { fontSize: size, ...style } : style}
      dangerouslySetInnerHTML={{ __html: clean(svg) }}
    />
  );
}
