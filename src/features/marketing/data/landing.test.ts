import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  businessContactHref,
  landingArtwork,
  landingBusinesses,
  landingChartAnimation,
  landingProductAnimations,
  landingProducts
} from "./landing";

describe("the supplied landing-page artwork", () => {
  it.each(Object.entries(landingArtwork))("keeps %s at its original aspect ratio", (_name, artwork) => {
    const png = readFileSync(resolve(process.cwd(), "public", artwork.src.slice(1)));
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(artwork.width);
    expect(png.readUInt32BE(20)).toBe(artwork.height);
    expect(artwork.alt.length).toBeGreaterThan(20);
  });

  it("covers all four products with distinct artwork and descriptions", () => {
    expect(landingProducts.map((product) => product.title)).toEqual([
      "Payment methods",
      "Checkout",
      "Authentication",
      "Developer infrastructure"
    ]);
    expect(new Set(landingProducts.map((product) => product.artwork.src)).size).toBe(4);
    expect(new Set(landingProducts.map((product) => product.description)).size).toBe(4);
  });
});

describe("optimized product films", () => {
  it("uses the supplied animations for all four products", () => {
    expect(Object.keys(landingProductAnimations)).toEqual(landingProducts.map((product) => product.id));
  });

  it("preserves the chart's portrait aspect ratio", () => {
    expect(landingChartAnimation.width / landingChartAnimation.height).toBe(
      landingArtwork.chart.width / landingArtwork.chart.height
    );
  });

  it.each(Object.entries({ ...landingProductAnimations, "payment-chart": landingChartAnimation }))(
    "keeps %s lightweight and ready for progressive playback",
    (_name, animation) => {
      const mp4 = readFileSync(resolve(process.cwd(), "public", animation.src.slice(1)));
      const poster = readFileSync(resolve(process.cwd(), "public", animation.poster.slice(1)));
      expect(mp4.byteLength).toBeLessThan(300 * 1024);
      expect(poster.byteLength).toBeLessThan(40 * 1024);
      const boxes: string[] = [];
      for (let offset = 0; offset + 8 <= mp4.length;) {
        const size = mp4.readUInt32BE(offset);
        if (size < 8) break;
        boxes.push(mp4.subarray(offset + 4, offset + 8).toString());
        offset += size;
      }
      expect(boxes).toContain("moov");
      expect(boxes).toContain("mdat");
      expect(boxes.indexOf("moov")).toBeLessThan(boxes.indexOf("mdat"));
    }
  );
});

describe("the expanded business grid", () => {
  it("uses only the four requested business categories and their supplied headlines", () => {
    expect(landingBusinesses.map((business) => business.title)).toEqual([
      "Ecommerce",
      "Fintech",
      "Gaming",
      "Marketplaces"
    ]);
    expect(landingBusinesses.map((business) => business.headline)).toEqual([
      "More completed orders. More room to grow.",
      "Your product. A complete money movement layer.",
      "Stay in the moment. Keep money moving.",
      "Great for buyers. Built for sellers. Clear for you."
    ]);
    expect(new Set(landingBusinesses.map((business) => business.id)).size).toBe(4);
    expect(new Set(landingBusinesses.map((business) => business.description)).size).toBe(4);
  });

  it.each(landingBusinesses)("links $title to its dedicated landing page", (business) => {
    expect(businessContactHref(business.title)).toBe(`/industries/${business.id}`);
  });
});
