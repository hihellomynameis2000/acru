import { describe, expect, it } from "vitest";

import { addMoney, createMoney, decimalAmount, formatMoney, minorUnitsFromDecimal } from "./money";

describe("money", () => {
  it("parses decimal input without floating-point arithmetic", () => {
    expect(minorUnitsFromDecimal("2943.25")).toBe(294_325);
    expect(minorUnitsFromDecimal("0.10")).toBe(10);
    expect(minorUnitsFromDecimal("-12.3")).toBe(-1_230);
  });

  it("rejects precision that would silently lose money", () => {
    expect(() => minorUnitsFromDecimal("1.001")).toThrow(/decimal places/);
  });

  it("adds only matching currencies", () => {
    expect(addMoney(createMoney(10, "USD"), createMoney(20, "USD"))).toEqual({ currency: "USD", minorUnits: 30 });
    expect(() => addMoney(createMoney(10, "USD"), createMoney(20, "EUR"))).toThrow(/different currencies/);
  });

  it("formats minor units consistently", () => {
    expect(formatMoney(createMoney(294_325))).toBe("$2,943.25");
    expect(decimalAmount(294_325)).toBe("2943.25");
  });
});
