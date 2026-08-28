import { describe, expect, it } from "vitest";

import { calculateSubscriptionMetrics, filterSubscriptions, type Subscription } from "./subscriptions";

const base: Subscription = {
  amountMinor: 12_000,
  created: "Aug 28, 2026",
  currency: "USD",
  customer: "Northstar Studio",
  email: "finance@northstar.studio",
  id: "sub_monthly",
  interval: "Monthly",
  nextBilling: "Sep 28, 2026",
  paymentMethod: "Visa •••• 4242",
  plan: "Pro",
  status: "Active"
};

describe("subscription data helpers", () => {
  it("normalizes annual plans into monthly recurring revenue using minor units", () => {
    const annual = { ...base, amountMinor: 120_000, id: "sub_annual", interval: "Annual" as const };
    const pastDue = { ...base, amountMinor: 2_900, id: "sub_risk", status: "Past due" as const };
    expect(calculateSubscriptionMetrics([base, annual, pastDue])).toEqual({ atRiskMinor: 2_900, mrrMinor: 22_000 });
  });

  it("filters by status and searches customer-facing fields", () => {
    const canceled = { ...base, customer: "Maya Chen", id: "sub_canceled", status: "Canceled" as const };
    expect(filterSubscriptions([base, canceled], "maya", "All")).toEqual([canceled]);
    expect(filterSubscriptions([base, canceled], "", "Active")).toEqual([base]);
  });
});
