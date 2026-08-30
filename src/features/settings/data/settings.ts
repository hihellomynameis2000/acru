import {
  CreditCardIcon as CreditCard,
  AlertTriangleIcon as AlertTriangle,
  BankIcon as Landmark,
  DesktopIcon as Laptop2,
  UnknownDeviceIcon as MonitorSmartphone,
  ReceiptIcon as ReceiptText,
  ShieldCheckMarkIcon as ShieldCheck,
  MobileIcon as Smartphone,
  ConnectIcon as Webhook
} from "@shopify/polaris-icons";

import { createFixtureListAdapter } from "@/components/data/adapter";

export const teamMembers = [
  {
    id: 1,
    name: "Christian Brown",
    email: "christian@northstar.studio",
    initials: "CB",
    role: "Owner",
    scope: "Full access",
    active: "Now",
    twoFactor: true,
    tone: "blue"
  },
  {
    id: 2,
    name: "Maya Patel",
    email: "maya@northstar.studio",
    initials: "MP",
    role: "Administrator",
    scope: "Full access",
    active: "18 min ago",
    twoFactor: true,
    tone: "purple"
  },
  {
    id: 3,
    name: "Jordan Lee",
    email: "jordan@northstar.studio",
    initials: "JL",
    role: "Finance",
    scope: "Payouts & reports",
    active: "2 hours ago",
    twoFactor: true,
    tone: "green"
  },
  {
    id: 4,
    name: "Noah Williams",
    email: "noah@northstar.studio",
    initials: "NW",
    role: "Developer",
    scope: "API & integrations",
    active: "Yesterday",
    twoFactor: false,
    tone: "orange"
  },
  {
    id: 5,
    name: "Ava Rodriguez",
    email: "ava@northstar.studio",
    initials: "AR",
    role: "Support",
    scope: "Payments & customers",
    active: "Yesterday",
    twoFactor: true,
    tone: "pink"
  },
  {
    id: 6,
    name: "Theo Martin",
    email: "theo@northstar.studio",
    initials: "TM",
    role: "Analyst",
    scope: "View only",
    active: "Aug 24",
    twoFactor: true,
    tone: "slate"
  },
  {
    id: 7,
    name: "Sofia Chen",
    email: "sofia@northstar.studio",
    initials: "SC",
    role: "Developer",
    scope: "API & integrations",
    active: "Aug 21",
    twoFactor: false,
    tone: "teal"
  }
];

export const roleCards = [
  { title: "Administrator", detail: "Everything except ownership transfer and account closure.", count: 1 },
  { title: "Finance", detail: "Balances, payouts, reports, disputes, and exports.", count: 1 },
  { title: "Developer", detail: "API keys, webhooks, logs, and integration settings.", count: 2 },
  { title: "Support", detail: "Customers, payments, refunds, and disputes.", count: 1 }
];

export type TeamInviteRole = "Administrator" | "Finance" | "Developer" | "Support" | "Analyst";
export type TeamAccessLevel = "none" | "view" | "operate" | "manage";

export type TeamPermissionPage = {
  id: string;
  label: string;
  route: string;
  description: string;
  sensitive?: boolean;
  capabilities: readonly [string, string, string];
};

export type TeamPermissionGroup = {
  id: string;
  title: string;
  description: string;
  pages: readonly TeamPermissionPage[];
};

export const teamInviteRoles: readonly TeamInviteRole[] = [
  "Administrator",
  "Finance",
  "Developer",
  "Support",
  "Analyst"
];

export const teamPermissionGroups: readonly TeamPermissionGroup[] = [
  {
    id: "workspace",
    title: "Workspace",
    description: "Core visibility into business performance and available funds.",
    pages: [
      {
        id: "overview",
        label: "Overview",
        route: "/dashboard",
        description: "Business summary, alerts, and recent activity.",
        capabilities: ["View dashboard metrics", "Save dashboard filters", "Export overview data"]
      },
      {
        id: "balances",
        label: "Balances",
        route: "/balances",
        description: "Available, pending, reserve, and wallet balances.",
        sensitive: true,
        capabilities: ["View account balances", "Download balance activity", "Manage wallet transfers"]
      }
    ]
  },
  {
    id: "payments",
    title: "Payments & customers",
    description: "Operational access to transactions, billing, and customer records.",
    pages: [
      {
        id: "transactions",
        label: "Transactions",
        route: "/payments/transactions",
        description: "Payments, captures, card metadata, and transaction timelines.",
        sensitive: true,
        capabilities: ["View payment details", "Capture or cancel payments", "Export transaction data"]
      },
      {
        id: "customers",
        label: "Customers",
        route: "/payments/customers",
        description: "Customer profiles, payment methods, and account history.",
        sensitive: true,
        capabilities: ["View customer profiles", "Edit customer records", "Export or delete customer data"]
      },
      {
        id: "products",
        label: "Products",
        route: "/payments/products",
        description: "Product catalog, pricing, and availability.",
        capabilities: ["View the product catalog", "Create or edit products", "Archive products and prices"]
      },
      {
        id: "subscriptions",
        label: "Subscriptions",
        route: "/payments/subscriptions",
        description: "Recurring billing plans and subscriber lifecycle.",
        capabilities: ["View subscriptions", "Create, pause, or resume plans", "Cancel plans and configure billing"]
      },
      {
        id: "checkout",
        label: "Checkout",
        route: "/payments/checkout",
        description: "Hosted checkout sessions and payment configuration.",
        capabilities: ["View checkout sessions", "Create or expire sessions", "Manage checkout configuration"]
      },
      {
        id: "refunds",
        label: "Refunds",
        route: "/payments/refunds",
        description: "Refund requests, approvals, and customer reimbursement.",
        sensitive: true,
        capabilities: ["View refund history", "Issue partial or full refunds", "Approve refunds and manage policy"]
      },
      {
        id: "payment-links",
        label: "Payment links",
        route: "/payments/payment-links",
        description: "Shareable payment pages and link performance.",
        capabilities: ["View payment links", "Create or edit links", "Deactivate links and export results"]
      },
      {
        id: "invoices",
        label: "Invoices",
        route: "/payments/invoices",
        description: "Invoice creation, delivery, and settlement status.",
        capabilities: ["View invoices", "Create and send invoices", "Void, mark paid, or configure invoicing"]
      },
      {
        id: "payouts",
        label: "Payouts",
        route: "/payments/payouts",
        description: "Settlement accounts, payout requests, and schedules.",
        sensitive: true,
        capabilities: ["View payout activity", "Request manual payouts", "Manage bank accounts and schedules"]
      },
      {
        id: "disputes",
        label: "Disputes",
        route: "/payments/disputes",
        description: "Chargebacks, evidence, deadlines, and outcomes.",
        sensitive: true,
        capabilities: ["View disputes", "Submit dispute evidence", "Accept disputes and manage workflows"]
      }
    ]
  },
  {
    id: "reporting",
    title: "Reports & financial data",
    description: "Analytics, acceptance, statements, wallets, and data exports.",
    pages: [
      {
        id: "analytics",
        label: "Analytics",
        route: "/reports/analytics",
        description: "Payment, customer, and revenue performance.",
        capabilities: ["View analytics", "Save report filters", "Export analytics data"]
      },
      {
        id: "acceptance",
        label: "Acceptance reporting",
        route: "/reports/acceptance",
        description: "Approval rates, declines, and payment rail performance.",
        capabilities: ["View acceptance reports", "Create report comparisons", "Export and schedule reports"]
      },
      {
        id: "statements",
        label: "Statements",
        route: "/reports/statements",
        description: "Monthly statements, fees, reserves, and adjustments.",
        sensitive: true,
        capabilities: ["View statements", "Download statements", "Generate statements and manage recipients"]
      },
      {
        id: "wallet",
        label: "Wallet",
        route: "/reports/wallet",
        description: "Wallet holdings, movements, addresses, and network activity.",
        sensitive: true,
        capabilities: ["View wallet activity", "Download wallet records", "Manage wallet destinations"]
      },
      {
        id: "exports",
        label: "Exports",
        route: "/reports/exports",
        description: "One-time and scheduled workspace data exports.",
        sensitive: true,
        capabilities: ["View export history", "Create and download exports", "Manage scheduled exports"]
      }
    ]
  },
  {
    id: "developers",
    title: "Developer platform",
    description: "Live API credentials, webhooks, logs, and integration controls.",
    pages: [
      {
        id: "developer-tools",
        label: "Developers & API",
        route: "/developers",
        description: "API keys, webhooks, events, and integration logs.",
        sensitive: true,
        capabilities: [
          "View API logs and key names",
          "Edit webhooks and test credentials",
          "Reveal or rotate live credentials"
        ]
      }
    ]
  },
  {
    id: "settings",
    title: "Workspace settings",
    description: "Business configuration, team access, security, and notifications.",
    pages: [
      {
        id: "business-settings",
        label: "Business",
        route: "/settings/business",
        description: "Legal, operating, and customer-facing business details.",
        sensitive: true,
        capabilities: ["View business details", "Edit unprotected details", "Manage verified business information"]
      },
      {
        id: "team-settings",
        label: "Team",
        route: "/settings/team",
        description: "Members, roles, invitations, and access reviews.",
        sensitive: true,
        capabilities: [
          "View members and roles",
          "Invite members and change roles",
          "Remove members and manage access policy"
        ]
      },
      {
        id: "banking-settings",
        label: "Banking & payouts",
        route: "/settings/banking-payouts",
        description: "Settlement accounts, payout schedule, and reserves.",
        sensitive: true,
        capabilities: ["View settlement details", "Change payout schedule", "Add or remove bank accounts"]
      },
      {
        id: "branding-settings",
        label: "Branding",
        route: "/settings/branding",
        description: "Logos, colors, receipts, and checkout appearance.",
        capabilities: ["View brand settings", "Edit brand assets", "Publish customer-facing branding"]
      },
      {
        id: "security-settings",
        label: "Security",
        route: "/settings/security",
        description: "Authentication, sessions, devices, and recovery controls.",
        sensitive: true,
        capabilities: [
          "View security activity",
          "Revoke sessions and devices",
          "Manage authentication and recovery policy"
        ]
      },
      {
        id: "notification-settings",
        label: "Notifications",
        route: "/settings/notifications",
        description: "Personal and workspace alert delivery rules.",
        capabilities: ["View notification settings", "Edit personal alerts", "Manage workspace-wide notifications"]
      }
    ]
  }
];

type TeamRolePreset = Record<Exclude<TeamAccessLevel, "none">, readonly string[]>;

const teamRolePresets: Record<TeamInviteRole, TeamRolePreset> = {
  Administrator: { view: [], operate: [], manage: ["*"] },
  Finance: {
    view: ["overview", "customers", "products", "subscriptions", "checkout", "business-settings"],
    operate: ["transactions", "refunds", "disputes"],
    manage: ["balances", "payouts", "analytics", "acceptance", "statements", "wallet", "exports", "banking-settings"]
  },
  Developer: {
    view: ["overview", "transactions", "customers", "products", "subscriptions", "analytics", "security-settings"],
    operate: ["checkout", "payment-links", "invoices"],
    manage: ["developer-tools"]
  },
  Support: {
    view: ["overview", "products", "subscriptions", "checkout", "payment-links", "invoices", "analytics", "acceptance"],
    operate: ["transactions", "customers", "refunds", "disputes"],
    manage: []
  },
  Analyst: {
    view: [
      "overview",
      "balances",
      "transactions",
      "customers",
      "products",
      "subscriptions",
      "checkout",
      "refunds",
      "payment-links",
      "invoices",
      "payouts",
      "disputes",
      "analytics",
      "acceptance",
      "statements",
      "wallet",
      "exports"
    ],
    operate: [],
    manage: []
  }
};

export function createTeamPermissionPreset(role: TeamInviteRole): Record<string, TeamAccessLevel> {
  const preset = teamRolePresets[role];
  return Object.fromEntries(
    teamPermissionGroups.flatMap((group) =>
      group.pages.map((page) => {
        if (preset.manage.includes("*") || preset.manage.includes(page.id)) return [page.id, "manage"];
        if (preset.operate.includes(page.id)) return [page.id, "operate"];
        if (preset.view.includes(page.id)) return [page.id, "view"];
        return [page.id, "none"];
      })
    )
  );
}

export function capabilitiesForTeamAccess(page: TeamPermissionPage, level: TeamAccessLevel): readonly string[] {
  if (level === "none") return [];
  if (level === "view") return page.capabilities.slice(0, 1);
  if (level === "operate") return page.capabilities.slice(0, 2);
  return page.capabilities;
}

export function summarizeTeamAccess(permissions: Record<string, TeamAccessLevel>) {
  const levels = Object.values(permissions);
  return {
    enabledPages: levels.filter((level) => level !== "none").length,
    managedPages: levels.filter((level) => level === "manage").length,
    operatedPages: levels.filter((level) => level === "operate").length
  };
}

export const initialDevices = [
  {
    id: 1,
    name: "MacBook Pro",
    browser: "Chrome 127 · macOS",
    location: "New York, United States",
    activity: "Current session",
    current: true,
    icon: Laptop2
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    browser: "ACRU app · iOS 19",
    location: "New York, United States",
    activity: "12 minutes ago",
    current: false,
    icon: Smartphone
  },
  {
    id: 3,
    name: "Office workstation",
    browser: "Edge 126 · Windows",
    location: "Brooklyn, United States",
    activity: "August 25 at 4:42 PM",
    current: false,
    icon: MonitorSmartphone
  }
];

export const notificationRows = [
  {
    id: "payments",
    title: "Payment activity",
    detail: "Successful payments, refunds, and unusual volume changes.",
    icon: CreditCard
  },
  {
    id: "payouts",
    title: "Payouts & balance",
    detail: "Payout status, bank changes, and low available balance.",
    icon: Landmark
  },
  {
    id: "disputes",
    title: "Disputes & risk",
    detail: "New disputes, evidence deadlines, and risk alerts.",
    icon: AlertTriangle
  },
  {
    id: "security",
    title: "Security",
    detail: "New sign-ins, account changes, and authentication events.",
    icon: ShieldCheck
  },
  {
    id: "developers",
    title: "Developer events",
    detail: "Webhook failures, API errors, and key changes.",
    icon: Webhook
  },
  {
    id: "reports",
    title: "Reports & summaries",
    detail: "Performance summaries and scheduled report delivery.",
    icon: ReceiptText
  }
];

export type Channel = "email" | "inApp" | "sms";
export type NotificationPreferences = Record<string, Record<Channel, boolean>>;

export const initialNotificationPreferences: NotificationPreferences = {
  payments: { email: true, inApp: true, sms: false },
  payouts: { email: true, inApp: true, sms: true },
  disputes: { email: true, inApp: true, sms: true },
  security: { email: true, inApp: true, sms: true },
  developers: { email: true, inApp: true, sms: false },
  reports: { email: true, inApp: false, sms: false }
};

export const settingsSnapshotAdapter = createFixtureListAdapter({
  filter: () => true,
  latency: 80,
  seed: [{ id: "merchant-settings" }]
});
