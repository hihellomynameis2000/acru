import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DemoRequestForm } from "./demo-request-form";
import { demoRequestSchema } from "../data/demo-request";

describe("demo request form", () => {
  it("renders labeled business fields and explicit unchecked contact consent", () => {
    const html = renderToStaticMarkup(<DemoRequestForm />);
    for (const name of Object.keys(demoRequestSchema.shape)) expect(html).toContain(`name="${name}"`);
    expect(html).toContain("Request a demo");
    expect(html).toContain('href="/legal/privacy"');
    expect(html).not.toContain('checked=""');
    expect(html).not.toContain("appointment confirmed");
  });
});
