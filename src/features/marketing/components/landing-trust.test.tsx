import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { acruClients, acruClientLogos } from "@/features/marketing/data/clients";
import { editorialHref, landingFaqs } from "@/features/marketing/data/editorial";
import { ClientCarousel } from "./client-carousel";
import { LandingSections } from "./landing-sections";
import { LandingFooter } from "./landing-editorial";
import { PaymentFlowFilm } from "./payment-flow-film";

describe("payment methods and client proof", () => {
  it("removes the standalone method lineup while retaining the product card and FAQ coverage", () => {
    const html = renderToStaticMarkup(<LandingSections />);
    expect(html).not.toContain("The ways your customers want to pay.");
    expect(html).not.toContain('id="alternative-payment-methods"');
    expect(html).not.toContain('class="landing-methods"');
    expect(html).not.toContain("Payment method availability depends on your market and approved configuration.");
    expect(html).toContain('id="payment-methods"');
    for (const method of ["Apple Pay", "Google Pay", "PayPal", "Venmo", "Pix", "SEPA", "Klarna", "Afterpay"]) {
      expect(landingFaqs.find(({ id }) => id === "methods")?.answer).toContain(method);
    }
    expect(editorialHref("/features/alternative-payment-methods")).toBe("/features/alternative-payment-methods");
  });

  it("uses exactly the approved clients and hides the looping copy from assistive technology", () => {
    expect(acruClients).toEqual([
      "Bitunix",
      "Blofin",
      "PackDraw",
      "Leveledup Traders",
      "Roobet",
      "MundPay",
      "Fulfillment Pros",
      "Solstice Marketing Solutions",
      "Crush Research",
      "Betonline.ag",
      "Cornerstone ATS"
    ]);
    const html = renderToStaticMarkup(<ClientCarousel />);
    expect(acruClientLogos).toHaveLength(10);
    for (const { name, src } of acruClientLogos) {
      expect(acruClients).toContain(name);
      expect(html).toContain(`alt="${name}"`);
      expect(html.split(`src="${src}"`)).toHaveLength(3);
      expect(existsSync(`public${src}`)).toBe(true);
    }
    expect(html).toContain('aria-hidden="true" data-duplicate="true"');
    expect(html).not.toContain("<button");
    expect(html).toContain('data-running="false"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('class="landing-client-badge"');
    expect(html).toContain('class="landing-clients-band"><div class="landing-clients-viewport"');
    expect(html).not.toContain('alt="Solstice Marketing Solutions"');
  });

  it("places client proof above the platform paragraph and payment-flow film", () => {
    const html = renderToStaticMarkup(<PaymentFlowFilm />);
    const carousel = html.indexOf('class="landing-clients"');
    const paragraph = html.indexOf('class="marketing-scroll-reveal"');
    const film = html.indexOf('id="payment-flow-animation"');
    expect(carousel).toBeGreaterThan(-1);
    expect(paragraph).toBeGreaterThan(carousel);
    expect(film).toBeGreaterThan(paragraph);
  });

  it("uses the supplied footer badges with the user-confirmed PCI Level 1 wording", () => {
    const html = renderToStaticMarkup(<LandingFooter />);
    expect(html).toContain('aria-label="PCI DSS validated Level 1 service provider"');
    expect(html).toContain('aria-label="SOC 2 Type II"');
    for (const asset of ["pci-dss-level-1.webp", "aicpa-soc.webp"]) {
      const path = `/marketing/compliance/v1/${asset}`;
      expect(html).toContain(`src="${path}"`);
      expect(existsSync(`public${path}`)).toBe(true);
    }
    expect(html).not.toMatch(/Visa|certified by/i);
    expect(html).toContain('aria-label="Acru social media"');
  });
});
