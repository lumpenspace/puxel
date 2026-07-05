import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

/* ---- Field wrapper: label + control + hint/error ---- */

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
  className?: string;
}

export function Field({ label, hint, error, children, className }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("px-field", className)}>
      <label className="px-label" htmlFor={id}>
        {label}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <span id={`${id}-error`} className="px-field-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="px-field-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export function Label({ className, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("px-label", className)} {...rest} />;
}

/* ---- Input / Textarea ---- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  /** High-score-entry styling: display font, block caret, blinking placeholder. */
  arcade?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, arcade, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn("px-input", error && "px-input--error", arcade && "px-input--arcade", className)}
      {...rest}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  /** High-score-entry styling: display font, block caret, blinking placeholder. */
  arcade?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, arcade, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "px-textarea",
        error && "px-textarea--error",
        arcade && "px-textarea--arcade",
        className,
      )}
      {...rest}
    />
  );
});

export function InputGroup({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-input-group", className)}>{children}</div>;
}

export function InputAddon({ children }: { children: ReactNode }) {
  return <span className="px-input-addon">{children}</span>;
}

/* ---- Select ---- */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Display-font control + options (options styling needs base-select support). */
  arcade?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ arcade, className, children, ...rest }, ref) {
    return (
      <span className={cn("px-select", arcade && "px-select--arcade", className)}>
        <select ref={ref} {...rest}>
          {children}
        </select>
      </span>
    );
  },
);

/* ---- Checkbox / Radio / Switch ---- */

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  /** Display-font label + lit "LED" square instead of a tick. */
  arcade?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, arcade, className, ...rest },
  ref,
) {
  return (
    <label className={cn("px-check", arcade && "px-check--arcade", className)}>
      <input ref={ref} type="checkbox" {...rest} />
      <span className="px-check-box" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
});

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  /** Menu-selector styling: a blinking ▶ marks the chosen option. */
  arcade?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, arcade, className, ...rest },
  ref,
) {
  return (
    <label className={cn("px-radio", arcade && "px-radio--arcade", className)}>
      <input ref={ref} type="radio" {...rest} />
      <span className="px-radio-dot" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
});

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label?: ReactNode;
  /** Wider track with an ON/OFF readout. */
  arcade?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, arcade, className, ...rest },
  ref,
) {
  return (
    <label className={cn("px-switch", arcade && "px-switch--arcade", className)}>
      <input ref={ref} type="checkbox" role="switch" {...rest} />
      <span className="px-switch-track" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
});

/* ---- Slider ---- */

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Secondary-accent thumb over a notched track. */
  arcade?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider({ arcade, className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        type="range"
        className={cn("px-slider", arcade && "px-slider--arcade", className)}
        {...rest}
      />
    );
  },
);

/* ---- Fieldset: section with title sitting on the border ---- */

export interface FieldsetProps {
  title: ReactNode;
  align?: "left" | "center" | "right";
  /** Accent-colored title chip. */
  accent?: boolean;
  shadow?: boolean;
  className?: string;
  children: ReactNode;
}

export function Fieldset({ title, align = "left", accent, shadow, className, children }: FieldsetProps) {
  return (
    <fieldset className={cn("px-fieldset", shadow && "px-fieldset--shadow", className)}>
      <legend className="sr-only">{typeof title === "string" ? title : undefined}</legend>
      <span
        aria-hidden="true"
        className={cn(
          "px-fieldset-title",
          align !== "left" && `px-fieldset-title--${align}`,
          accent && "px-fieldset-title--accent",
        )}
      >
        {title}
      </span>
      {children}
    </fieldset>
  );
}
