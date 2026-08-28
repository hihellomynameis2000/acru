export type PageRequest<Filters extends object = Record<never, never>> = Filters & {
  page: number;
  pageSize: number;
  query?: string;
};

export type PageResult<Item> = {
  items: Item[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export type ListAdapter<Item, Filters extends object = Record<never, never>> = {
  list(request: PageRequest<Filters>, signal?: AbortSignal): Promise<PageResult<Item>>;
};

export function createFixtureListAdapter<Item, Filters extends object = Record<never, never>>({
  filter,
  latency = 0,
  seed
}: {
  filter: (item: Item, request: PageRequest<Filters>) => boolean;
  latency?: number;
  seed: readonly Item[];
}): ListAdapter<Item, Filters> {
  return {
    async list(request, signal) {
      if (signal?.aborted) throw new DOMException("Request aborted", "AbortError");
      if (latency > 0) {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, latency);
          signal?.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new DOMException("Request aborted", "AbortError"));
            },
            { once: true }
          );
        });
      }
      const filtered = seed.filter((item) => filter(item, request));
      const page = Math.max(1, request.page);
      const pageSize = Math.max(1, request.pageSize);
      const start = (page - 1) * pageSize;
      return {
        items: filtered.slice(start, start + pageSize),
        page,
        pageSize,
        totalItems: filtered.length
      };
    }
  };
}
