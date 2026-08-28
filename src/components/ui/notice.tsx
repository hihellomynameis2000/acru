import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon } from "@shopify/polaris-icons";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function InlineNotice({
  actions,
  children,
  className,
  title,
  tone = "info"
}: {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  title: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  const Icon =
    tone === "success"
      ? CheckCircleIcon
      : tone === "warning"
        ? AlertTriangleIcon
        : tone === "danger"
          ? AlertCircleIcon
          : InfoIcon;
  return (
    <aside
      className={cn("ui-inline-notice", `ui-inline-notice-${tone}`, className)}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" />
      <span>
        <strong>{title}</strong>
        {children ? <span>{children}</span> : null}
      </span>
      {actions ? <div className="ui-inline-notice-actions">{actions}</div> : null}
    </aside>
  );
}
