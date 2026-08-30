import { describe, expect, it } from "vitest";

import {
  capabilitiesForTeamAccess,
  createTeamPermissionPreset,
  summarizeTeamAccess,
  teamInviteRoles,
  teamPermissionGroups
} from "./settings";

describe("team permission presets", () => {
  const pageCount = teamPermissionGroups.reduce((total, group) => total + group.pages.length, 0);

  it("returns an explicit access level for every page and role", () => {
    for (const role of teamInviteRoles) {
      expect(Object.keys(createTeamPermissionPreset(role))).toHaveLength(pageCount);
    }
  });

  it("grants administrators manage access across the workspace", () => {
    expect(Object.values(createTeamPermissionPreset("Administrator"))).toEqual(
      Array.from({ length: pageCount }, () => "manage")
    );
  });

  it("keeps sensitive finance access scoped and support access away from banking", () => {
    const finance = createTeamPermissionPreset("Finance");
    const support = createTeamPermissionPreset("Support");

    expect(finance.payouts).toBe("manage");
    expect(finance["banking-settings"]).toBe("manage");
    expect(finance["developer-tools"]).toBe("none");
    expect(support.refunds).toBe("operate");
    expect(support.payouts).toBe("none");
    expect(support["team-settings"]).toBe("none");
  });

  it("derives capability detail and summary counts from the selected levels", () => {
    const transactions = teamPermissionGroups
      .flatMap((group) => group.pages)
      .find((page) => page.id === "transactions");
    expect(transactions).toBeDefined();
    expect(capabilitiesForTeamAccess(transactions!, "view")).toHaveLength(1);
    expect(capabilitiesForTeamAccess(transactions!, "operate")).toHaveLength(2);
    expect(capabilitiesForTeamAccess(transactions!, "manage")).toHaveLength(3);
    expect(summarizeTeamAccess({ a: "view", b: "operate", c: "manage", d: "none" })).toEqual({
      enabledPages: 3,
      managedPages: 1,
      operatedPages: 1
    });
  });
});
