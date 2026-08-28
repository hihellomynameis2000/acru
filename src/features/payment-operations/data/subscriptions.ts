import { createFixtureListAdapter } from "@/components/data/adapter";

export type SubscriptionStatus = "Active" | "Trialing" | "Past due" | "Paused" | "Canceled";
export type BillingInterval = "Monthly" | "Annual";

export type Subscription = {
  amountMinor: number;
  created: string;
  currency: "USD";
  customer: string;
  email: string;
  id: string;
  interval: BillingInterval;
  nextBilling: string;
  paymentMethod: string;
  plan: string;
  status: SubscriptionStatus;
};

export function filterSubscriptions(
  subscriptions: readonly Subscription[],
  query: string,
  status: "All" | SubscriptionStatus
) {
  const normalized = query.trim().toLowerCase();
  return subscriptions.filter(
    (subscription) =>
      (status === "All" || subscription.status === status) &&
      (!normalized ||
        [subscription.id, subscription.customer, subscription.email, subscription.plan]
          .join(" ")
          .toLowerCase()
          .includes(normalized))
  );
}

export function calculateSubscriptionMetrics(subscriptions: readonly Subscription[]) {
  const mrrMinor = subscriptions
    .filter((subscription) => subscription.status === "Active")
    .reduce(
      (total, subscription) =>
        total +
        (subscription.interval === "Annual" ? Math.round(subscription.amountMinor / 12) : subscription.amountMinor),
      0
    );
  const atRiskMinor = subscriptions
    .filter((subscription) => subscription.status === "Past due")
    .reduce((total, subscription) => total + subscription.amountMinor, 0);
  return { atRiskMinor, mrrMinor };
}

const subscriptionFixtures: Subscription[] = [
  {
    amountMinor: 14_900,
    created: "Aug 10, 2026",
    currency: "USD",
    customer: "Nathan Bariac",
    email: "nathan.bariac@gmail.com",
    id: "sub_8Qm4aL2xN7",
    interval: "Monthly",
    nextBilling: "Sep 10, 2026",
    paymentMethod: "Visa •••• 3830",
    plan: "Pro plan",
    status: "Active"
  },
  {
    amountMinor: 249_900,
    created: "Aug 8, 2026",
    currency: "USD",
    customer: "Olivia Martin",
    email: "olivia@northwind.co",
    id: "sub_3Kt7vB9cR1",
    interval: "Annual",
    nextBilling: "Aug 8, 2027",
    paymentMethod: "USDC · Base",
    plan: "Enterprise plan",
    status: "Active"
  },
  {
    amountMinor: 14_900,
    created: "Aug 7, 2026",
    currency: "USD",
    customer: "Maya Chen",
    email: "maya@riverlabs.io",
    id: "sub_6Hs1eP5wD8",
    interval: "Monthly",
    nextBilling: "Aug 21, 2026",
    paymentMethod: "ACH •••• 4242",
    plan: "Pro plan",
    status: "Trialing"
  },
  {
    amountMinor: 2_900,
    created: "Jul 28, 2026",
    currency: "USD",
    customer: "Liam Carter",
    email: "liam@atlasdesign.co",
    id: "sub_1Vj8yC4qM0",
    interval: "Monthly",
    nextBilling: "Aug 28, 2026",
    paymentMethod: "Visa •••• 9014",
    plan: "Workspace seat",
    status: "Past due"
  },
  {
    amountMinor: 49_900,
    created: "Jul 22, 2026",
    currency: "USD",
    customer: "Sofia Rodriguez",
    email: "sofia@solstudio.mx",
    id: "sub_9Rc2fA7zK5",
    interval: "Monthly",
    nextBilling: "—",
    paymentMethod: "Mastercard •••• 4486",
    plan: "Priority support",
    status: "Paused"
  },
  {
    amountMinor: 7_900,
    created: "Jun 18, 2026",
    currency: "USD",
    customer: "Noah Williams",
    email: "noah@foundry.team",
    id: "sub_4Nx6sW3bT9",
    interval: "Monthly",
    nextBilling: "—",
    paymentMethod: "Amex •••• 7210",
    plan: "Legacy starter plan",
    status: "Canceled"
  },
  {
    amountMinor: 14_900,
    created: "May 11, 2026",
    currency: "USD",
    customer: "Emma Thompson",
    email: "emma@cedarworks.ca",
    id: "sub_7Bg0kE8hF2",
    interval: "Monthly",
    nextBilling: "Sep 11, 2026",
    paymentMethod: "ACH •••• 1138",
    plan: "Pro plan",
    status: "Active"
  }
];

export const subscriptionAdapter = createFixtureListAdapter<Subscription>({
  filter: () => true,
  latency: 80,
  seed: subscriptionFixtures
});
