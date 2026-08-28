import { createFixtureListAdapter } from "@/components/data/adapter";

export type PayoutStatus = "Paid" | "In transit" | "Pending" | "Failed" | "Canceled";
export type PayoutType = "Automatic" | "Manual" | "Instant";

export type Payout = {
  id: string;
  created: string;
  time: string;
  arrival: string;
  amountMinor: number;
  status: PayoutStatus;
  type: PayoutType;
  destination: string;
  last4: string;
  feeMinor: number;
  transactions: number;
  trace: string;
};

const payoutSeed: Payout[] = [
  {
    id: "po_1Qs7aB8mX3",
    created: "Aug 10, 2026",
    time: "2:00 PM",
    arrival: "Aug 11",
    amountMinor: 9844312,
    status: "In transit",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 428,
    trace: "091000019841321"
  },
  {
    id: "po_8Kp2vN4cL9",
    created: "Aug 8, 2026",
    time: "2:00 PM",
    arrival: "Aug 10",
    amountMinor: 7420586,
    status: "Paid",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 316,
    trace: "091000019772108"
  },
  {
    id: "po_4Dr6wQ1hF7",
    created: "Aug 6, 2026",
    time: "2:00 PM",
    arrival: "Aug 8",
    amountMinor: 6189240,
    status: "Paid",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 281,
    trace: "091000019683754"
  },
  {
    id: "po_2Yt9eC5jR0",
    created: "Aug 4, 2026",
    time: "4:38 PM",
    arrival: "Aug 4",
    amountMinor: 1250000,
    status: "Paid",
    type: "Instant",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 18750,
    transactions: 64,
    trace: "091000019561882"
  },
  {
    id: "po_7Mz3sA6kD1",
    created: "Aug 3, 2026",
    time: "2:00 PM",
    arrival: "Aug 5",
    amountMinor: 8821755,
    status: "Paid",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 392,
    trace: "091000019492341"
  },
  {
    id: "po_5Hv8bP2nW4",
    created: "Aug 1, 2026",
    time: "2:00 PM",
    arrival: "Aug 3",
    amountMinor: 4692018,
    status: "Paid",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 205,
    trace: "091000019365027"
  },
  {
    id: "po_0La4xT7qE9",
    created: "Jul 30, 2026",
    time: "2:00 PM",
    arrival: "Aug 1",
    amountMinor: 5584173,
    status: "Paid",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 249,
    trace: "091000019238416"
  },
  {
    id: "po_9Fc1mJ3uG6",
    created: "Jul 28, 2026",
    time: "5:12 PM",
    arrival: "Jul 28",
    amountMinor: 800000,
    status: "Failed",
    type: "Instant",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 32,
    trace: "—"
  },
  {
    id: "po_3Bn7rV5dS2",
    created: "Jul 27, 2026",
    time: "2:00 PM",
    arrival: "Jul 29",
    amountMinor: 6973209,
    status: "Paid",
    type: "Automatic",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 301,
    trace: "091000019102887"
  },
  {
    id: "po_6Qw0zK8fH3",
    created: "Jul 25, 2026",
    time: "11:06 AM",
    arrival: "—",
    amountMinor: 420000,
    status: "Canceled",
    type: "Manual",
    destination: "Wells Fargo",
    last4: "4242",
    feeMinor: 0,
    transactions: 18,
    trace: "—"
  }
];

export const payoutAdapter = createFixtureListAdapter<Payout>({
  filter: () => true,
  latency: 80,
  seed: payoutSeed
});
