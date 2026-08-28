import { createFixtureListAdapter } from "@/components/data/adapter";

export type Period = "7D" | "30D" | "3M" | "1Y" | "Custom";
export type AssetKind = "Fiat" | "Crypto" | "Platform credits";
export type Status = "Available" | "Pending" | "Completed" | "Processing";
export type ExportFormat = "CSV" | "PDF" | "JSON" | "ZIP";

export const analyticsKpis = [
  ["Gross volume", "$8.42M", "+18.6%", "Total processed"],
  ["Net revenue", "$6.21M", "+15.3%", "After refunds and fees"],
  ["Successful payments", "24,491", "+12.7%", "Across all rails"],
  ["Approval rate", "98.7%", "+1.2%", "Up 1.2 pts"]
] as const;

export const paymentFlowStages: Array<{
  detail: string;
  icon: "customer" | "authorized" | "captured" | "settled" | "balance";
  label: string;
  value: string;
}> = [
  { label: "Customers", value: "$8.43M", detail: "24,491 payments", icon: "customer" },
  { label: "Authorized", value: "$8.21M", detail: "97.4% approved", icon: "authorized" },
  { label: "Captured", value: "$8.02M", detail: "97.7% capture rate", icon: "captured" },
  { label: "Settled", value: "$7.75M", detail: "T+1 settlements", icon: "settled" },
  { label: "Your balance", value: "$841.29K", detail: "Available now", icon: "balance" }
];

export const chartSeries: Record<Period, number[]> = {
  "7D": [38, 52, 47, 66, 58, 77, 83],
  "30D": [32, 39, 36, 46, 43, 57, 54, 67, 63, 75, 71, 86],
  "3M": [28, 37, 35, 45, 42, 53, 61, 56, 69, 73, 68, 82],
  "1Y": [24, 31, 29, 41, 46, 44, 56, 63, 59, 71, 76, 88],
  Custom: [31, 36, 43, 40, 51, 58, 55, 64, 70, 74, 79, 84]
};

export const methods = [
  {
    name: "Visa",
    share: 45.4,
    amount: "$3.82M",
    approval: "98.9% approval",
    tone: "#6386ff",
    logo: "/payment-rails/visa.svg",
    logoClass: "visa"
  },
  {
    name: "Mastercard",
    share: 25.4,
    amount: "$2.14M",
    approval: "98.2% approval",
    tone: "#eb7b54",
    logo: "/payment-rails/mastercard.svg",
    logoClass: "mastercard"
  },
  {
    name: "Apple Pay",
    share: 14.4,
    amount: "$1.21M",
    approval: "99.3% approval",
    tone: "#e3e3e3",
    logo: "/payment-rails/apple-pay.svg",
    logoClass: "apple-pay"
  },
  {
    name: "ACH",
    share: 9.8,
    amount: "$824K",
    approval: "97.6% approval",
    tone: "#a879e7",
    logo: "/payment-rails/ach.svg",
    logoClass: "ach"
  },
  {
    name: "USDC",
    share: 5,
    amount: "$421K",
    approval: "99.8% approval",
    tone: "#4aa6da",
    logo: "/payment-rails/usdc-white.svg",
    logoClass: "usdc"
  }
];

export const regions = [
  { name: "United States", amount: "$4.61M", share: 54.8 },
  { name: "United Kingdom", amount: "$1.18M", share: 14 },
  { name: "Canada", amount: "$934K", share: 11.1 },
  { name: "Germany", amount: "$612K", share: 7.3 },
  { name: "Other", amount: "$1.08M", share: 12.8 }
];

export const statementRows: Array<{
  period: string;
  scope: AssetKind | "All balances";
  gross: string;
  adjustments: string;
  settled: string;
  closing: string;
}> = [
  {
    period: "July 2026",
    scope: "All balances",
    gross: "$2,784,208.42",
    adjustments: "−$81,306.11",
    settled: "$2,655,994.16",
    closing: "$184,702.82"
  },
  {
    period: "June 2026",
    scope: "Fiat",
    gross: "$1,824,119.04",
    adjustments: "−$51,942.28",
    settled: "$1,746,098.22",
    closing: "$118,048.66"
  },
  {
    period: "June 2026",
    scope: "Crypto",
    gross: "318,406.20 USDC",
    adjustments: "−3,184.06 USDC",
    settled: "304,980.14 USDC",
    closing: "42,866.31 USDC"
  },
  {
    period: "June 2026",
    scope: "Platform credits",
    gross: "72,500.00 USDC",
    adjustments: "−420.00 USDC",
    settled: "61,800.00 USDC",
    closing: "18,400.00 USDC"
  },
  {
    period: "May 2026",
    scope: "All balances",
    gross: "$2,406,314.18",
    adjustments: "−$73,819.42",
    settled: "$2,284,050.76",
    closing: "$156,488.19"
  },
  {
    period: "April 2026",
    scope: "All balances",
    gross: "$2,112,984.56",
    adjustments: "−$64,271.08",
    settled: "$2,006,513.22",
    closing: "$142,661.34"
  }
];

export const withdrawals: Array<{
  created: string;
  amount: string;
  asset: string;
  destination: string;
  rail: string;
  status: Status;
  fee: string;
  arrival: string;
}> = [
  {
    created: "Aug 20, 2026 · 3:42 PM",
    amount: "$42,500.00",
    asset: "USD",
    destination: "Wells Fargo •••• 4242",
    rail: "ACH",
    status: "Processing",
    fee: "$5.00",
    arrival: "Aug 22"
  },
  {
    created: "Aug 18, 2026 · 11:18 AM",
    amount: "28,000.00 USDC",
    asset: "USDC",
    destination: "0x71F2…8A4C",
    rail: "Base",
    status: "Completed",
    fee: "0.42 USDC",
    arrival: "Aug 18"
  },
  {
    created: "Aug 15, 2026 · 9:07 AM",
    amount: "12,500.00 USDC",
    asset: "Platform credits",
    destination: "Acru workspace",
    rail: "Internal",
    status: "Completed",
    fee: "—",
    arrival: "Instant"
  },
  {
    created: "Aug 11, 2026 · 4:24 PM",
    amount: "$65,000.00",
    asset: "USD",
    destination: "Wells Fargo •••• 4242",
    rail: "ACH",
    status: "Completed",
    fee: "$5.00",
    arrival: "Aug 13"
  },
  {
    created: "Aug 7, 2026 · 1:52 PM",
    amount: "46,200.00 USDC",
    asset: "USDC",
    destination: "0x71F2…8A4C",
    rail: "Base",
    status: "Completed",
    fee: "0.51 USDC",
    arrival: "Aug 7"
  }
];

export const initialExports: Array<{
  name: string;
  data: string;
  format: ExportFormat;
  range: string;
  owner: string;
  created: string;
  status: Status;
}> = [
  {
    name: "July account activity",
    data: "Balance transactions",
    format: "CSV",
    range: "Jul 1–31, 2026",
    owner: "Nik Vorobyev",
    created: "Aug 1, 2026",
    status: "Available" as Status
  },
  {
    name: "Q2 finance package",
    data: "Statements",
    format: "PDF",
    range: "Apr 1–Jun 30, 2026",
    owner: "Nik Vorobyev",
    created: "Jul 3, 2026",
    status: "Available" as Status
  },
  {
    name: "USDC settlement ledger",
    data: "Crypto settlements",
    format: "CSV",
    range: "Jun 1–30, 2026",
    owner: "Maya Chen",
    created: "Jul 1, 2026",
    status: "Available" as Status
  },
  {
    name: "Platform credit usage",
    data: "Platform credits",
    format: "JSON",
    range: "Jun 1–30, 2026",
    owner: "Maya Chen",
    created: "Jul 1, 2026",
    status: "Available" as Status
  },
  {
    name: "Annual transaction archive",
    data: "Payments",
    format: "ZIP",
    range: "Jan 1–Dec 31, 2025",
    owner: "Nik Vorobyev",
    created: "Jan 4, 2026",
    status: "Available" as Status
  }
];

export const reportSnapshotAdapter = createFixtureListAdapter({
  filter: () => true,
  latency: 80,
  seed: [{ id: "merchant-reports" }]
});
