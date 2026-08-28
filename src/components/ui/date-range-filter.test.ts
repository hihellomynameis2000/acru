import { describe, expect, it } from "vitest";

import { formatDateRange, isValidDateRange } from "./date-range-filter";

describe("date ranges", () => {
  it("accepts inclusive chronological ranges", () => {
    expect(isValidDateRange({ start: "2026-08-01", end: "2026-08-01" })).toBe(true);
    expect(isValidDateRange({ start: "2026-08-10", end: "2026-08-01" })).toBe(false);
  });

  it("formats a stable range label", () => {
    expect(formatDateRange({ start: "2026-08-01", end: "2026-08-10" })).toBe("Aug 1, 2026 – Aug 10, 2026");
  });
});
