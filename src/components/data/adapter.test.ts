import { describe, expect, it } from "vitest";

import { createFixtureListAdapter } from "./adapter";

type Row = { name: string; status: "active" | "archived" };

const adapter = createFixtureListAdapter<Row, { status?: Row["status"] }>({
  filter: (item, request) => {
    const matchesQuery = !request.query || item.name.toLowerCase().includes(request.query.toLowerCase());
    return matchesQuery && (!request.status || item.status === request.status);
  },
  seed: [
    { name: "Alpha", status: "active" },
    { name: "Beta", status: "archived" },
    { name: "Gamma", status: "active" }
  ]
});

describe("fixture list adapter", () => {
  it("filters and paginates behind the production adapter contract", async () => {
    const result = await adapter.list({ page: 1, pageSize: 1, query: "a", status: "active" });
    expect(result).toEqual({ items: [{ name: "Alpha", status: "active" }], page: 1, pageSize: 1, totalItems: 2 });
  });

  it("honors an aborted request", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(adapter.list({ page: 1, pageSize: 10 }, controller.signal)).rejects.toMatchObject({
      name: "AbortError"
    });
  });
});
