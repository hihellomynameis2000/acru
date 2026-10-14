import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeaderNavigation } from "./header-navigation";

describe("header navigation initial render", () => {
  it.each([true, false])(
    "links desktop, mobile and no-JS Developers navigation to docs (homepage=%s)",
    (onHomepage) => {
      const html = renderToStaticMarkup(<HeaderNavigation onHomepage={onHomepage} onExpandedChange={() => {}} />);
      expect(html.match(/href="\/developers\/documentation"/g)).toHaveLength(3);
      expect(html).not.toContain('href="#developers"');
      expect(html).not.toContain('href="/#developers"');
    }
  );
  it("defers every generated illustration until a menu is requested", () => {
    const html = renderToStaticMarkup(<HeaderNavigation onExpandedChange={() => {}} />);
    expect(html).not.toContain("/marketing/navigation/");
    expect(html).not.toContain("<video");
    expect(html).toContain('id="acru-desktop-navigation" data-open="false" inert="" aria-hidden="true"');
  });

  it("provides native disclosure buttons, a mobile dialog, and the circular sign-in icon", () => {
    const html = renderToStaticMarkup(<HeaderNavigation onExpandedChange={() => {}} />);
    for (const id of ["products", "solutions", "resources", "company"]) {
      expect(html).toContain(`data-nav-trigger="${id}" aria-expanded="false" aria-controls="acru-desktop-navigation"`);
      expect(html).toContain(`aria-expanded="false" aria-controls="acru-mobile-section-${id}"`);
      expect(html).toContain(
        `id="acru-mobile-section-${id}" class="acru-mobile-section-body" inert="" aria-hidden="true"`
      );
    }
    expect(html).not.toContain("acru-mobile-back");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('<dialog class="cinematic-menu acru-mobile-navigation"');
    expect(html).toContain('class="cinematic-menu-lines" aria-hidden="true"');
    expect(html).toContain('class="cinematic-sign-in"');
    expect(html).toContain('aria-label="Navigation"');
  });
});
