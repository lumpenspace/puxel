import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface BreadcrumbItemDef {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItemDef[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("px-breadcrumb", className)}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href ?? "#"}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
