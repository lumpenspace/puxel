import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./Button";

export interface MenuItemDef {
  label: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** Render a separator above this item. */
  separator?: boolean;
}

export interface MenuProps {
  /** Trigger label. */
  label: ReactNode;
  items: MenuItemDef[];
  buttonProps?: Omit<ButtonProps, "children">;
  className?: string;
}

/** Dropdown menu with outside-click dismissal and arrow-key navigation. */
export function Menu({ label, items, buttonProps, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      listRef.current?.querySelector<HTMLButtonElement>(".px-menu-item:not(:disabled)")?.focus();
    }
  }, [open]);

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const els = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(".px-menu-item:not(:disabled)") ?? [],
    );
    const current = els.indexOf(document.activeElement as HTMLButtonElement);
    let next = 0;
    if (e.key === "ArrowDown") next = (current + 1) % els.length;
    if (e.key === "ArrowUp") next = (current - 1 + els.length) % els.length;
    if (e.key === "End") next = els.length - 1;
    els[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cn("px-menu", className)}>
      <Button
        className="px-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        {...buttonProps}
      >
        {label} <span aria-hidden="true">{open ? "▲" : "▼"}</span>
      </Button>
      {open && (
        <ul id={menuId} role="menu" ref={listRef} className="px-menu-list" onKeyDown={onListKeyDown}>
          {items.map((item, i) => (
            <li key={i} role="none">
              {item.separator && <div className="px-menu-separator" role="separator" />}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={cn("px-menu-item", item.danger && "px-menu-item--danger")}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
