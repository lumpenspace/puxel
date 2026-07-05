import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

export type ChatTone = "danger" | "info" | "accent";

export interface ChatProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Header label. Omit for a headerless feed. */
  title?: ReactNode;
  /** Renders a close button in the header when provided. */
  onClose?: () => void;
  closeLabel?: string;
  /** Auto-scroll the feed to the bottom when this value changes (e.g. count). */
  scrollKey?: unknown;
  /** Optional fixed footer, commonly a <ChatComposer>. */
  footer?: ReactNode;
}

/* A scrollable message feed. Compose the body from <ChatMessage>, <ChatAction>
   (a tagged move/event chip) and <ChatSeparator> (a turn divider). Positioning
   as a rail/overlay is left to the consumer — .px-chat is just the panel. */
export function Chat({
  title,
  onClose,
  closeLabel = "Close",
  scrollKey,
  footer,
  className,
  children,
  ...rest
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [scrollKey]);
  return (
    <div className={cn("px-chat", className)} {...rest}>
      {(title != null || onClose) && (
        <div className="px-chat-title">
          <span>{title}</span>
          {onClose && (
            <button type="button" className="px-chat-close" onClick={onClose} aria-label={closeLabel}>
              ×
            </button>
          )}
        </div>
      )}
      <div className="px-chat-scroll" ref={scrollRef}>
        {children}
      </div>
      {footer != null && <div className="px-chat-footer">{footer}</div>}
    </div>
  );
}

export interface ChatComposerProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Screen-reader label for the input. */
  inputLabel?: string;
  sendLabel?: ReactNode;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  onSend?: (message: string, event: FormEvent<HTMLFormElement>) => void;
}

/** Single-line chat input with submit handling. */
export function ChatComposer({
  value,
  defaultValue = "",
  placeholder = "Type a message...",
  inputLabel = "Message",
  sendLabel = "Send",
  disabled,
  onValueChange,
  onSend,
  className,
  ...rest
}: ChatComposerProps) {
  const inputId = useId();
  const [draft, setDraft] = useState(defaultValue);
  const isControlled = value != null;
  const message = isControlled ? value : draft;
  const trimmed = message.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed || disabled) return;
    onSend?.(trimmed, event);
    if (!isControlled) setDraft("");
  };

  return (
    <form className={cn("px-chat-composer", className)} onSubmit={handleSubmit} {...rest}>
      <label className="sr-only" htmlFor={inputId}>
        {inputLabel}
      </label>
      <input
        id={inputId}
        className="px-input px-chat-composer-input"
        value={message}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => {
          const next = event.currentTarget.value;
          if (!isControlled) setDraft(next);
          onValueChange?.(next);
        }}
      />
      <button
        type="submit"
        className="px-btn px-btn--primary px-chat-composer-send"
        disabled={disabled || trimmed.length === 0}
      >
        {sendLabel}
      </button>
    </form>
  );
}

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatar element rendered in the left slot (omit for host/system lines). */
  avatar?: ReactNode;
  name?: ReactNode;
  tone?: ChatTone;
  /** A host/system aside — italic accent, no avatar, message is `children`. */
  host?: boolean;
}

export function ChatMessage({ avatar, name, tone, host, className, children, ...rest }: ChatMessageProps) {
  if (host) {
    return (
      <div className={cn("px-chat-msg--host", className)} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn("px-chat-msg", tone && `px-chat-msg--${tone}`, className)} {...rest}>
      {avatar != null && <div className="px-chat-avatar">{avatar}</div>}
      <div className="px-chat-body">
        {name != null && <span className="px-chat-name">{name}</span>}
        <span className="px-chat-text">{children}</span>
      </div>
    </div>
  );
}

export interface ChatActionProps extends HTMLAttributes<HTMLDivElement> {
  /** Short label chip (e.g. CLUE, VETO, REVEAL). */
  tag: ReactNode;
  tone?: ChatTone;
}

export function ChatAction({ tag, tone, className, children, ...rest }: ChatActionProps) {
  return (
    <div className={cn("px-chat-action", tone && `px-chat-action--${tone}`, className)} {...rest}>
      <span className="px-chat-action-tag">{tag}</span>
      <span className="px-chat-action-body">{children}</span>
    </div>
  );
}

export interface ChatSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ChatTone;
}

export function ChatSeparator({ tone, className, children, ...rest }: ChatSeparatorProps) {
  return (
    <div className={cn("px-chat-turn", tone && `px-chat-turn--${tone}`, className)} {...rest}>
      <span>{children}</span>
    </div>
  );
}
