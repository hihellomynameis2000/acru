import { createFixtureListAdapter } from "@/components/data/adapter";

export type TransactionStatus = "Succeeded" | "Processing" | "Failed" | "Refunded" | "Disputed";
export type PaymentMethod = "Visa" | "Mastercard" | "Amex" | "ACH" | "USDC";

export type Transaction = {
  id: string;
  createdAt: string;
  time: string;
  amountMinor: number;
  currency: "USD";
  status: TransactionStatus;
  customer: string;
  email: string;
  description: string;
  method: PaymentMethod;
  last4: string;
  feeMinor: number;
  risk: "Normal" | "Elevated" | "Low";
  country: string;
};

const seedTransactions: Transaction[] = [
  {
    id: "pi_3Qr9L2A7mK4x91",
    createdAt: "Aug 10, 2026",
    time: "4:32 PM",
    amountMinor: 294325,
    currency: "USD",
    status: "Succeeded",
    customer: "Nathan Bariac",
    email: "nathan.bariac@gmail.com",
    description: "Enterprise subscription",
    method: "Visa",
    last4: "3830",
    feeMinor: 8566,
    risk: "Low",
    country: "Canada"
  },
  {
    id: "pi_8Ks2N6P1bC5v04",
    createdAt: "Aug 10, 2026",
    time: "4:18 PM",
    amountMinor: 832000,
    currency: "USD",
    status: "Processing",
    customer: "Olivia Martin",
    email: "olivia@northwind.co",
    description: "Annual platform plan",
    method: "USDC",
    last4: "Base",
    feeMinor: 4160,
    risk: "Normal",
    country: "United States"
  },
  {
    id: "pi_5Fn7D3Q9wZ2a68",
    createdAt: "Aug 10, 2026",
    time: "3:51 PM",
    amountMinor: 124500,
    currency: "USD",
    status: "Succeeded",
    customer: "Maya Chen",
    email: "maya@riverlabs.io",
    description: "Invoice INV-1048",
    method: "ACH",
    last4: "4242",
    feeMinor: 500,
    risk: "Low",
    country: "United States"
  },
  {
    id: "pi_1Vb4H8M6sR0j37",
    createdAt: "Aug 10, 2026",
    time: "3:26 PM",
    amountMinor: 9250,
    currency: "USD",
    status: "Succeeded",
    customer: "Liam Carter",
    email: "liam@atlasdesign.co",
    description: "Workspace seats",
    method: "Visa",
    last4: "9014",
    feeMinor: 298,
    risk: "Normal",
    country: "United Kingdom"
  },
  {
    id: "pi_9Ty5C2E7nL3u82",
    createdAt: "Aug 10, 2026",
    time: "2:58 PM",
    amountMinor: 64000,
    currency: "USD",
    status: "Failed",
    customer: "Sofia Rodriguez",
    email: "sofia@solstudio.mx",
    description: "Design services",
    method: "Mastercard",
    last4: "4486",
    feeMinor: 0,
    risk: "Elevated",
    country: "Mexico"
  },
  {
    id: "pi_6Jp1W4B8qA7d59",
    createdAt: "Aug 10, 2026",
    time: "2:14 PM",
    amountMinor: 31200,
    currency: "USD",
    status: "Refunded",
    customer: "Noah Williams",
    email: "noah@foundry.team",
    description: "Pro plan renewal",
    method: "Amex",
    last4: "7210",
    feeMinor: 935,
    risk: "Normal",
    country: "United States"
  },
  {
    id: "pi_2Lc8R5X3fN9k16",
    createdAt: "Aug 10, 2026",
    time: "1:47 PM",
    amountMinor: 475000,
    currency: "USD",
    status: "Succeeded",
    customer: "Emma Thompson",
    email: "emma@cedarworks.ca",
    description: "Quarterly services",
    method: "ACH",
    last4: "1138",
    feeMinor: 500,
    risk: "Low",
    country: "Canada"
  },
  {
    id: "pi_7Gh3S9U1eV6m40",
    createdAt: "Aug 10, 2026",
    time: "12:39 PM",
    amountMinor: 18999,
    currency: "USD",
    status: "Disputed",
    customer: "James Wilson",
    email: "james@oakandco.com",
    description: "Commerce order #9281",
    method: "Visa",
    last4: "8264",
    feeMinor: 581,
    risk: "Elevated",
    country: "United States"
  },
  {
    id: "pi_4Da6K0Y2hP8t73",
    createdAt: "Aug 10, 2026",
    time: "11:55 AM",
    amountMinor: 128000,
    currency: "USD",
    status: "Succeeded",
    customer: "Ava Patel",
    email: "ava@kineticlabs.io",
    description: "Implementation fee",
    method: "Mastercard",
    last4: "5021",
    feeMinor: 3742,
    risk: "Normal",
    country: "United States"
  },
  {
    id: "pi_0Mz7F1C5rQ3w86",
    createdAt: "Aug 10, 2026",
    time: "10:24 AM",
    amountMinor: 7900,
    currency: "USD",
    status: "Succeeded",
    customer: "Lucas Bernard",
    email: "lucas@atelier.fr",
    description: "Monthly subscription",
    method: "Visa",
    last4: "2941",
    feeMinor: 259,
    risk: "Low",
    country: "France"
  },
  {
    id: "pi_3Bx9E6T4jH1s25",
    createdAt: "Aug 9, 2026",
    time: "8:42 PM",
    amountMinor: 92000,
    currency: "USD",
    status: "Succeeded",
    customer: "Charlotte Lee",
    email: "charlotte@nomadworks.co",
    description: "Invoice INV-1047",
    method: "USDC",
    last4: "Base",
    feeMinor: 460,
    risk: "Normal",
    country: "Singapore"
  },
  {
    id: "pi_8Np2A5L7cW0v64",
    createdAt: "Aug 9, 2026",
    time: "7:16 PM",
    amountMinor: 210000,
    currency: "USD",
    status: "Succeeded",
    customer: "Daniel Kim",
    email: "daniel@framehouse.kr",
    description: "Annual contract",
    method: "ACH",
    last4: "8752",
    feeMinor: 500,
    risk: "Low",
    country: "South Korea"
  }
];

export const transactionAdapter = createFixtureListAdapter<Transaction>({
  filter: () => true,
  latency: 80,
  seed: seedTransactions
});
