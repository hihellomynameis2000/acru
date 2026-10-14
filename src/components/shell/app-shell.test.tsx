import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

const location = vi.hoisted(() => ({ pathname: "/developers/documentation" }));
vi.mock("next/navigation", () => ({
  usePathname: () => location.pathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() })
}));

describe("standalone developer documentation", () => {
  it.each(["/developers", "/developers/documentation"])("renders %s outside the merchant shell", (pathname) => {
    location.pathname = pathname;
    const html = renderToStaticMarkup(
      <AppShell>
        <div>Documentation content</div>
      </AppShell>
    );
    expect(html).toBe("<div>Documentation content</div>");
    expect(html).not.toContain("global-topbar");
    expect(html).not.toContain("sidebar");
  });

  it("does not make API-key management public along with the docs", () => {
    location.pathname = "/developers/api-keys";
    const html = renderToStaticMarkup(
      <AppShell>
        <div>Private key management</div>
      </AppShell>
    );
    expect(html).not.toContain("Private key management");
    expect(html).toContain("onboarding-loading");
  });
});
