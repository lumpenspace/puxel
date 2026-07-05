import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { renderDither } from "../lib/dither";

export type FigureCaptionPosition = "below" | "above" | "staggered";

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
  caption?: ReactNode;
  /** Where the caption sits relative to the image. "staggered" overlaps it, tilted. */
  captionPosition?: FigureCaptionPosition;
  /** Stepped 8-bit corner silhouette on the image frame. */
  pixelated?: boolean;
  /** Theme-colored pixel/dither overlay (duotone Bayer dither) that dissipates on hover. */
  dither?: boolean;
  /** Dither cell size, in CSS px. */
  ditherCell?: number;
}

export function Figure({
  src,
  alt,
  caption,
  captionPosition = "below",
  pixelated,
  dither,
  ditherCell = 4,
  className,
  ...rest
}: FigureProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<() => void>(() => {});
  const progressRef = useRef(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!dither) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const draw = () => {
      const styles = getComputedStyle(canvas);
      const colorA = styles.getPropertyValue("--px-ink").trim() || "#16130d";
      const colorB = styles.getPropertyValue("--px-accent").trim() || "#ffd23f";
      renderDither(canvas, img, colorA, colorB, ditherCell, progressRef.current);
    };
    drawRef.current = draw;

    if (img.complete && img.naturalWidth > 0) draw();

    // Observe the media wrapper, not the canvas itself: a ResizeObserver on
    // a <canvas> whose width/height attributes you mutate inside the
    // callback re-triggers itself (canvas replaced-content box counts as a
    // size change), which loops forever.
    const resizeObserver = new ResizeObserver(draw);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
    };
  }, [dither, src, ditherCell]);

  // Animates progressRef toward `target` (0 = full dither, 1 = full image)
  // and redraws each frame. The shader itself staggers each grid cell's own
  // pop-in randomly across that progress range, so the timing here is kept
  // linear (no easing) and slow enough (900ms) that the cell-by-cell swap
  // reads clearly instead of blurring into what looks like a plain fade.
  const animateTo = (target: number) => {
    if (animRef.current != null) cancelAnimationFrame(animRef.current);
    const duration = 900;
    const start = progressRef.current;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      progressRef.current = start + (target - start) * t;
      drawRef.current();
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(step);
  };

  const figcaption = caption != null && (
    <figcaption
      className={cn(
        "px-figure-caption",
        captionPosition === "above" && "px-figure-caption--above",
        captionPosition === "staggered" && "px-figure-caption--staggered",
      )}
    >
      {caption}
    </figcaption>
  );

  return (
    <figure className={cn("px-figure", className)} {...rest}>
      {captionPosition === "above" && figcaption}
      <div
        className={cn("px-figure-media", pixelated && "px-pixelated")}
        onMouseEnter={dither ? () => animateTo(1) : undefined}
        onMouseLeave={dither ? () => animateTo(0) : undefined}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          crossOrigin={dither ? "anonymous" : undefined}
          onLoad={() => drawRef.current()}
        />
        {dither && <canvas ref={canvasRef} className="px-figure-dither" aria-hidden="true" />}
      </div>
      {captionPosition !== "above" && figcaption}
    </figure>
  );
}
