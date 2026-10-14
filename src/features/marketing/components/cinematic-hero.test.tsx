import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CinematicHero } from "./cinematic-hero";
import { LandingEditorial, LandingFooter } from "./landing-editorial";
import { mobileHeroAssets } from "../data/cinematic";
import { socialLinks } from "../data/social";
import { editorialDestinations, editorialHref, footerDirectory } from "../data/editorial";
import { MarketingHome } from "./marketing-home";
import { expectPublishedLinks } from "@/components/testing/published-links";

describe("mobile hero delivery", () => {
  it("resolves every replacement anchor to a real homepage section", () => {
    const html = renderToStaticMarkup(<MarketingHome />);
    expectPublishedLinks(html);
    for (const href of Object.values(editorialDestinations)) {
      if (href.startsWith("#")) expect(html).toContain(`id="${href.slice(1)}"`);
    }
  });
  it("offers mobile images before hydration and retains accessible static content", () => {
    const html = renderToStaticMarkup(<CinematicHero />);
    for (const asset of ["frames/0000.webp", "handoff.webp", "dashboard.webp"]) {
      expect(html).toContain(`<source media="(max-width: 820px)" srcSet="${mobileHeroAssets.base}/${asset}"`);
    }
    expect(html).toContain('data-motion="static"');
    expect(html).toContain('id="cinematic-heading"');
    expect(html).toContain('id="payment-flow-heading"');
    expect(html).toContain('class="cinematic-return-hero" inert="" aria-hidden="true"');
    expect(html).toContain('id="cinematic-return-heading"');
  });

  it("matches hero button styles and links See demo to the local request form", () => {
    const html = renderToStaticMarkup(<LandingEditorial />);
    expect(html).toContain('class="cinematic-actions landing-next-actions"');
    expect(html).toMatch(
      /class="cinematic-primary landing-next-primary"[^>]*href="\/payments\/overview"[^>]*>Learn more<\/a>/
    );
    expect(html).toMatch(/class="cinematic-secondary landing-next-secondary"[^>]*href="\/demo"[^>]*>See demo/);
    expect(html).not.toContain("Talk to Acru");
    expect(html).not.toContain("Take a closer look");
    expectPublishedLinks(html);
    expect(html).not.toContain("Read the guide");
  });

  it("shows only X and LinkedIn without the removed footer contact block", () => {
    const html = renderToStaticMarkup(<LandingFooter />);
    expect(html).toContain('aria-label="Acru social media"');
    expect(socialLinks.map(({ label }) => label)).toEqual(["X", "LinkedIn"]);
    expect(html).not.toContain('aria-label="Acru on Facebook"');
    expect(html).not.toContain('aria-label="Acru on YouTube"');
    for (const social of socialLinks) {
      expect(html).toContain(`href="${social.href}"`);
      expect(html).toContain(`aria-label="Acru on ${social.label}"`);
    }
    expect(html).not.toContain("Have a payment challenge");
    expect(html).not.toContain("Let’s talk.");
    expect(html).not.toContain(">sales@acru.com</a>");
    expect(html).not.toContain("Sign in to Acru");
  });

  it("renders every public landing destination in the footer", () => {
    const html = renderToStaticMarkup(<LandingFooter />);

    for (const group of footerDirectory) {
      for (const [label, source] of group.links) {
        expect(html).toContain(`href="${editorialHref(source)}"`);
        expect(html).toContain(`>${label.replaceAll("&", "&amp;")}</a>`);
      }
    }
  });
});
