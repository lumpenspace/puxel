import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Modal dialog built on native <dialog> — focus trap, Esc-to-close and
 * ::backdrop come free from the platform.
 */
export function Dialog({ open, onClose, title, footer, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn("px-dialog", className)}
      onClose={onClose}
      onClick={(e) => {
        // click on the backdrop (the dialog element itself) closes
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="px-dialog-header">
        <h2 className="px-dialog-title">{title}</h2>
        <button type="button" className="px-dialog-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="px-dialog-body">{children}</div>
      {footer && <div className="px-dialog-footer">{footer}</div>}
    </dialog>
  );
}

export function DialogFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-dialog-footer", className)} {...rest} />;
}
