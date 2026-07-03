import {
  createContext,
  useContext,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

interface AccordionContextValue {
  open: string[];
  toggle: (v: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow several panels open at once. */
  multiple?: boolean;
  defaultOpen?: string[];
  children: ReactNode;
}

export function Accordion({ multiple, defaultOpen = [], className, children, ...rest }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const baseId = useId();
  const toggle = (v: string) =>
    setOpen((cur) =>
      cur.includes(v) ? cur.filter((x) => x !== v) : multiple ? [...cur, v] : [v],
    );
  return (
    <AccordionContext.Provider value={{ open, toggle, baseId }}>
      <div className={cn("px-accordion", className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  title: ReactNode;
  children: ReactNode;
}

export function AccordionItem({ value, title, children }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("<AccordionItem> must be used inside <Accordion>");
  const { open, toggle, baseId } = ctx;
  const expanded = open.includes(value);
  return (
    <div className="px-accordion-item">
      <button
        type="button"
        className="px-accordion-trigger"
        aria-expanded={expanded}
        aria-controls={`${baseId}-content-${value}`}
        id={`${baseId}-trigger-${value}`}
        onClick={() => toggle(value)}
      >
        {title}
        <span className="px-accordion-indicator" aria-hidden="true">
          ▶
        </span>
      </button>
      {expanded && (
        <div
          id={`${baseId}-content-${value}`}
          role="region"
          aria-labelledby={`${baseId}-trigger-${value}`}
          className="px-accordion-content"
        >
          {children}
        </div>
      )}
    </div>
  );
}
