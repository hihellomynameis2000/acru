import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: "small" | "medium";
  variant?: "secondary" | "ghost" | "danger";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, label, size = "medium", type = "button", variant = "secondary", ...props },
  ref
) {
  return (
    <button
      {...props}
      aria-label={label}
      className={cn("ui-icon-button", `ui-icon-button-${variant}`, `ui-icon-button-${size}`, className)}
      ref={ref}
      title={props.title ?? label}
      type={type}
    />
  );
});
