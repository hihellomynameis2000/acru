import type { ReactNode } from "react";

import { ErrorState, LoadingState } from "@/components/ui/async-state";

export function CollectionPageState({
  description,
  error,
  onRetry,
  status,
  title
}: {
  description: ReactNode;
  error?: Error | null;
  onRetry?: () => void;
  status: "loading" | "error";
  title: ReactNode;
}) {
  return (
    <div className="collection-page-state">
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <section>
        {status === "loading" ? (
          <LoadingState label={`Loading ${String(title).toLowerCase()}`} rows={7} />
        ) : (
          <ErrorState
            description={error?.message}
            onRetry={onRetry}
            title={`Couldn’t load ${String(title).toLowerCase()}`}
          />
        )}
      </section>
    </div>
  );
}
