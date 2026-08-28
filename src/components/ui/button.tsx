import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "secondary" | "primary" | "ghost" | "danger";
  size?: "small" | "medium";
  loading?: boolean;
  loadingLabel?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    loading = false,
    loadingLabel = "Working",
    size = "medium",
    type = "button",
    variant = "secondary",
    ...props
  },
  ref
) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={cn("button", `button-${variant}`, `button-${size}`, className)}
      disabled={disabled || loading}
      ref={ref}
      type={type}
    >
      {loading ? <span aria-hidden="true" className="button-spinner" /> : null}
      <span className={loading ? "button-label-loading" : undefined}>{loading ? loadingLabel : children}</span>
    </button>
  );
});
