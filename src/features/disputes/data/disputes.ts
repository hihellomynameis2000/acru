import { createFixtureListAdapter } from "@/components/data/adapter";

export type DisputeStatus = "Needs response" | "Under review" | "Won" | "Lost";
export type DisputeReason =
  "Fraudulent" | "Product not received" | "Duplicate" | "Subscription canceled" | "Unrecognized";
export type EvidenceState = "Ready" | "Needs evidence" | "AI gathering" | "Submitted";

export type Dispute = {
  id: string;
  paymentId: string;
  created: string;
  due: string;
  dueDays: number;
  amountMinor: number;
  feeMinor: number;
  status: DisputeStatus;
  reason: DisputeReason;
  evidence: EvidenceState;
  evidenceScore: number;
  customer: string;
  email: string;
  card: string;
  order: string;
  description: string;
  network: "Visa" | "Mastercard" | "Amex";
  aiEligible: boolean;
};

export type AutomationSettings = {
  enabled: boolean;
  approval: "Review before submit" | "Submit automatically";
  maxAmount: "$500" | "$2,500" | "No limit";
  minimumConfidence: "80%" | "90%" | "95%";
  feeAccepted: boolean;
};

const disputeSeed: Dispute[] = [
  {
    id: "dp_8Qm4aL2xN7",
    paymentId: "pi_3Qr9L2A7mK4x91",
    created: "Aug 10, 2026",
    due: "Aug 13, 2026",
    dueDays: 3,
    amountMinor: 294325,
    feeMinor: 1500,
    status: "Needs response",
    reason: "Fraudulent",
    evidence: "AI gathering",
    evidenceScore: 82,
    customer: "Nathan Bariac",
    email: "nathan.bariac@gmail.com",
    card: "3830",
    order: "ORD-9841",
    description: "Enterprise subscription",
    network: "Visa",
    aiEligible: true
  },
  {
    id: "dp_3Kt7vB9cR1",
    paymentId: "pi_8Ks2N6P1bC5v04",
    created: "Aug 9, 2026",
    due: "Aug 12, 2026",
    dueDays: 2,
    amountMinor: 832000,
    feeMinor: 1500,
    status: "Needs response",
    reason: "Product not received",
    evidence: "Needs evidence",
    evidenceScore: 58,
    customer: "Olivia Martin",
    email: "olivia@northwind.co",
    card: "1842",
    order: "ORD-9834",
    description: "Annual platform plan",
    network: "Mastercard",
    aiEligible: true
  },
  {
    id: "dp_6Hs1eP5wD8",
    paymentId: "pi_5Fn7D3Q9wZ2a68",
    created: "Aug 8, 2026",
    due: "Aug 15, 2026",
    dueDays: 5,
    amountMinor: 124500,
    feeMinor: 1500,
    status: "Needs response",
    reason: "Subscription canceled",
    evidence: "Ready",
    evidenceScore: 96,
    customer: "Maya Chen",
    email: "maya@riverlabs.io",
    card: "6251",
    order: "INV-1048",
    description: "Invoice INV-1048",
    network: "Visa",
    aiEligible: true
  },
  {
    id: "dp_1Vj8yC4qM0",
    paymentId: "pi_1Vb4H8M6sR0j37",
    created: "Aug 7, 2026",
    due: "Submitted",
    dueDays: 0,
    amountMinor: 9250,
    feeMinor: 1500,
    status: "Under review",
    reason: "Duplicate",
    evidence: "Submitted",
    evidenceScore: 100,
    customer: "Liam Carter",
    email: "liam@atlasdesign.co",
    card: "9014",
    order: "ORD-9812",
    description: "Workspace seats",
    network: "Visa",
    aiEligible: true
  },
  {
    id: "dp_9Rc2fA7zK5",
    paymentId: "pi_9Ty5C2E7nL3u82",
    created: "Aug 5, 2026",
    due: "Submitted",
    dueDays: 0,
    amountMinor: 64000,
    feeMinor: 1500,
    status: "Under review",
    reason: "Unrecognized",
    evidence: "Submitted",
    evidenceScore: 100,
    customer: "Sofia Rodriguez",
    email: "sofia@solstudio.mx",
    card: "4486",
    order: "ORD-9798",
    description: "Design services",
    network: "Amex",
    aiEligible: true
  },
  {
    id: "dp_4Nx6sW3bT9",
    paymentId: "pi_6Jp1W4B8qA7d59",
    created: "Jul 29, 2026",
    due: "Resolved Aug 6",
    dueDays: 0,
    amountMinor: 31200,
    feeMinor: 1500,
    status: "Won",
    reason: "Subscription canceled",
    evidence: "Submitted",
    evidenceScore: 100,
    customer: "Noah Williams",
    email: "noah@foundry.team",
    card: "7210",
    order: "ORD-9721",
    description: "Pro plan renewal",
    network: "Mastercard",
    aiEligible: true
  },
  {
    id: "dp_7Bg0kE8hF2",
    paymentId: "pi_7Gh3S9U1eV6m40",
    created: "Jul 24, 2026",
    due: "Resolved Aug 2",
    dueDays: 0,
    amountMinor: 18999,
    feeMinor: 1500,
    status: "Lost",
    reason: "Product not received",
    evidence: "Submitted",
    evidenceScore: 74,
    customer: "James Wilson",
    email: "james@oakandco.com",
    card: "8264",
    order: "ORD-9668",
    description: "Commerce order #9281",
    network: "Visa",
    aiEligible: false
  },
  {
    id: "dp_2Ld5uS1mQ6",
    paymentId: "pi_4Da6K0Y2hP8t73",
    created: "Jul 21, 2026",
    due: "Resolved Jul 31",
    dueDays: 0,
    amountMinor: 128000,
    feeMinor: 1500,
    status: "Won",
    reason: "Fraudulent",
    evidence: "Submitted",
    evidenceScore: 100,
    customer: "Ava Patel",
    email: "ava@kineticlabs.io",
    card: "5021",
    order: "ORD-9610",
    description: "Implementation fee",
    network: "Mastercard",
    aiEligible: true
  },
  {
    id: "dp_5Pa9dG3rX7",
    paymentId: "pi_0Mz7F1C5rQ3w86",
    created: "Jul 18, 2026",
    due: "Resolved Jul 28",
    dueDays: 0,
    amountMinor: 7900,
    feeMinor: 1500,
    status: "Won",
    reason: "Unrecognized",
    evidence: "Submitted",
    evidenceScore: 100,
    customer: "Lucas Bernard",
    email: "lucas@atelier.fr",
    card: "2941",
    order: "ORD-9574",
    description: "Monthly subscription",
    network: "Visa",
    aiEligible: true
  }
];

export const disputeAdapter = createFixtureListAdapter<Dispute>({
  filter: () => true,
  latency: 80,
  seed: disputeSeed
});
