import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function EmptyState({
  action,
  className,
  description,
  icon,
  title
}: {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}) {
  return (
    <section className={cn("ui-empty-state", className)}>
      {icon ? (
        <span aria-hidden="true" className="ui-empty-state-icon">
          {icon}
        </span>
      ) : null}
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div>{action}</div> : null}
    </section>
  );
}
