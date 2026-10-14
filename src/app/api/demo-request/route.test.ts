import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const details = {
  firstName: "Alex",
  lastName: "Test",
  email: "alex@example.com",
  company: "Example",
  website: "example.com",
  country: "United States",
  businessType: "Ecommerce",
  volume: "Under $100,000",
  message: "A checkout demo",
  contactConsent: true,
  companyFax: ""
};
const request = (body: unknown = details, origin = "http://localhost:3100") =>
  new Request("http://localhost:3100/api/demo-request", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body)
  });

describe("demo lead delivery", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    vi.stubEnv("ACRU_DEMO_WEBHOOK_URL", "https://crm.example.com/leads");
    vi.stubEnv("ACRU_DEMO_WEBHOOK_TOKEN", "test-only-token");
    vi.stubEnv("ACRU_DEMO_BOOKING_URL", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not collect or forward leads before configuration", async () => {
    vi.stubEnv("ACRU_DEMO_WEBHOOK_URL", "");
    const incoming = request();
    const response = await POST(incoming);
    expect(response.status).toBe(503);
    expect(incoming.bodyUsed).toBe(false);
    expect(await response.json()).toEqual({ accepted: false, error: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects cross-origin submissions", async () => {
    expect((await POST(request(details, "https://unrelated.example.com"))).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { ...details, contactConsent: false },
    { ...details, companyFax: "bot" },
    { ...details, email: "invalid" }
  ])("validates details before delivery", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bounds the body even without a Content-Length header", async () => {
    expect((await POST(request({ ...details, message: "a".repeat(13_000) }))).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("only confirms receipt after successful real delivery", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubEnv("ACRU_DEMO_BOOKING_URL", "https://calendar.example.com/acru");
    const response = await POST(request());
    expect(await response.json()).toEqual({ accepted: true, bookingUrl: "https://calendar.example.com/acru" });
    expect(response.headers.get("cache-control")).toBe("no-store");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://crm.example.com/leads");
    expect(options.redirect).toBe("error");
    expect(options.headers.Authorization).toBe("Bearer test-only-token");
    expect(JSON.parse(options.body).lead).not.toHaveProperty("companyFax");
    expect(JSON.parse(options.body).lead.email).toBe(details.email);
  });

  it.each(["error", "timeout"])("does not claim success on delivery %s", async (kind) => {
    if (kind === "error") fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    else fetchMock.mockRejectedValue(new Error("timeout"));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect((await response.json()).accepted).toBe(false);
  });

  it("never returns unsafe calendar URLs", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubEnv("ACRU_DEMO_BOOKING_URL", "javascript:alert(1)");
    expect((await (await POST(request())).json()).bookingUrl).toBe(null);
  });
});
