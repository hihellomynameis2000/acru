import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LegalPage } from "./legal-page";
import { LegalCenter } from "./legal-center";
import { legalDocumentList } from "../data/legal";
import { homepageHref } from "../data/editorial";
import { expectPublishedLinks } from "@/components/testing/published-links";

describe("redesigned public legal pages", () => {
  it.each(legalDocumentList)("keeps all $slug sections with the shared navigation and footer", (document) => {
    const html = renderToStaticMarkup(<LegalPage document={document} />);
    expect(html).toContain('class="cinematic-header"');
    expect(html).toContain('class="landing-footer"');
    expect(html).not.toContain('class="marketing-header"');
    expect(html).toContain('aria-label="Acru social media"');
    expect(html.match(/class="legal-section"/g)).toHaveLength(document.sections.length);
    for (const section of document.sections) {
      expect(html).toContain(`id="${section.id}"`);
      expect(html).toContain(`href="#${section.id}"`);
    }
    expect(html).toContain('href="/developers/documentation"');
    expect(html).toContain('href="/payouts"');
    expect(html).toContain('href="/legal/privacy"');
    expect(html).toContain('href="/legal/terms"');
    expect(html).not.toContain('href="#products"');
    expectPublishedLinks(html);
  });

  it("keeps the legal center and its document destinations", () => {
    const html = renderToStaticMarkup(<LegalCenter />);
    expect(html).toContain("Legal center");
    expect(html).toContain('class="landing-footer"');
    for (const document of legalDocumentList) expect(html).toContain(`href="/legal/${document.slug}"`);
  });

  it("only prefixes homepage section links from secondary pages", () => {
    expect(homepageHref("#products", false)).toBe("/#products");
    expect(homepageHref("#products")).toBe("#products");
    expect(homepageHref("/demo", false)).toBe("/demo");
    expect(homepageHref("mailto:legal@acru.com", false)).toBe("mailto:legal@acru.com");
  });
});
