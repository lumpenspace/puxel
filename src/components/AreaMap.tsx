import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type AreaMapTile = "empty" | "path" | "wall" | "coin" | "danger" | "start" | "goal" | "water";
export type AreaMapSize = "sm" | "md" | "lg";

export interface AreaMapProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tiles: readonly AreaMapTile[];
  /** Number of columns in the tile grid. */
  columns?: number;
  label?: ReactNode;
  /** Optional right-side label, e.g. "Mines". */
  detail?: ReactNode;
  size?: AreaMapSize;
}

/** Pixel minimap / area overview for HUDs, dungeon maps, and tiny boards. */
export function AreaMap({
  tiles,
  columns = 7,
  label,
  detail,
  size = "md",
  className,
  style,
  "aria-label": ariaLabel,
  ...rest
}: AreaMapProps) {
  const labelId = useId();
  const hasHeader = label != null || detail != null;
  const labelledBy = ariaLabel == null && hasHeader ? labelId : undefined;

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? (labelledBy ? undefined : "Area map")}
      aria-labelledby={labelledBy}
      className={cn("px-area-map", size !== "md" && `px-area-map--${size}`, className)}
      style={{ "--px-area-map-cols": columns, ...style } as CSSProperties}
      {...rest}
    >
      {hasHeader && (
        <div className="px-area-map-head" id={labelId}>
          {label != null && <span>{label}</span>}
          {detail != null && <span>{detail}</span>}
        </div>
      )}
      <div className="px-area-map-grid" aria-hidden="true">
        {tiles.map((tile, index) => (
          <span key={`${tile}-${index}`} className={cn("px-area-map-cell", `px-area-map-cell--${tile}`)} />
        ))}
      </div>
    </div>
  );
}
