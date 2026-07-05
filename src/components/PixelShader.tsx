import { useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { getPixelShaderRenderer, type Rgb01 } from "../lib/shader";

export type PixelShaderPattern = "plasma" | "ripple" | "waves";

const PATTERN_INDEX: Record<PixelShaderPattern, number> = { plasma: 0, ripple: 1, waves: 2 };

// Default palette: the theme's own quiet ramp, so the field sits behind hero
// text without fighting it. Resolved at the canvas, so any ancestor
// [data-theme] applies.
const DEFAULT_COLORS = ["--px-bg", "--px-surface", "--px-surface-2", "--px-accent"];

// The animation ticks on a coarse clock so the field crawls like a demo
// effect instead of gliding — motion quantization is the whole retro trick.
const TICKS_PER_SECOND = 12;

let probeCtx: CanvasRenderingContext2D | null = null;
/** Normalize any CSS color (hex, rgb(), named…) to 0..1 RGB via a 1x1 canvas. */
function colorTo01(color: string): Rgb01 {
  if (!probeCtx) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    probeCtx = c.getContext("2d", { willReadFrequently: true });
  }
  if (!probeCtx) return [0, 0, 0];
  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillStyle = "#000";
  probeCtx.fillStyle = color;
  probeCtx.fillRect(0, 0, 1, 1);
  const d = probeCtx.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}

export interface PixelShaderProps extends HTMLAttributes<HTMLDivElement> {
  pattern?: PixelShaderPattern;
  /** CSS px per shader cell (chunkiness). */
  cell?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /**
   * 4-color palette, dark → bright. Entries are any CSS color or a custom
   * property name ("--px-accent"), resolved at the canvas. Defaults to the
   * theme's bg → surface → surface-2 → accent ramp.
   */
  colors?: string[];
  /** Dissolve the field cell-by-cell (ordered dither), and back. */
  dissolved?: boolean;
  /** Duration of the dissolve transition. */
  dissolveMs?: number;
  /** Fires when a dissolve (or re-materialize) transition completes. */
  onDissolveEnd?: (dissolved: boolean) => void;
  /** Freeze the animation (dissolve still applies, instantly). */
  paused?: boolean;
  /** Lay out as a normal block instead of filling the nearest positioned ancestor. */
  block?: boolean;
}

/**
 * Hero shader: an animated, Bayer-dithered field quantized to theme colors,
 * rendered on a coarse pixel grid (WebGL). By default it absolutely fills its
 * nearest positioned ancestor — drop it into any hero/panel as a background
 * layer (see <Splash shader>). Honors prefers-reduced-motion by holding a
 * static frame. Degrades to nothing (transparent) without WebGL.
 */
export function PixelShader({
  pattern = "plasma",
  cell = 6,
  speed = 1,
  colors,
  dissolved = false,
  dissolveMs = 900,
  onDissolveEnd,
  paused = false,
  block,
  className,
  ...rest
}: PixelShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ time: 0, progress: dissolved ? 1 : 0, target: dissolved ? 1 : 0 });
  const endRef = useRef(onDissolveEnd);
  endRef.current = onDissolveEnd;

  // retarget the dissolve without tearing down the render loop
  useEffect(() => {
    stateRef.current.target = dissolved ? 1 : 0;
  }, [dissolved]);

  const colorsKey = (colors && colors.length ? colors : DEFAULT_COLORS).join("|");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = getPixelShaderRenderer(canvas);
    if (!renderer) return;

    const names = colorsKey.split("|");
    const resolvePalette = (): Rgb01[] => {
      const cs = getComputedStyle(canvas);
      const raw = names.map((n) => (n.startsWith("--") ? cs.getPropertyValue(n).trim() || "#000" : n));
      while (raw.length < 4) raw.push(raw[raw.length - 1] ?? "#000");
      return raw.slice(0, 4).map(colorTo01);
    };
    let palette = resolvePalette();

    const st = stateRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = () =>
      renderer.render({
        time: Math.floor(st.time * TICKS_PER_SECOND) / TICKS_PER_SECOND,
        cellPx: cell,
        pattern: PATTERN_INDEX[pattern],
        dissolve: st.progress,
        colors: palette,
      });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!reduced.matches) st.time += dt * speed;
      if (st.progress !== st.target) {
        if (reduced.matches || dissolveMs <= 0) {
          st.progress = st.target;
        } else {
          const step = (dt * 1000) / dissolveMs;
          st.progress =
            st.target > st.progress
              ? Math.min(st.target, st.progress + step)
              : Math.max(st.target, st.progress - step);
        }
        if (st.progress === st.target) endRef.current?.(st.target === 1);
      }
      draw();
    };

    if (paused) {
      st.progress = st.target;
      draw();
    } else {
      raf = requestAnimationFrame(frame);
    }

    // re-render on resize (the loop would catch it, but paused shaders won't)
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    // follow theme switches anywhere in the document
    const themeWatch = new MutationObserver(() => {
      palette = resolvePalette();
      if (paused) draw();
    });
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeWatch.disconnect();
    };
  }, [pattern, cell, speed, colorsKey, paused, dissolveMs]);

  return (
    <div
      aria-hidden="true"
      {...rest}
      className={cn("px-shader", block && "px-shader--block", className)}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
