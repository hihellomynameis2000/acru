import { describe, expect, it } from "vitest";

import { destinationForPortal, portalForHostname, portalForLocation, signInPathForPortal } from "@/lib/portal";

describe("portal routing", () => {
  it("maps production development hosts to isolated portals", () => {
    expect(portalForHostname("merchants.acrudevelopment.com")).toBe("merchant");
    expect(portalForHostname("sandbox-merchant.acrudevelopment.com:443")).toBe("sandbox");
    expect(portalForHostname("partners.acrudevelopment.com")).toBe("partner");
    expect(portalForHostname("admin.acrudevelopment.com")).toBe("admin");
  });

  it("supports portal routes on local preview hosts", () => {
    expect(portalForLocation("localhost", "/sandbox")).toBe("sandbox");
    expect(portalForLocation("localhost", "/partners/clients")).toBe("partner");
    expect(portalForLocation("localhost", "/admin/merchants")).toBe("admin");
  });

  it("builds the correct authentication and destination paths", () => {
    expect(signInPathForPortal("sandbox")).toBe("/sign-in?portal=sandbox");
    expect(destinationForPortal("partner")).toBe("/partners");
    expect(destinationForPortal("admin")).toBe("/admin");
    expect(destinationForPortal("merchant", true)).toBe("/dashboard");
  });
});
