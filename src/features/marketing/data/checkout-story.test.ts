import { describe, expect, it } from "vitest";
import { checkoutDeployment, checkoutFaqs, checkoutFeatures, checkoutTabs } from "./checkout-story";
import { productQuestions } from "./product-faqs";

describe("Checkout local content preview", () => {
  it("uses Hosted, Embedded and API without changing shared product FAQs", () => {
    expect(checkoutDeployment.map((mode) => mode.label)).toEqual(["Hosted", "Embedded", "API"]);
    expect(productQuestions.Checkout[0][0]).toBe("Should I choose hosted, embedded, or custom checkout?");
  });

  it("provides the three requested tab compositions with distinct destinations", () => {
    expect(checkoutTabs.map((tab) => tab.label)).toEqual(["Design it", "Build it", "Understand it"]);
    expect(checkoutTabs[0].capabilities).toHaveLength(4);
    expect(checkoutTabs[1].capabilities).toHaveLength(4);
    expect(new Set(checkoutTabs.map((tab) => tab.id)).size).toBe(3);
    for (const tab of checkoutTabs) expect(tab.href).toMatch(/^(\/|#)/);
    expect(checkoutTabs[2].href).toBe("/features/reporting");
  });

  it("provides six concise FAQs and preserves qualified compliance language", () => {
    expect(checkoutFaqs).toHaveLength(6);
    expect(checkoutFaqs[0].question).toBe("Which Acru Checkout integration should I choose?");
    expect(checkoutFaqs[4].answer).toContain("still has security and compliance responsibilities");
    expect(checkoutFaqs[3].answer).toContain("check the original payment outcome");
    expect(new Set(checkoutFaqs.map((faq) => faq.id)).size).toBe(6);
    for (const faq of checkoutFaqs) expect(faq.answer.split(/\s+/).length).toBeLessThanOrEqual(35);
    for (const faq of checkoutFaqs) expect(faq.answer.length).toBeGreaterThan(80);
  });

  it("pairs the lower artwork with checkout features rather than integration methods", () => {
    expect(checkoutFeatures.map((feature) => feature.artwork)).toEqual(["methods", "authorization", "intelligence"]);
    expect(checkoutFeatures.map((feature) => feature.label)).toEqual([
      "Payment methods",
      "Authentication",
      "Payment status"
    ]);
    expect(checkoutFeatures[0].body).toContain("available for your business and market");
    expect(checkoutFeatures[2].body).toContain("not proof of payment");
  });
});
