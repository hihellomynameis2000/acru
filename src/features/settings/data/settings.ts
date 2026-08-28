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
