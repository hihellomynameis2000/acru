import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export function StatusBadge({
  children,
  className,
  tone = "neutral"
}: {
  children: ReactNode;
  className?: string;
  tone?: StatusTone;
}) {
  return (
    <span className={cn("ui-status-badge", `ui-status-${tone}`, className)}>
      <span aria-hidden="true" className="ui-status-dot" />
      {children}
    </span>
  );
}
