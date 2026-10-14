import { describe, expect, it } from "vitest";
import { helpArticles, helpPaths, searchHelpArticles } from "./help-articles";
import { isPublicMarketingPath } from "./public-paths";
import { checkoutIntegrations } from "./checkout-integrations";

describe("Checkout integrations and help", () => {
  it("exposes the supplied roster without adding potential partnerships", () => {
    expect(checkoutIntegrations).toHaveLength(27);
    expect(new Set(checkoutIntegrations.map(({ name }) => name)).size).toBe(27);
    expect(checkoutIntegrations.find(({ name }) => name === "Bastion")?.category).toBe("Wallet infrastructure");
    for (const name of ["Worldpay", "Coinflow", "NSURE", "PayPal"]) {
      expect(checkoutIntegrations.some((item) => item.name === name)).toBe(false);
    }
  });
  it("keeps the help and integration routes outside the authenticated dashboard", () => {
    for (const path of [...helpPaths, "/integrations"]) expect(isPublicMarketingPath(path)).toBe(true);
    expect(isPublicMarketingPath("/help/not-an-article")).toBe(false);
    expect(isPublicMarketingPath("/payments/transactions")).toBe(false);
  });
  it("searches article titles and content with useful empty results", () => {
    expect(searchHelpArticles("CSV").map(({ slug }) => slug)).toContain("export-transactions");
    expect(searchHelpArticles("  NMI reporting ").map(({ slug }) => slug)).toContain(
      "gateway-reporting-vs-custom-checkout"
    );
    expect(searchHelpArticles("unmatchednonsense")).toEqual([]);
    expect(searchHelpArticles("")).toHaveLength(helpArticles.length);
  });
  it("has unique article ids and anchors and accurate export scope", () => {
    expect(new Set(helpArticles.map(({ number }) => number)).size).toBe(helpArticles.length);
    for (const article of helpArticles) {
      expect(new Set(article.sections.map(({ id }) => id)).size).toBe(article.sections.length);
    }
    const exportArticle = JSON.stringify(helpArticles.find(({ slug }) => slug === "export-transactions"));
    expect(exportArticle).toContain("loaded collection");
    expect(exportArticle).toContain("not a settlement statement");
    expect(exportArticle).toContain("acru-transactions.csv");
  });
});
