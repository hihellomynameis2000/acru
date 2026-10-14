import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DocumentationPage } from "./documentation-page";
import { expectPublishedLinks } from "@/components/testing/published-links";
import { apiPaths, docContent, docsNav, paymentIntentExample, requestSamples } from "../data/integration-documentation";

describe("Acru integration documentation", () => {
  it.each(docsNav.flatMap((group) => group.items))("renders $label as a dark, planned API reference", ({ id }) => {
    const html = renderToStaticMarkup(<DocumentationPage initialTopic={id} />);
    expect(html).toContain('data-theme="dark"');
    expect(html).toContain('class="docs-site-header"');
    expect(html).toContain('aria-label="Developer site navigation"');
    expect(html).toContain('href="#documentation-content"');
    expect(html).toContain("API specification, not a live service yet.");
    expect(html).toContain("Implementation in progress");
    expect(html).not.toContain("@acru/node");
    expect(html).not.toContain("api.acru.com/v1");
    expectPublishedLinks(html);
    expect(html).toContain('aria-controls="docs-topic-navigation"');
    expect(html).toContain('aria-expanded="false"');
    const sections = docContent[id].sections;
    expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
    for (const section of sections) {
      expect(html).toContain(`id="${section.id}"`);
      expect(html).toContain(`href="#${section.id}"`);
      if (section.example) {
        expect(section.example.status).toContain("contract example");
        expect(() => JSON.parse(section.example!.response)).not.toThrow();
      }
    }
  });

  it("uses the existing API prefix and never describes intent creation as collection", () => {
    for (const path of Object.values(apiPaths)) expect(path).toMatch(/^\/api\/v1\//);
    expect(paymentIntentExample.status).toBe("requires_payment_method");
    expect(paymentIntentExample.livemode).toBe(false);
    expect(docContent.quickstart.sections.some((section) => section.id === "current-preview")).toBe(true);
  });

  it("generates executable server-side JavaScript with the correct contract headers and payload", async () => {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const cases = [
      { path: apiPaths.account, body: undefined, key: undefined },
      { path: apiPaths.paymentIntents, body: { amount: 12500, currency: "usd" }, key: "order_create" }
    ];
    for (const { path, body, key } of cases) {
      const samples = requestSamples(path, body, key);
      let called = false;
      const fetchMock = async (url: URL, init: RequestInit) => {
        called = true;
        expect(url.href).toBe(`https://api.example${path}`);
        expect(init.method).toBe(body ? "POST" : "GET");
        expect(init.headers).toMatchObject({ Authorization: "Bearer test-only-placeholder" });
        if (body) {
          expect(init.headers).toMatchObject({ "Content-Type": "application/json", "Idempotency-Key": key });
          expect(JSON.parse(init.body as string)).toEqual(body);
        } else expect(init.body).toBeUndefined();
        return Response.json({ id: "contract-example" }, { headers: { "x-request-id": "req_example" } });
      };
      const run = new AsyncFunction("process", "fetch", "console", samples.JavaScript);
      await run(
        { env: { ACRU_API_BASE_URL: "https://api.example", ACRU_SECRET_KEY: "test-only-placeholder" } },
        fetchMock,
        { log() {} }
      );
      expect(called).toBe(true);
      expect(samples.cURL).toContain("--fail-with-body");
      expect(samples.Python).toContain("from urllib.request import Request, urlopen");
    }
  });
});
