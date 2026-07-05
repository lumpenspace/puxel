import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

/* Animated sprite-sheet avatar. A sheet is a uniform grid (cols × rows); each
   row is one animation clip. A clip plays through its non-empty frames once,
   holds a rest frame, then replays after a pause — rather than looping nonstop.
   The generic engine here knows nothing about what the sheets depict; a
   consumer supplies the sheet URL, the grid size, and a state→row map. */

export interface SpriteState {
  /** 0-indexed row of the sheet this clip lives on. */
  row: number;
  /** Frames per second for the clip. */
  fps: number;
  /** Cycle forever vs. play once and hold the last frame. */
  loop?: boolean;
  /** A one-shot reaction that finishes even if `state` flips back mid-clip. */
  latch?: boolean;
}

export const DEFAULT_SHEET_COLS = 8;
export const DEFAULT_SHEET_ROWS = 9;
export const DEFAULT_IDLE_REST_MS = 9000;
export const DEFAULT_ACTIVE_REST_MS = 3000;

/** A reasonable default clip map for an 8×9 character sheet. */
export const DEFAULT_SPRITE_STATES: Record<string, SpriteState> = {
  idle: { row: 0, fps: 6, loop: true },
  correct: { row: 3, fps: 10, loop: false, latch: true },
  victory: { row: 4, fps: 8, loop: true },
  loss: { row: 5, fps: 7, loop: false },
  talking: { row: 6, fps: 9, loop: true },
  thinking: { row: 7, fps: 6, loop: true },
};

export interface SpriteAvatarProps {
  /** URL of the sprite sheet PNG. */
  sheetUrl: string;
  cols?: number;
  rows?: number;
  /** state name → clip spec. Defaults to DEFAULT_SPRITE_STATES. */
  states?: Record<string, SpriteState>;
  /** Which clip to play. Unknown names fall back to `idle`. */
  state?: string;
  /** Full body (perched, overflowing) vs. a static clipped head crop. */
  mode?: "full" | "face";
  /** Mirror horizontally (e.g. to face the other way). */
  flip?: boolean;
  idleRestMs?: number;
  activeRestMs?: number;
  /** Rendered instead of the sprite if the sheet fails to load. */
  fallback?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Per-sheet cache of how many non-empty frames each row actually has, so we
// never animate into a transparent trailing cell. Keyed by sheet URL.
const frameCache = new Map<string, number[]>();

function detectFrames(img: HTMLImageElement, url: string, cols: number, rows: number): number[] {
  const cached = frameCache.get(url);
  if (cached) return cached;
  const cw = Math.floor(img.naturalWidth / cols);
  const ch = Math.floor(img.naturalHeight / rows);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0);
  const counts: number[] = [];
  for (let row = 0; row < rows; row += 1) {
    let last = 0;
    for (let col = 0; col < cols; col += 1) {
      const { data } = ctx.getImageData(col * cw, row * ch, cw, ch);
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 8) {
          last = col + 1;
          break;
        }
      }
    }
    counts.push(Math.max(1, last));
  }
  frameCache.set(url, counts);
  return counts;
}

export function SpriteAvatar({
  sheetUrl,
  cols = DEFAULT_SHEET_COLS,
  rows = DEFAULT_SHEET_ROWS,
  states = DEFAULT_SPRITE_STATES,
  state = "idle",
  mode = "full",
  flip = false,
  idleRestMs = DEFAULT_IDLE_REST_MS,
  activeRestMs = DEFAULT_ACTIVE_REST_MS,
  fallback,
  className,
  style,
}: SpriteAvatarProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [frame, setFrame] = useState(0);
  const countsRef = useRef<number[]>([]);
  // Latched one-shot state — lets a quick reaction (e.g. a correct guess)
  // finish even after the driver resets `state` back a moment later.
  const [latched, setLatched] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const im = new Image();
    im.onload = () => {
      if (!alive) return;
      try {
        countsRef.current = detectFrames(im, sheetUrl, cols, rows);
      } catch {
        countsRef.current = [];
      }
      setImg(im);
    };
    im.onerror = () => {
      if (alive) setFailed(true);
    };
    im.src = sheetUrl;
    return () => {
      alive = false;
    };
  }, [sheetUrl, cols, rows]);

  useEffect(() => {
    if (states[state]?.latch) setLatched(state);
  }, [state, states]);

  const active = (latched && states[latched] ? latched : state) || "idle";
  const spec = states[active] ?? states.idle ?? { row: 0, fps: 6, loop: true };

  useEffect(() => {
    if (mode !== "full" || !img) return undefined;
    const count = countsRef.current[spec.row] || 1;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setFrame(0);
      return undefined;
    }
    const restMs = active === "idle" ? idleRestMs : activeRestMs;
    let raf = 0;
    let timer = 0 as ReturnType<typeof setTimeout> | 0;
    let start: number | null = null;
    const play = (t: number) => {
      if (start == null) start = t;
      const i = Math.floor(((t - start) / 1000) * spec.fps);
      if (i < count) {
        setFrame(i);
        raf = requestAnimationFrame(play);
      } else if (spec.latch && latched === active) {
        setFrame(count - 1);
        setLatched(null);
      } else {
        setFrame(0);
        timer = setTimeout(() => {
          start = null;
          raf = requestAnimationFrame(play);
        }, restMs);
      }
    };
    raf = requestAnimationFrame(play);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, img, active, spec.row, spec.fps, spec.latch]);

  if (failed) {
    return <>{fallback ?? <span className={cn("px-sprite", className)} style={style} />}</>;
  }

  const col = mode === "face" ? 0 : frame;
  const row = mode === "face" ? 0 : spec.row;
  const frameStyle: CSSProperties = {
    backgroundImage: img ? `url(${sheetUrl})` : undefined,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`,
  };
  return (
    <div
      className={cn("px-sprite", `px-sprite--${mode}`, className)}
      style={{ ...style, ["--px-sprite-flipx" as string]: flip ? -1 : 1 }}
    >
      <div className="px-sprite-frame" style={frameStyle} />
    </div>
  );
}
