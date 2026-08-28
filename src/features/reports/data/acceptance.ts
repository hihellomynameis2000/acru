import { createFixtureListAdapter } from "@/components/data/adapter";

export type Period = "7D" | "30D" | "3M" | "1Y" | "Custom";
export type AcceptanceScope = "Total" | "Pre-auth" | "Post-auth";
export type Measure = "Count" | "Volume";
export type AcceptanceSeriesKey = "acceptance" | "chargeback" | "bank" | "threeDs";

export const acceptanceSeriesOptions: Array<{
  key: AcceptanceSeriesKey;
  label: string;
  color: string;
  className: string;
}> = [
  { key: "acceptance", label: "Acceptance rate", color: "#4aa6da", className: "total" },
  {
    key: "chargeback",
    label: "Chargeback protection approval",
    color: "#ef747a",
    className: "chargeback"
  },
  { key: "bank", label: "Bank authorization approval", color: "#72caa3", className: "bank" },
  { key: "threeDs", label: "3DS approval", color: "#e0ae55", className: "three-ds" }
];

export const acceptanceSeries: Record<Period, number[]> = {
  "7D": [98.1, 98.4, 98.3, 98.8, 98.6, 98.9, 98.7],
  "30D": [97.9, 98.2, 98.1, 98.5, 98.4, 98.8, 98.6, 98.7, 98.9, 98.8, 99.0, 98.7],
  "3M": [97.2, 97.5, 97.9, 98.0, 97.8, 98.2, 98.4, 98.3, 98.6, 98.5, 98.8, 98.7],
  "1Y": [96.4, 96.8, 97.1, 97.4, 97.3, 97.7, 98.0, 97.9, 98.2, 98.4, 98.5, 98.7],
  Custom: [97.7, 97.9, 98.3, 98.1, 98.4, 98.6, 98.5, 98.8, 98.7, 98.9, 99.0, 98.7]
};

export const declineRows = [
  {
    code: "51",
    title: "Insufficient funds",
    category: "Issuer decline",
    stage: "Post-auth",
    occurrences: 120,
    volume: "$38,940.22",
    share: "42.0%",
    trend: -3,
    action: "Offer a retry after 24 hours or another payment method."
  },
  {
    code: "05",
    title: "Do not honor",
    category: "Issuer decline",
    stage: "Post-auth",
    occurrences: 89,
    volume: "$27,118.54",
    share: "31.1%",
    trend: 1,
    action: "Ask the customer to contact their issuer or use another card."
  },
  {
    code: "3DS-01",
    title: "Authentication required",
    category: "3DS",
    stage: "Pre-auth",
    occurrences: 49,
    volume: "$16,204.70",
    share: "17.1%",
    trend: -2,
    action: "Request step-up authentication before resubmitting."
  },
  {
    code: "14",
    title: "Invalid card number",
    category: "Customer input",
    stage: "Pre-auth",
    occurrences: 17,
    volume: "$4,806.19",
    share: "5.9%",
    trend: 0,
    action: "Validate card length and checksum before authorization."
  },
  {
    code: "N7",
    title: "CVV mismatch",
    category: "Customer input",
    stage: "Pre-auth",
    occurrences: 11,
    volume: "$2,941.62",
    share: "3.9%",
    trend: -1,
    action: "Prompt the customer to re-enter the security code."
  },
  {
    code: "65",
    title: "Activity limit exceeded",
    category: "Issuer decline",
    stage: "Post-auth",
    occurrences: 9,
    volume: "$2,184.30",
    share: "3.1%",
    trend: 2,
    action: "Delay the retry and avoid repeated authorization attempts."
  },
  {
    code: "RISK-12",
    title: "Fraud rule blocked",
    category: "Risk control",
    stage: "Pre-auth",
    occurrences: 8,
    volume: "$1,998.00",
    share: "2.8%",
    trend: -1,
    action: "Review the triggered risk rule and customer context."
  }
] as const;

export const railRows = [
  {
    rail: "Apple Pay",
    logo: "/payment-rails/apple-pay.svg",
    logoClass: "apple-pay",
    attempts: "4,802",
    approved: "4,768",
    rate: "99.3%",
    change: "+0.4 pts"
  },
  {
    rail: "USDC",
    logo: "/payment-rails/usdc-white.svg",
    logoClass: "usdc",
    attempts: "1,246",
    approved: "1,243",
    rate: "99.8%",
    change: "+0.1 pts"
  },
  {
    rail: "Visa",
    logo: "/payment-rails/visa.svg",
    logoClass: "visa",
    attempts: "11,418",
    approved: "11,293",
    rate: "98.9%",
    change: "+0.8 pts"
  },
  {
    rail: "Mastercard",
    logo: "/payment-rails/mastercard.svg",
    logoClass: "mastercard",
    attempts: "6,104",
    approved: "5,994",
    rate: "98.2%",
    change: "+0.3 pts"
  },
  {
    rail: "ACH",
    logo: "/payment-rails/ach.svg",
    logoClass: "ach",
    attempts: "1,250",
    approved: "1,220",
    rate: "97.6%",
    change: "−0.2 pts"
  }
];

export type DeclineRow = (typeof declineRows)[number];

export const acceptanceSnapshotAdapter = createFixtureListAdapter({
  filter: () => true,
  latency: 80,
  seed: [{ id: "acceptance-report" }]
});
