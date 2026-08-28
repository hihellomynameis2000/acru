"use client";

import { SearchIcon, XIcon } from "@shopify/polaris-icons";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

export function Field({
  children,
  className,
  error,
  hint,
  label,
  optional
}: {
  children: ReactNode;
  className?: string;
  error?: ReactNode;
  hint?: ReactNode;
  label: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className={cn("ui-field", className)}>
      <span className="ui-field-label">
        <span>{label}</span>
        {optional ? <small>Optional</small> : null}
      </span>
      {children}
      {error ? (
        <small className="ui-field-message ui-field-error" role="alert">
          {error}
        </small>
      ) : hint ? (
        <small className="ui-field-message">{hint}</small>
      ) : null}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { "aria-invalid": ariaInvalid, className, ...props },
  ref
) {
  return <input {...props} aria-invalid={ariaInvalid} className={cn("ui-input", className)} ref={ref} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select {...props} className={cn("ui-select", className)} ref={ref}>
      {children}
    </select>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return <textarea {...props} className={cn("ui-textarea", className)} ref={ref} />;
});

export function SearchInput({
  label = "Search",
  onClear,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; onClear?: () => void }) {
  const id = useId();
  const hasValue = String(props.value ?? props.defaultValue ?? "").length > 0;
  return (
    <div className="ui-search-input">
      <SearchIcon aria-hidden="true" />
      <input {...props} aria-label={label} id={props.id ?? id} type="search" />
      {onClear && hasValue ? (
        <IconButton label="Clear search" onClick={onClear} size="small" variant="ghost">
          <XIcon aria-hidden="true" />
        </IconButton>
      ) : null}
    </div>
  );
}
