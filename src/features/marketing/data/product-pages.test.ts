import { afterEach, describe, expect, it, vi } from "vitest";
import { productPages, publicMarketingPaths } from "./product-pages";
import { editorialHref, footerDirectory } from "./editorial";
import { isPublicMarketingPath } from "./public-paths";

describe("public product landing pages", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses the selected gradient artwork only for card processing", () => {
    expect(productPages["/features/card-processing"].theme).toBe("card-gradient");
    expect(
      Object.entries(productPages)
        .filter(([, page]) => page.theme === "card-gradient")
        .map(([path]) => path)
    ).toEqual(["/features/card-processing"]);
  });

  it("exposes only the three design previews in development, never production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(isPublicMarketingPath("/preview/card-processing/gradient")).toBe(true);
    expect(isPublicMarketingPath("/preview/card-processing/dark")).toBe(true);
    expect(isPublicMarketingPath("/preview/card-processing/hybrid")).toBe(true);
    expect(isPublicMarketingPath("/preview/card-processing/unknown")).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    expect(isPublicMarketingPath("/preview/card-processing/gradient")).toBe(false);
    expect(isPublicMarketingPath("/preview/card-processing/dark")).toBe(false);
    expect(isPublicMarketingPath("/preview/card-processing/hybrid")).toBe(false);
  });
  it("fills every footer destination without sending visitors into the dashboard", () => {
    for (const group of footerDirectory)
      for (const [, source] of group.links) {
        const href = editorialHref(source);
        expect([
          ...publicMarketingPaths,
          "/payments/overview",
          "/developers/documentation",
          "/articles",
          "/help"
        ]).toContain(href);
        expect(isPublicMarketingPath(href)).toBe(true);
      }
    expect(isPublicMarketingPath("/risk")).toBe(false);
    expect(isPublicMarketingPath("/partners")).toBe(false);
    expect(isPublicMarketingPath("/payments/transactions")).toBe(false);
  });

  it("keeps every public landing page discoverable from the footer", () => {
    const footerDestinations = new Set(
      footerDirectory.flatMap((group) => group.links.map(([, source]) => editorialHref(source)))
    );

    for (const path of publicMarketingPaths) expect(footerDestinations).toContain(path);
  });

  it("gives every product its own headline, three features and closing", () => {
    const pages = Object.values(productPages);
    expect(new Set(pages.map((page) => page.headline)).size).toBe(pages.length);
    expect(new Set(pages.map((page) => page.closing)).size).toBe(pages.length);
    for (const page of pages) {
      expect(page.features).toHaveLength(3);
      expect(page.intro.length).toBeLessThan(160);
      expect(page.note.length).toBeGreaterThan(15);
    }
  });
});
