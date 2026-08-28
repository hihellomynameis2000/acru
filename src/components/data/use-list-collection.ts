"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

import type { ListAdapter } from "./adapter";

type CollectionState<Item> =
  | { items: Item[]; status: "loading" }
  | { error: Error; items: Item[]; status: "error" }
  | { items: Item[]; status: "ready" };

export function useListCollection<Item>(adapter: ListAdapter<Item>) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<CollectionState<Item>>({ items: [], status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    adapter
      .list({ page: 1, pageSize: 500 }, controller.signal)
      .then((result) => {
        if (active) setState({ items: result.items, status: "ready" });
      })
      .catch((reason: unknown) => {
        if (!active || (reason instanceof DOMException && reason.name === "AbortError")) return;
        setState({
          error: reason instanceof Error ? reason : new Error("The request failed."),
          items: [],
          status: "error"
        });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [adapter, version]);

  const retry = useCallback(() => {
    setState({ items: [], status: "loading" });
    setVersion((current) => current + 1);
  }, []);

  const setItems: Dispatch<SetStateAction<Item[]>> = useCallback((update) => {
    setState((current) => {
      const items = typeof update === "function" ? update(current.items) : update;
      return { items, status: "ready" };
    });
  }, []);

  return {
    error: state.status === "error" ? state.error : null,
    items: state.items,
    retry,
    setItems,
    status: state.status
  };
}
