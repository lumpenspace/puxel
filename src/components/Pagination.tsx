import { cn } from "../lib/cn";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown around the current one. */
  siblings?: number;
  className?: string;
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/** Numbered pagination with ellipsis collapse and prev/next. */
export function Pagination({ page, pageCount, onPageChange, siblings = 1, className }: PaginationProps) {
  const first = 1;
  const last = pageCount;
  const start = Math.max(page - siblings, first + 1);
  const end = Math.min(page + siblings, last - 1);

  const items: Array<number | "…"> = [first];
  if (start > first + 1) items.push("…");
  items.push(...range(start, end));
  if (end < last - 1) items.push("…");
  if (last > first) items.push(last);

  return (
    <nav aria-label="Pagination" className={cn("px-pagination", className)}>
      <button
        type="button"
        className="px-pagination-btn"
        disabled={page === first}
        aria-label="Previous page"
        onClick={() => onPageChange(page - 1)}
      >
        ◀
      </button>
      {items.map((item, i) =>
        item === "…" ? (
          <span key={`e${i}`} className="px-pagination-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className="px-pagination-btn"
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            onClick={() => item !== page && onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="px-pagination-btn"
        disabled={page === last}
        aria-label="Next page"
        onClick={() => onPageChange(page + 1)}
      >
        ▶
      </button>
    </nav>
  );
}
