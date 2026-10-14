import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingFaq } from "./landing-faq";

const items = Array.from({ length: 8 }, (_, index) => ({
  id: `test-${index}`,
  question: `Question ${index}`,
  answer: `Answer ${index}`
}));

describe("marketing FAQ length", () => {
  it("shows six questions by default without truncating answers", () => {
    const html = renderToStaticMarkup(<LandingFaq items={items} />);
    expect(html.match(/aria-expanded=/g)).toHaveLength(6);
    expect(html).toContain("Answer 5");
    expect(html).not.toContain("Question 6");
  });

  it("keeps the dedicated FAQ page complete", () => {
    const html = renderToStaticMarkup(<LandingFaq items={items} limit={null} />);
    expect(html.match(/aria-expanded=/g)).toHaveLength(8);
  });
});
