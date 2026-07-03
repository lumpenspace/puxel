import type { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ---- Kbd ---- */
export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("px-kbd", className)} {...rest} />;
}

/* ---- Separator ---- */
export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  dashed?: boolean;
  vertical?: boolean;
}

export function Separator({ dashed, vertical, className, ...rest }: SeparatorProps) {
  return (
    <hr
      className={cn(
        "px-separator",
        dashed && "px-separator--dashed",
        vertical && "px-separator--vertical",
        className,
      )}
      aria-orientation={vertical ? "vertical" : undefined}
      {...rest}
    />
  );
}

/* ---- Table ---- */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hover?: boolean;
}

export function Table({ striped, hover, className, ...rest }: TableProps) {
  return (
    <div className="px-table-wrap">
      <table
        className={cn("px-table", striped && "px-table--striped", hover && "px-table--hover", className)}
        {...rest}
      />
    </div>
  );
}
