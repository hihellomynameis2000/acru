import { describe, expect, it } from "vitest";
import { getProductFaqs, productQuestions } from "./product-faqs";
import { productPages } from "./product-pages";

describe("specific product FAQs", () => {
  it("provides at least four distinct product questions and six substantial answers per page", () => {
    const specificQuestions = new Set<string>();
    for (const page of Object.values(productPages)) {
      expect(productQuestions[page.title].length).toBeGreaterThanOrEqual(4);
      const faqs = getProductFaqs(page);
      expect(faqs.length).toBeGreaterThanOrEqual(6);
      expect(new Set(faqs.map((faq) => faq.id)).size).toBe(faqs.length);
      for (const faq of faqs) {
        expect(faq.answer.length).toBeGreaterThan(150);
        expect(faq.answer).not.toBe(page.intro + " " + page.summary);
      }
      for (const [question] of productQuestions[page.title]) {
        expect(specificQuestions.has(question)).toBe(false);
        specificQuestions.add(question);
      }
    }
  });
  it("answers practical card-processing and checkout questions", () => {
    const card = getProductFaqs(productPages["/features/card-processing"]);
    const checkout = getProductFaqs(productPages["/features/checkout"]);
    expect(card).toHaveLength(10);
    expect(checkout).toHaveLength(10);
    expect(card.some((faq) => faq.question.includes("capture"))).toBe(true);
    expect(card.some((faq) => faq.question.includes("saved cards"))).toBe(true);
    expect(checkout.some((faq) => faq.question.includes("twice"))).toBe(true);
    expect(checkout.some((faq) => faq.question.includes("order as paid"))).toBe(true);
  });
});
