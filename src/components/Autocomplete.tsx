import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

export interface AutocompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "onSelect"> {
  /** Controlled input value. */
  value: string;
  onChange: (value: string) => void;
  /** Called when a suggestion is chosen (click or Enter). */
  onSelect?: (value: string) => void;
  /** The full suggestion pool; filtering happens inside. */
  options: readonly string[];
  /** How many suggestions to show at once. */
  maxItems?: number;
  /** Start suggesting after this many typed characters. */
  minChars?: number;
  /** Optional custom row rendering (highlighted match by default). */
  renderItem?: (option: string, query: string) => ReactNode;
  error?: boolean;
  className?: string;
}

function defaultRenderItem(option: string, query: string): ReactNode {
  const at = option.toLowerCase().indexOf(query.toLowerCase());
  if (at < 0 || !query) return option;
  return (
    <>
      {option.slice(0, at)}
      <mark className="px-autocomplete-match">{option.slice(at, at + query.length)}</mark>
      {option.slice(at + query.length)}
    </>
  );
}

/**
 * Text input with a filtered suggestion dropdown. Prefix matches rank above
 * substring matches; keyboard: ↑/↓ to move, Enter to pick, Escape to dismiss.
 */
export function Autocomplete({
  value,
  onChange,
  onSelect,
  options,
  maxItems = 8,
  minChars = 1,
  renderItem = defaultRenderItem,
  error,
  className,
  ...rest
}: AutocompleteProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (query.length < minChars) return [];
    const starts: string[] = [];
    const contains: string[] = [];
    for (const option of options) {
      const low = option.toLowerCase();
      if (low === query) continue;
      if (low.startsWith(query)) starts.push(option);
      else if (low.includes(query)) contains.push(option);
      if (starts.length >= maxItems) break;
    }
    return [...starts, ...contains].slice(0, maxItems);
  }, [value, options, maxItems, minChars]);

  useEffect(() => setActive(-1), [value]);

  // Light-dismiss on outside pointerdown.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const pick = (option: string) => {
    onChange(option);
    onSelect?.(option);
    setOpen(false);
  };

  const expanded = open && matches.length > 0;

  return (
    <div ref={rootRef} className={cn("px-autocomplete", className)}>
      <input
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        className={cn("px-input", error && "px-input--error")}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (!expanded && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            setOpen(true);
            return;
          }
          if (!expanded) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((current) => (current + 1) % matches.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => (current <= 0 ? matches.length - 1 : current - 1));
          } else if (event.key === "Enter" && active >= 0) {
            event.preventDefault();
            pick(matches[active]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        {...rest}
      />
      {expanded && (
        <ul id={listId} role="listbox" className="px-autocomplete-list">
          {matches.map((option, index) => (
            <li
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              data-active={index === active || undefined}
              className="px-menu-item px-autocomplete-item"
              // pointerdown, not click: it must win against the light-dismiss
              // handler and the input's blur.
              onPointerDown={(event) => {
                event.preventDefault();
                pick(option);
              }}
              onMouseEnter={() => setActive(index)}
            >
              {renderItem(option, value.trim())}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
