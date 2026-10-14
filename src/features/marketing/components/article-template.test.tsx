import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { articles } from "../data/articles";
import { ArticleIndex, ArticleTemplate } from "./article-template";

describe("article template", () => {
  it("renders a discoverable article index without dead article cards", () => {
    const html = renderToStaticMarkup(<ArticleIndex />);

    expect(html).toContain("Acru articles");
    expect(html).not.toContain("↗");
    for (const article of articles) {
      expect(html).toContain(`href="/articles/${article.slug}"`);
      expect(html).toContain(article.title);
    }
  });

  it("renders article metadata, duplicate desktop/mobile navigation, and every section", () => {
    const article = articles[0];
    const html = renderToStaticMarkup(<ArticleTemplate article={article} />);

    expect(html).toContain(`<time dateTime="${article.publishedAt}">${article.publishedLabel}</time>`);
    expect(html).toContain("Related articles");
    expect(html).not.toContain("Turn the payment flow into a plan.");
    expect(html).not.toContain("What’s next");
    expect(html).not.toContain("↗");
    for (const related of articles.slice(1)) {
      expect(html).toContain(`href="/articles/${related.slug}"`);
      expect(html).toContain(related.hero.alt);
    }
    for (const section of article.sections) {
      expect(html).toContain(`id="${section.id}"`);
      expect(html.match(new RegExp(`href="#${section.id}"`, "g"))).toHaveLength(2);
      expect(html).toContain(section.title);
    }
  });
});
