import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "@/proxy";

function request(host: string, pathname = "/") {
  return new NextRequest(`https://${host}${pathname}`, { headers: { host } });
}

describe("public and portal host routing", () => {
  it("keeps the corporate root public", () => {
    const response = proxy(request("acrudevelopment.com"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull();
  });

  it("continues routing the merchant subdomain root to its console", () => {
    const response = proxy(request("merchants.acrudevelopment.com"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://merchants.acrudevelopment.com/dashboard");
  });
});
