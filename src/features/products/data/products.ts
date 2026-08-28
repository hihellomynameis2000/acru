import { createFixtureListAdapter } from "@/components/data/adapter";

export type ProductStatus = "Active" | "Draft" | "Archived";
export type BillingType = "One time" | "Monthly" | "Annual";

export type Product = {
  id: string;
  name: string;
  description: string;
  priceMinor: number;
  status: ProductStatus;
  billing: BillingType;
  inventory: number | null;
  sold: number;
  revenueMinor: number;
  updated: string;
  sku: string;
  category: string;
  taxCode: string;
  color: string;
  images?: string[];
};

const productSeed: Product[] = [
  {
    id: "prod_8Qm4aL2xN7",
    name: "Pro plan",
    description: "Advanced commerce, payments, and reporting for growing teams.",
    priceMinor: 14900,
    status: "Active",
    billing: "Monthly",
    inventory: null,
    sold: 387,
    revenueMinor: 5766300,
    updated: "Aug 11, 2026",
    sku: "ACRU-PRO-M",
    category: "Software",
    taxCode: "SaaS — General",
    color: "blue"
  },
  {
    id: "prod_3Kt7vB9cR1",
    name: "Enterprise plan",
    description: "Custom controls, security, and support for large organizations.",
    priceMinor: 249900,
    status: "Active",
    billing: "Annual",
    inventory: null,
    sold: 42,
    revenueMinor: 10495800,
    updated: "Aug 10, 2026",
    sku: "ACRU-ENT-A",
    category: "Software",
    taxCode: "SaaS — General",
    color: "violet"
  },
  {
    id: "prod_6Hs1eP5wD8",
    name: "Implementation package",
    description: "White-glove onboarding, data migration, and configuration.",
    priceMinor: 475000,
    status: "Active",
    billing: "One time",
    inventory: 18,
    sold: 31,
    revenueMinor: 14725000,
    updated: "Aug 9, 2026",
    sku: "SERV-IMPL",
    category: "Services",
    taxCode: "Professional services",
    color: "cyan"
  },
  {
    id: "prod_1Vj8yC4qM0",
    name: "Additional workspace seat",
    description: "One additional team member seat billed monthly.",
    priceMinor: 2900,
    status: "Active",
    billing: "Monthly",
    inventory: null,
    sold: 642,
    revenueMinor: 1861800,
    updated: "Aug 8, 2026",
    sku: "ACRU-SEAT-M",
    category: "Software",
    taxCode: "SaaS — General",
    color: "green"
  },
  {
    id: "prod_9Rc2fA7zK5",
    name: "Priority support",
    description: "24/7 priority response with a dedicated support channel.",
    priceMinor: 49900,
    status: "Draft",
    billing: "Monthly",
    inventory: null,
    sold: 0,
    revenueMinor: 0,
    updated: "Aug 7, 2026",
    sku: "SUP-PRIO-M",
    category: "Services",
    taxCode: "Support services",
    color: "orange"
  },
  {
    id: "prod_4Nx6sW3bT9",
    name: "Security audit",
    description: "Comprehensive application and payment security assessment.",
    priceMinor: 800000,
    status: "Active",
    billing: "One time",
    inventory: 4,
    sold: 12,
    revenueMinor: 9600000,
    updated: "Aug 5, 2026",
    sku: "SERV-AUDIT",
    category: "Services",
    taxCode: "Professional services",
    color: "red"
  },
  {
    id: "prod_7Bg0kE8hF2",
    name: "Legacy starter plan",
    description: "Original entry-level plan retained for existing customers.",
    priceMinor: 7900,
    status: "Archived",
    billing: "Monthly",
    inventory: null,
    sold: 286,
    revenueMinor: 2259400,
    updated: "Jul 28, 2026",
    sku: "ACRU-START-M",
    category: "Software",
    taxCode: "SaaS — General",
    color: "gray"
  }
];

export const productAdapter = createFixtureListAdapter<Product>({
  filter: () => true,
  latency: 80,
  seed: productSeed
});
