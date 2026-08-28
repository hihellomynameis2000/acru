import { createFixtureListAdapter } from "@/components/data/adapter";

export type OperationKind = "refunds" | "payment-links" | "invoices";

export type OperationRecord = {
  id: string;
  created: string;
  time: string;
  amountMinor: number;
  status: string;
  title: string;
  subtitle: string;
  context: string;
  contextDetail: string;
  performance: string;
  performanceDetail: string;
};

type PageConfig = {
  kind: OperationKind;
  title: string;
  subtitle: string;
  createLabel: string;
  searchPlaceholder: string;
  statuses: string[];
  metrics: Array<{ label: string; value: string; detail: string }>;
  columns: [string, string, string, string, string, string, string, string];
  records: OperationRecord[];
};

const refundRecords: OperationRecord[] = [
  {
    id: "re_8Qm4aL2xN7",
    created: "Aug 11, 2026",
    time: "9:42 AM",
    amountMinor: 31200,
    status: "Succeeded",
    title: "Noah Williams",
    subtitle: "noah@foundry.team",
    context: "Requested by customer",
    contextDetail: "Pro plan renewal",
    performance: "Visa •••• 7210",
    performanceDetail: "Original payment $312.00"
  },
  {
    id: "re_3Kt7vB9cR1",
    created: "Aug 10, 2026",
    time: "4:18 PM",
    amountMinor: 9250,
    status: "Pending",
    title: "Liam Carter",
    subtitle: "liam@atlasdesign.co",
    context: "Duplicate charge",
    contextDetail: "Workspace seats",
    performance: "Visa •••• 9014",
    performanceDetail: "Expected Aug 15"
  },
  {
    id: "re_6Hs1eP5wD8",
    created: "Aug 10, 2026",
    time: "2:06 PM",
    amountMinor: 64000,
    status: "Succeeded",
    title: "Sofia Rodriguez",
    subtitle: "sofia@solstudio.mx",
    context: "Service canceled",
    contextDetail: "Design services",
    performance: "Mastercard •••• 4486",
    performanceDetail: "Full refund"
  },
  {
    id: "re_1Vj8yC4qM0",
    created: "Aug 9, 2026",
    time: "11:37 AM",
    amountMinor: 12500,
    status: "Succeeded",
    title: "Maya Chen",
    subtitle: "maya@riverlabs.io",
    context: "Product issue",
    contextDetail: "Invoice INV-1048",
    performance: "ACH •••• 4242",
    performanceDetail: "Partial refund"
  },
  {
    id: "re_9Rc2fA7zK5",
    created: "Aug 8, 2026",
    time: "5:22 PM",
    amountMinor: 7900,
    status: "Failed",
    title: "Lucas Bernard",
    subtitle: "lucas@atelier.fr",
    context: "Requested by customer",
    contextDetail: "Monthly subscription",
    performance: "Visa •••• 2941",
    performanceDetail: "Insufficient balance"
  },
  {
    id: "re_4Nx6sW3bT9",
    created: "Aug 7, 2026",
    time: "3:14 PM",
    amountMinor: 18999,
    status: "Canceled",
    title: "James Wilson",
    subtitle: "james@oakandco.com",
    context: "Fraudulent",
    contextDetail: "Commerce order #9281",
    performance: "Visa •••• 8264",
    performanceDetail: "Canceled before submission"
  },
  {
    id: "re_7Bg0kE8hF2",
    created: "Aug 6, 2026",
    time: "1:45 PM",
    amountMinor: 128000,
    status: "Succeeded",
    title: "Ava Patel",
    subtitle: "ava@kineticlabs.io",
    context: "Service canceled",
    contextDetail: "Implementation fee",
    performance: "Mastercard •••• 5021",
    performanceDetail: "Full refund"
  }
];

const paymentLinkRecords: OperationRecord[] = [
  {
    id: "plink_8Qm4aL2x",
    created: "Aug 11, 2026",
    time: "8:20 AM",
    amountMinor: 14900,
    status: "Active",
    title: "Pro plan",
    subtitle: "acru.co/pay/pro-plan",
    context: "387 completed",
    contextDetail: "542 checkout sessions",
    performance: "71.4% conversion",
    performanceDetail: "$57,663.00 revenue"
  },
  {
    id: "plink_3Kt7vB9c",
    created: "Aug 9, 2026",
    time: "2:14 PM",
    amountMinor: 249900,
    status: "Active",
    title: "Annual enterprise",
    subtitle: "acru.co/pay/enterprise",
    context: "42 completed",
    contextDetail: "58 checkout sessions",
    performance: "72.4% conversion",
    performanceDetail: "$104,958.00 revenue"
  },
  {
    id: "plink_6Hs1eP5w",
    created: "Aug 7, 2026",
    time: "4:36 PM",
    amountMinor: 50000,
    status: "Active",
    title: "Account deposit",
    subtitle: "acru.co/pay/deposit",
    context: "118 completed",
    contextDetail: "196 checkout sessions",
    performance: "60.2% conversion",
    performanceDetail: "$59,000.00 revenue"
  },
  {
    id: "plink_1Vj8yC4q",
    created: "Aug 4, 2026",
    time: "11:52 AM",
    amountMinor: 7900,
    status: "Inactive",
    title: "Legacy monthly plan",
    subtitle: "acru.co/pay/legacy-monthly",
    context: "286 completed",
    contextDetail: "501 checkout sessions",
    performance: "57.1% conversion",
    performanceDetail: "$22,594.00 revenue"
  },
  {
    id: "plink_9Rc2fA7z",
    created: "Jul 30, 2026",
    time: "9:41 AM",
    amountMinor: 120000,
    status: "Active",
    title: "Consulting package",
    subtitle: "acru.co/pay/consulting",
    context: "24 completed",
    contextDetail: "35 checkout sessions",
    performance: "68.6% conversion",
    performanceDetail: "$28,800.00 revenue"
  },
  {
    id: "plink_4Nx6sW3b",
    created: "Jul 22, 2026",
    time: "3:07 PM",
    amountMinor: 3500,
    status: "Expired",
    title: "Launch promotion",
    subtitle: "acru.co/pay/launch",
    context: "194 completed",
    contextDetail: "420 checkout sessions",
    performance: "46.2% conversion",
    performanceDetail: "$6,790.00 revenue"
  }
];

const invoiceRecords: OperationRecord[] = [
  {
    id: "in_1049",
    created: "Aug 11, 2026",
    time: "9:10 AM",
    amountMinor: 1245000,
    status: "Open",
    title: "Northwind Labs",
    subtitle: "billing@northwind.co",
    context: "Due Aug 25, 2026",
    contextDetail: "Net 14",
    performance: "INV-1049",
    performanceDetail: "Sent today"
  },
  {
    id: "in_1048",
    created: "Aug 10, 2026",
    time: "3:46 PM",
    amountMinor: 124500,
    status: "Paid",
    title: "River Labs",
    subtitle: "maya@riverlabs.io",
    context: "Paid Aug 10, 2026",
    contextDetail: "Visa •••• 6251",
    performance: "INV-1048",
    performanceDetail: "Paid in 2 hours"
  },
  {
    id: "in_1047",
    created: "Aug 9, 2026",
    time: "11:22 AM",
    amountMinor: 92000,
    status: "Past due",
    title: "Nomad Works",
    subtitle: "finance@nomadworks.co",
    context: "Due Aug 9, 2026",
    contextDetail: "2 days overdue",
    performance: "INV-1047",
    performanceDetail: "Reminder sent"
  },
  {
    id: "in_1046",
    created: "Aug 8, 2026",
    time: "1:05 PM",
    amountMinor: 475000,
    status: "Open",
    title: "Cedar Works",
    subtitle: "emma@cedarworks.ca",
    context: "Due Aug 22, 2026",
    contextDetail: "Net 14",
    performance: "INV-1046",
    performanceDetail: "Viewed Aug 9"
  },
  {
    id: "in_1045",
    created: "Aug 7, 2026",
    time: "9:18 AM",
    amountMinor: 280000,
    status: "Draft",
    title: "Atlas Design",
    subtitle: "liam@atlasdesign.co",
    context: "No due date",
    contextDetail: "Not yet sent",
    performance: "INV-1045",
    performanceDetail: "Draft"
  },
  {
    id: "in_1044",
    created: "Aug 5, 2026",
    time: "4:31 PM",
    amountMinor: 64000,
    status: "Void",
    title: "Sol Studio",
    subtitle: "sofia@solstudio.mx",
    context: "Voided Aug 6",
    contextDetail: "Replaced by INV-1043",
    performance: "INV-1044",
    performanceDetail: "Void"
  },
  {
    id: "in_1043",
    created: "Aug 4, 2026",
    time: "10:52 AM",
    amountMinor: 832000,
    status: "Paid",
    title: "Northwind Labs",
    subtitle: "billing@northwind.co",
    context: "Paid Aug 5, 2026",
    contextDetail: "USDC on Base",
    performance: "INV-1043",
    performanceDetail: "Paid in 1 day"
  }
];

const internalConfigs: Record<OperationKind, PageConfig> = {
  refunds: {
    kind: "refunds",
    title: "Refunds",
    subtitle: "Track and issue customer refunds across every payment method.",
    createLabel: "Create refund",
    searchPlaceholder: "Search refunds",
    statuses: ["All", "Succeeded", "Pending", "Failed", "Canceled"],
    metrics: [
      { label: "Refunded this month", value: "$14,842.19", detail: "52 successful refunds" },
      { label: "Pending", value: "$2,517.73", detail: "4 refunds processing" },
      { label: "Failed", value: "$158.00", detail: "2 require attention" },
      { label: "Average processing", value: "2.4 days", detail: "Across cards and banks" }
    ],
    columns: ["Created", "Amount", "Status", "Customer", "Reason", "Payment method", "Refund type", "Refund ID"],
    records: refundRecords
  },
  "payment-links": {
    kind: "payment-links",
    title: "Payment links",
    subtitle: "Create reusable checkout links and monitor conversion performance.",
    createLabel: "Create payment link",
    searchPlaceholder: "Search payment links",
    statuses: ["All", "Active", "Inactive", "Expired"],
    metrics: [
      { label: "Active links", value: "18", detail: "4 created this month" },
      { label: "Revenue", value: "$279,805.00", detail: "Last 30 days" },
      { label: "Completed payments", value: "1,051", detail: "Across all active links" },
      { label: "Conversion rate", value: "64.2%", detail: "↑ 5.8% from prior period" }
    ],
    columns: ["Created", "Price", "Status", "Payment link", "Completed", "Performance", "Checkout", "Link ID"],
    records: paymentLinkRecords
  },
  invoices: {
    kind: "invoices",
    title: "Invoices",
    subtitle: "Create, send, collect, and reconcile customer invoices.",
    createLabel: "Create invoice",
    searchPlaceholder: "Search invoices",
    statuses: ["All", "Draft", "Open", "Past due", "Paid", "Void"],
    metrics: [
      { label: "Outstanding", value: "$18,120.00", detail: "3 open invoices" },
      { label: "Past due", value: "$920.00", detail: "1 invoice requires attention" },
      { label: "Paid this month", value: "$48,214.40", detail: "28 invoices" },
      { label: "Average time to pay", value: "1.8 days", detail: "↓ 0.6 days" }
    ],
    columns: ["Created", "Amount", "Status", "Customer", "Due", "Invoice number", "Activity", "Invoice ID"],
    records: invoiceRecords
  }
};

export type OperationPageConfig = Omit<PageConfig, "records">;

export const operationConfigs = Object.fromEntries(
  Object.entries(internalConfigs).map(([kind, config]) => {
    const { records, ...pageConfig } = config;
    void records;
    return [kind, pageConfig];
  })
) as Record<OperationKind, OperationPageConfig>;

export const operationAdapters = {
  refunds: createFixtureListAdapter<OperationRecord>({ filter: () => true, latency: 80, seed: refundRecords }),
  "payment-links": createFixtureListAdapter<OperationRecord>({
    filter: () => true,
    latency: 80,
    seed: paymentLinkRecords
  }),
  invoices: createFixtureListAdapter<OperationRecord>({ filter: () => true, latency: 80, seed: invoiceRecords })
} satisfies Record<OperationKind, ReturnType<typeof createFixtureListAdapter<OperationRecord>>>;
