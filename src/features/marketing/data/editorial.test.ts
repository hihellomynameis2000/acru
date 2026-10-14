import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  editorialHref,
  editorialDestinations,
  footerDirectory,
  homepageFaqs,
  landingFaqs,
  landingGuides
} from "./editorial";

describe("Acru editorial sections", () => {
  it("includes the three supplied guides without external reference destinations", () => {
    expect(landingGuides.map((guide) => guide.category)).toEqual(["Payments", "Payouts", "Platforms"]);
    expect(new Set(landingGuides.map((guide) => guide.slug)).size).toBe(3);
    for (const guide of landingGuides) {
      expect(guide.readTime).toBe("4 min read");
      expect(guide).not.toHaveProperty("href");
    }
  });
  it("maps each supplied illustration to its matching guide", () => {
    expect(landingGuides.map((guide) => guide.image)).toEqual([
      "/marketing/guides/clarity-v1/payments-blue.webp",
      "/marketing/guides/clarity-v1/payouts-sand.webp",
      "/marketing/guides/clarity-v1/platforms-lavender.webp"
    ]);
  });
  it.each(landingGuides)("uses a lightweight supplied illustration for $category", (guide) => {
    const asset = readFileSync(resolve(process.cwd(), "public", guide.image.slice(1)));
    expect(asset.subarray(0, 4).toString()).toBe("RIFF");
    expect(asset.subarray(8, 12).toString()).toBe("WEBP");
    expect(asset.length).toBeLessThan(220 * 1024);
    expect(guide.alt.length).toBeGreaterThan(30);
  });
  it("keeps the complete FAQ library while using a concise homepage selection", () => {
    expect(landingFaqs).toHaveLength(12);
    expect(new Set(landingFaqs.map((faq) => faq.id)).size).toBe(12);
    for (const faq of landingFaqs) expect(faq.answer.length).toBeGreaterThan(150);
    expect(landingFaqs[1].answer).toContain("approved method mix");
    expect(landingFaqs[2].answer).toContain("timing, reserves, and eligible rails");
    expect(homepageFaqs.map((faq) => faq.id)).toEqual(["platform", "methods", "settlement", "checkout", "start"]);
  });
  it("preserves all six footer columns without accidentally using merchant-app routes", () => {
    expect(footerDirectory).toHaveLength(6);
    expect(footerDirectory.reduce((count, group) => count + group.links.length, 0)).toBe(35);
    for (const group of footerDirectory) {
      for (const [, path] of group.links) expect(editorialHref(path)).toBe(editorialDestinations[path]);
    }
    expect(editorialHref("/platforms#onboarding")).toBe("/features/merchant-onboarding");
    expect(editorialHref("/articles")).toBe("/articles");
    for (const href of Object.values(editorialDestinations)) {
      if (!href.startsWith("mailto:")) expect(new URL(href, "https://acru.com").origin).toBe("https://acru.com");
    }
    expect(() => editorialHref("/unbuilt-page")).toThrow();
  });
});
