import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** What floats above the trigger on hover/focus. Wrap it in `.px-popover`
      (or pass a ready-made element) for the framed look. */
  content: ReactNode;
  /** The trigger. */
  children: ReactNode;
}

/* Reveals `content` in a <body>-level portal while the trigger is hovered or
   focused. The card is positioned with fixed coordinates read from the
   trigger's rect and re-read on scroll/resize, so it stays glued to the trigger
   and is never clipped by a scroll container or a neighbour's stacking context.
   Prefers opening upward, flipping below when the trigger sits near the top. */
export function Popover({ content, children, className, ...rest }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const show = () => setRect(ref.current?.getBoundingClientRect() ?? null);
  const hide = () => setRect(null);

  useEffect(() => {
    if (!rect) return undefined;
    const update = () => setRect(ref.current?.getBoundingClientRect() ?? null);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [rect]);

  let floating: ReactNode = null;
  if (rect && typeof document !== "undefined") {
    const above = rect.top > 210;
    const cx = Math.min(Math.max(rect.left + rect.width / 2, 128), window.innerWidth - 128);
    const style: CSSProperties = {
      position: "fixed",
      zIndex: 200,
      pointerEvents: "none",
      left: cx,
      top: above ? rect.top - 10 : rect.bottom + 10,
      transform: `translateX(-50%)${above ? " translateY(-100%)" : ""}`,
    };
    floating = createPortal(
      <div style={style} role="dialog">
        {content}
      </div>,
      document.body,
    );
  }

  return (
    <div
      ref={ref}
      className={cn("px-trigger", className)}
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...rest}
    >
      {children}
      {floating}
    </div>
  );
}
