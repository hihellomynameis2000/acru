import { expect } from "vitest";

const approvedOrigins = new Set([
  "https://acru.com",
  "https://www.acru.com",
  "https://merchants.acrudevelopment.com",
  "https://x.com",
  "https://www.linkedin.com"
]);

/** Public navigation must use local destinations or approved external origins. */
export function expectPublishedLinks(html: string) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    const destination = new URL(href, "https://acru.com");
    expect(approvedOrigins.has(destination.origin), `Unexpected link destination: ${href}`).toBe(true);
  }
}
