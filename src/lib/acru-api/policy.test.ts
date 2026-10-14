import { describe, expect, it } from "vitest";

import { isAllowedAcruApiPath, isSameOriginMutation } from "@/lib/acru-api/policy";

describe("ACRU API gateway policy", () => {
  it("allows ACRU product domains", () => {
    expect(isAllowedAcruApiPath(["payment-intents", "pi_123"])).toBe(true);
    expect(isAllowedAcruApiPath(["risk", "reviews"])).toBe(true);
  });

  it("rejects platform, admin, and traversal paths", () => {
    expect(isAllowedAcruApiPath(["platform", "usage"])).toBe(false);
    expect(isAllowedAcruApiPath(["admin"])).toBe(false);
    expect(isAllowedAcruApiPath(["payments", "..", "platform"])).toBe(false);
  });

  it("rejects cross-origin browser mutations", () => {
    expect(isSameOriginMutation("https://app.acru.test/api/acru/payments", "https://app.acru.test")).toBe(true);
    expect(isSameOriginMutation("https://app.acru.test/api/acru/payments", "https://attacker.test")).toBe(false);
  });
});
