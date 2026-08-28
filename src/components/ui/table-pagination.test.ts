import { describe, expect, it } from "vitest";

import { pageTokens } from "./table-pagination";

describe("table pagination", () => {
  it("shows every page for compact results", () => {
    expect(pageTokens(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("keeps the active page and both boundaries visible", () => {
    expect(pageTokens(8, 20)).toEqual([1, "start-ellipsis", 7, 8, 9, "end-ellipsis", 20]);
  });
});
