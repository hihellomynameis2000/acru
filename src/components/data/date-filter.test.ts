import { describe, expect, it } from "vitest";

import { matchesDatePreset } from "./date-filter";

describe("date preset filtering", () => {
  it("includes both ends of a relative window without timezone drift", () => {
    expect(matchesDatePreset("Aug 22, 2026", "Last 7 days")).toBe(true);
    expect(matchesDatePreset("Aug 21, 2026", "Last 7 days")).toBe(false);
  });

  it("supports today, year, and all-time presets", () => {
    expect(matchesDatePreset("Aug 28, 2026", "Today")).toBe(true);
    expect(matchesDatePreset("Jan 1, 2026", "This year")).toBe(true);
    expect(matchesDatePreset("Jan 1, 2022", "All time")).toBe(true);
  });
});
