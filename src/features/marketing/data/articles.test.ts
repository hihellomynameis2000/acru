import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { articlePaths, articles, getArticle } from "./articles";
import { isPublicMarketingPath } from "./public-paths";

describe("Acru articles", () => {
  it("gives every article a unique route and complete publishing metadata", () => {
    expect(articles).toHaveLength(3);
    expect(new Set(articles.map((article) => article.slug)).size).toBe(articles.length);
    expect(articlePaths).toHaveLength(articles.length + 1);

    for (const article of articles) {
      expect(getArticle(article.slug)).toBe(article);
      expect(article.title.length).toBeGreaterThan(30);
      expect(article.summary.length).toBeGreaterThan(80);
      expect(article.sections.length).toBeGreaterThanOrEqual(4);
      expect(Number.isNaN(Date.parse(article.publishedAt))).toBe(false);
      expect(existsSync(resolve(process.cwd(), "public", article.hero.src.slice(1)))).toBe(true);
    }
  });

  it("keeps section anchors unique and article content substantial", () => {
    for (const article of articles) {
      expect(new Set(article.sections.map((section) => section.id)).size).toBe(article.sections.length);
      for (const section of article.sections) {
        expect(section.title.length).toBeGreaterThan(15);
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("allows only the index and known article slugs through the public shell", () => {
    for (const path of articlePaths) expect(isPublicMarketingPath(path)).toBe(true);
    expect(isPublicMarketingPath("/articles/not-a-real-article")).toBe(false);
    expect(isPublicMarketingPath("/articles/building-a-better-payment-operation/draft")).toBe(false);
  });
});
