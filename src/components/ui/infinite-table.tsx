"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type InfiniteRowsOptions = {
  batchSize?: number;
  resetKey?: string;
};

export function useInfiniteRows<T>(items: T[], { batchSize = 10, resetKey = "" }: InfiniteRowsOptions = {}) {
  const [cursor, setCursor] = useState({ key: resetKey, limit: batchSize });
  const limit = cursor.key === resetKey ? cursor.limit : batchSize;
  const visibleCount = Math.min(limit, items.length);

  const loadMore = useCallback(() => {
    setCursor((current) => {
      const currentLimit = current.key === resetKey ? current.limit : batchSize;
      return {
        key: resetKey,
        limit: Math.min(items.length, currentLimit + batchSize)
      };
    });
  }, [batchSize, items.length, resetKey]);

  return {
    hasMore: visibleCount < items.length,
    loadMore,
    visibleCount,
    visibleItems: items.slice(0, visibleCount)
  };
}

export function InfiniteTableFooter({
  itemLabel = "rows",
  onLoadMore,
  totalItems,
  visibleItems
}: {
  itemLabel?: string;
  onLoadMore: () => void;
  totalItems: number;
  visibleItems: number;
}) {
  const sentinel = useRef<HTMLSpanElement>(null);
  const hasMore = visibleItems < totalItems;

  useEffect(() => {
    const target = sentinel.current;
    if (!hasMore || !target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore();
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, totalItems, visibleItems]);

  return (
    <footer className="partner-infinite-footer">
      <span aria-live="polite">
        Showing {visibleItems} of {totalItems} {itemLabel}
      </span>
      {hasMore ? (
        <button onClick={onLoadMore} type="button">
          Load more
        </button>
      ) : (
        <span className="partner-infinite-end">{totalItems ? `All ${itemLabel} loaded` : `No ${itemLabel}`}</span>
      )}
      <span aria-hidden className="partner-infinite-sentinel" ref={sentinel} />
    </footer>
  );
}
