import { useEffect, useMemo, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { PixelShader } from "./PixelShader";

export type GlobalAnimationVariant = "confetti" | "burst" | "sparkles" | "coin-rain" | "scanline";
export type GlobalAnimationTone = "default" | "accent" | "success" | "danger" | "info" | "warning";

interface Particle {
  x: string;
  y: string;
  tx: string;
  ty: string;
  drift: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  spin: string;
}

export interface GlobalAnimationProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlobalAnimationVariant;
  tone?: GlobalAnimationTone;
  /** Number of animated bits. Defaults per variant. */
  count?: number;
  /** Total lifetime in milliseconds before onComplete fires. */
  duration?: number;
  /** Keep the animation running until unmounted. */
  loop?: boolean;
  /** Stable value used to generate a repeatable field. Change it to replay. */
  seed?: string | number;
  /** Called after duration when loop is false. */
  onComplete?: () => void;
}

export interface ConfettiProps extends Omit<GlobalAnimationProps, "variant"> {}

const DEFAULT_COUNT: Record<GlobalAnimationVariant, number> = {
  confetti: 70,
  burst: 28,
  sparkles: 34,
  "coin-rain": 44,
  scanline: 8,
};

const DEFAULT_DURATION: Record<GlobalAnimationVariant, number> = {
  confetti: 4200,
  burst: 1300,
  sparkles: 1900,
  "coin-rain": 3400,
  scanline: 1500,
};

const PALETTES: Record<GlobalAnimationTone, string[]> = {
  default: ["var(--px-accent)", "var(--px-accent-2)", "var(--px-info)", "var(--px-danger)", "var(--px-ink)"],
  accent: ["var(--px-accent)", "var(--px-accent-2)", "var(--px-warning)", "var(--px-ink)", "var(--px-surface)"],
  success: ["var(--px-success)", "var(--px-accent)", "var(--px-accent-2)", "var(--px-ink)", "var(--px-surface)"],
  danger: ["var(--px-danger)", "var(--px-accent-2)", "var(--px-warning)", "var(--px-ink)", "var(--px-surface)"],
  info: ["var(--px-info)", "var(--px-accent-2)", "var(--px-accent)", "var(--px-ink)", "var(--px-surface)"],
  warning: ["var(--px-warning)", "var(--px-accent)", "var(--px-accent-2)", "var(--px-ink)", "var(--px-surface)"],
};

const BURST_SHADER_COLORS: Record<GlobalAnimationTone, string[]> = {
  default: ["--px-bg", "--px-accent", "--px-info", "--px-surface"],
  accent: ["--px-bg", "--px-accent", "--px-accent-2", "--px-warning"],
  success: ["--px-bg", "--px-success", "--px-accent", "--px-surface"],
  danger: ["--px-bg", "--px-danger", "--px-accent-2", "--px-warning"],
  info: ["--px-bg", "--px-info", "--px-accent-2", "--px-surface"],
  warning: ["--px-bg", "--px-warning", "--px-accent", "--px-surface"],
};

function hashSeed(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function between(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}

function makeParticles(variant: GlobalAnimationVariant, count: number, tone: GlobalAnimationTone, seed: string | number) {
  const rand = mulberry32(hashSeed(`${variant}:${tone}:${seed}:${count}`));
  const colors = PALETTES[tone];

  return Array.from({ length: count }, (_, i): Particle => {
    const angle = (Math.PI * 2 * i) / count + between(rand, -0.22, 0.22);
    const distance = between(rand, 90, 380);
    const x = `${between(rand, 2, 98).toFixed(2)}vw`;
    const y = `${between(rand, 8, 92).toFixed(2)}vh`;
    const size = Math.round(between(rand, 6, variant === "sparkles" ? 18 : 14));

    if (variant === "burst") {
      return {
        x: "50vw",
        y: "48vh",
        tx: `${Math.cos(angle) * distance}px`,
        ty: `${Math.sin(angle) * distance}px`,
        drift: "0px",
        size,
        color: colors[i % colors.length],
        duration: Math.round(between(rand, 780, 1240)),
        delay: Math.round(between(rand, 0, 90)),
        spin: `${Math.round(between(rand, 120, 520))}deg`,
      };
    }

    if (variant === "scanline") {
      return {
        x: "-18vw",
        y: `${((i + 1) / (count + 1)) * 100}vh`,
        tx: "138vw",
        ty: `${Math.round(between(rand, -18, 18))}px`,
        drift: "0px",
        size: Math.round(between(rand, 8, 18)),
        color: colors[i % colors.length],
        duration: Math.round(between(rand, 680, 1180)),
        delay: Math.round(i * 95 + between(rand, 0, 120)),
        spin: "0deg",
      };
    }

    return {
      x,
      y,
      tx: `${Math.cos(angle) * distance}px`,
      ty: `${Math.sin(angle) * distance}px`,
      drift: `${Math.round(between(rand, -84, 84))}px`,
      size,
      color: colors[i % colors.length],
      duration:
        variant === "confetti"
          ? Math.round(between(rand, 2300, 3900))
          : variant === "coin-rain"
            ? Math.round(between(rand, 1700, 3000))
            : Math.round(between(rand, 760, 1520)),
      delay:
        variant === "confetti"
          ? Math.round(between(rand, 0, 780))
          : variant === "coin-rain"
            ? Math.round(between(rand, 0, 760))
            : Math.round(between(rand, 0, 520)),
      spin: `${Math.round(between(rand, 90, 540))}deg`,
    };
  });
}

function particleStyle(p: Particle, loop: boolean): CSSProperties {
  return {
    "--px-ga-x": p.x,
    "--px-ga-y": p.y,
    "--px-ga-tx": p.tx,
    "--px-ga-ty": p.ty,
    "--px-ga-drift": p.drift,
    "--px-ga-size": `${p.size}px`,
    "--px-ga-color": p.color,
    "--px-ga-piece-duration": `${p.duration}ms`,
    "--px-ga-piece-delay": `${p.delay}ms`,
    "--px-ga-spin": p.spin,
    animationIterationCount: loop ? "infinite" : undefined,
  } as CSSProperties;
}

export function GlobalAnimation({
  variant = "confetti",
  tone = "accent",
  count,
  duration,
  loop = false,
  seed = 0,
  onComplete,
  className,
  ...rest
}: GlobalAnimationProps) {
  const pieceCount = count ?? DEFAULT_COUNT[variant];
  const lifetime = duration ?? DEFAULT_DURATION[variant];
  const particles = useMemo(
    () => makeParticles(variant, pieceCount, tone, seed),
    [variant, pieceCount, tone, seed],
  );

  useEffect(() => {
    if (loop || !onComplete) return;
    const timeout = window.setTimeout(onComplete, lifetime);
    return () => window.clearTimeout(timeout);
  }, [lifetime, loop, onComplete]);

  return (
    <div
      aria-hidden="true"
      {...rest}
      className={cn("px-global-animation", `px-global-animation--${variant}`, className)}
    >
      {variant === "burst" && (
        <PixelShader
          className="px-global-animation-sunrays"
          pattern="ripple"
          cell={8}
          speed={0.75}
          colors={BURST_SHADER_COLORS[tone]}
        />
      )}
      {particles.map((particle, i) => (
        <span key={i} className="px-global-animation-piece" style={particleStyle(particle, loop)} />
      ))}
    </div>
  );
}

/** Full-screen Codenames-style falling confetti, adapted as a reusable overlay. */
export function Confetti(props: ConfettiProps) {
  return <GlobalAnimation variant="confetti" {...props} />;
}
