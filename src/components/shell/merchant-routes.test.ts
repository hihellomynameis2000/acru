import { describe, expect, it } from "vitest";

import { merchantRoutes } from "./merchant-routes";

describe("merchant route registry", () => {
  it("contains unique, canonical destinations", () => {
    expect(new Set(merchantRoutes).size).toBe(merchantRoutes.length);
    expect(merchantRoutes.every((route) => route.startsWith("/") && !route.endsWith("/"))).toBe(true);
  });

  it("covers every merchant operating area", () => {
    expect(merchantRoutes).toContain("/commerce/products");
    expect(merchantRoutes).toContain("/payments/disputes");
    expect(merchantRoutes).toContain("/reports/exports");
    expect(merchantRoutes).toContain("/settings/notifications");
  });
});
