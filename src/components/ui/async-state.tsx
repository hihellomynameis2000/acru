import { AlertCircleIcon } from "@shopify/polaris-icons";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function LoadingState({ label = "Loading", rows = 5 }: { label?: string; rows?: number }) {
  return (
    <div aria-busy="true" aria-label={label} aria-live="polite" className="ui-loading-state" role="status">
      <span className="ui-sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <span className="ui-loading-row" key={index} />
      ))}
    </div>
  );
}

export function ErrorState({
  className,
  description = "We couldn’t load this information. Check your connection and try again.",
  onRetry,
  title = "Something went wrong"
}: {
  className?: string;
  description?: ReactNode;
  onRetry?: () => void;
  title?: ReactNode;
}) {
  return (
    <section className={cn("ui-error-state", className)} role="alert">
      <AlertCircleIcon aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </section>
  );
}
