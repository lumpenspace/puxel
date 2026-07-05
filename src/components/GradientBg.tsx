import { useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type GradientBgDirection =
  | "right"
  | "left"
  | "down"
  | "up"
  | "down-right"
  | "down-left"
  | "up-right"
  | "up-left";

export interface GradientBgProps extends HTMLAttributes<HTMLDivElement> {
  /** CSS colors or custom property names ("--px-accent"), dark/strong to light/quiet. */
  colors?: readonly string[];
  /** Direction the gradient travels across the square-pixel field. */
  direction?: GradientBgDirection;
  /** CSS pixels per square. */
  pixelation?: number;
  /** Ordered dithering between neighboring color steps. */
  dither?: boolean;
  /** Lay out as a normal block instead of filling the nearest positioned ancestor. */
  block?: boolean;
}

const DEFAULT_COLORS = ["--px-accent", "--px-surface-2", "--px-bg"];
const FALLBACK_COLORS = ["#ffd23f", "#fff4b8", "#faf3e3"];
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function resolveCssColor(host: HTMLElement, styles: CSSStyleDeclaration, color: string, fallback: string) {
  const raw = color.startsWith("--") ? styles.getPropertyValue(color).trim() : color;
  if (!raw) return fallback;
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.color = raw;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || fallback;
}

function progressForDirection(direction: GradientBgDirection, x: number, y: number, cols: number, rows: number) {
  const nx = x / Math.max(1, cols - 1);
  const ny = y / Math.max(1, rows - 1);
  switch (direction) {
    case "left":
      return 1 - nx;
    case "down":
      return ny;
    case "up":
      return 1 - ny;
    case "down-right":
      return (nx + ny) / 2;
    case "down-left":
      return (1 - nx + ny) / 2;
    case "up-right":
      return (nx + 1 - ny) / 2;
    case "up-left":
      return (1 - nx + 1 - ny) / 2;
    case "right":
    default:
      return nx;
  }
}

export function GradientBg({
  colors,
  direction = "down-right",
  pixelation = 12,
  dither = true,
  block,
  className,
  ...rest
}: GradientBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsKey = (colors && colors.length ? colors : DEFAULT_COLORS).join("|");

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !(host instanceof HTMLElement)) return undefined;

    let raf = 0;
    const names = colorsKey.split("|").filter(Boolean);

    const draw = () => {
      raf = 0;
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const styles = getComputedStyle(host);
      const cell = Math.max(2, Math.round(pixelation * dpr));
      const palette = names.map((name, index) =>
        resolveCssColor(host, styles, name, FALLBACK_COLORS[index % FALLBACK_COLORS.length])
      );
      while (palette.length < 2) palette.push(palette[palette.length - 1] ?? FALLBACK_COLORS[0]);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const scaled = progressForDirection(direction, x, y, cols, rows) * (palette.length - 1);
          const base = Math.min(palette.length - 1, Math.floor(scaled));
          const next = Math.min(palette.length - 1, base + 1);
          const threshold = (BAYER4[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
          const colorIndex = dither ? (scaled - base > threshold ? next : base) : Math.round(scaled);
          ctx.fillStyle = palette[Math.min(palette.length - 1, colorIndex)];
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    };

    const scheduleDraw = () => {
      if (raf === 0) raf = requestAnimationFrame(draw);
    };

    scheduleDraw();
    const resizeObserver = new ResizeObserver(scheduleDraw);
    resizeObserver.observe(host);
    const mutationObserver = new MutationObserver(scheduleDraw);
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    mutationObserver.observe(host, { attributes: true, attributeFilter: ["class", "style"] });

    return () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [colorsKey, direction, pixelation, dither]);

  return (
    <div
      aria-hidden="true"
      {...rest}
      className={cn("px-gradient-bg", block && "px-gradient-bg--block", className)}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
