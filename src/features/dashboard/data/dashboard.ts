import { createFixtureListAdapter } from "@/components/data/adapter";

export const dashboardSnapshotAdapter = createFixtureListAdapter({
  filter: () => true,
  latency: 80,
  seed: [{ id: "merchant-dashboard" }]
});

export type HealthIcon = "approval" | "chargeback" | "fraud" | "3ds" | "settlement";

export const healthRows: Array<{
  change: string;
  icon: HealthIcon;
  name: string;
  tone: string;
  value: string;
}> = [
  { icon: "approval", tone: "purple", name: "Approval rate", value: "98.7%", change: "↗ 1.2%" },
  { icon: "chargeback", tone: "red", name: "Chargeback rate", value: "0.14%", change: "↗ 0.03%" },
  { icon: "fraud", tone: "gold", name: "Fraud score", value: "Low risk", change: "●" },
  { icon: "3ds", tone: "teal", name: "3DS success rate", value: "99.2%", change: "↗ 2.1%" },
  { icon: "settlement", tone: "coral", name: "Settlement reliability", value: "100.0%", change: "−" }
];

export const activities: Array<{
  amount: string;
  detail: string;
  icon: "ethereum" | "usdc" | "bank" | "visa";
  status: string;
  statusTone: string;
  tone: string;
}> = [
  {
    icon: "ethereum",
    tone: "eth",
    detail: "Ethereum • 2 mins ago",
    status: "2/6 confirmations",
    statusTone: "confirm",
    amount: "$2,943.25"
  },
  {
    icon: "usdc",
    tone: "usdc",
    detail: "USDC (Base) • 12 mins ago",
    status: "Succeeded",
    statusTone: "success",
    amount: "$8,320.00"
  },
  {
    icon: "bank",
    tone: "ach",
    detail: "ACH • 2 mins ago",
    status: "Succeeded",
    statusTone: "success",
    amount: "$1,245.00"
  },
  {
    icon: "visa",
    tone: "visa",
    detail: "Visa • 2 mins ago",
    status: "Succeeded",
    statusTone: "success",
    amount: "$92.50"
  }
];

export const notices: Array<{
  amount?: string;
  href: string;
  icon: "dispute" | "request" | "payout";
  subtitle: string;
  title: string;
  tone: string;
}> = [
  {
    icon: "dispute",
    tone: "notice-gold",
    title: "2 disputes require attention",
    subtitle: "Respond before May 7",
    href: "/payments/disputes"
  },
  {
    icon: "request",
    tone: "notice-blue",
    title: "3 information requests",
    subtitle: "Documents needed",
    href: "/settings/business"
  },
  {
    icon: "payout",
    tone: "notice-purple",
    title: "Payout to Wells Fargo Bank **** 4242",
    subtitle: "Scheduled for tomorrow",
    href: "/payments/payouts",
    amount: "$98,443.12"
  }
];

export const dailySales = [
  0, 12_000, 28_000, 34_000, 35_000, 36_000, 49_000, 59_000, 58_000, 72_000, 99_000, 122_000, 131_000, 137_000, 151_000,
  174_000, 126_000, 96_000, 108_000, 129_000, 142_000, 148_000, 146_000, 149_000, 153_000, 149_000, 139_000, 134_000,
  135_000, 153_000, 174_000, 181_000, 187_000, 191_000, 195_000, 200_000
];
