export type MarketingLink = {
  href: string;
  label: string;
};

export type MarketingFooterColumn = {
  heading: string;
  links: MarketingLink[];
};

export const marketingNavigation: MarketingLink[] = [
  { href: "/#products", label: "Products" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#developers", label: "Developers" },
  { href: "/#pricing", label: "Pricing" }
];

export const platformCapabilities = [
  {
    description:
      "Accept payments worldwide with intelligent routing, instant checkout, split payments, subscriptions, and fast settlements.",
    title: "Payments",
    visual: "payments"
  },
  {
    description:
      "Every detail is optimized for speed and trust, helping businesses increase conversion while giving customers a smooth purchasing experience.",
    title: "Checkout",
    visual: "checkout"
  },
  {
    description:
      "Adaptive authentication and customer intelligence help stop fraud before money moves without adding unnecessary friction.",
    title: "Risk",
    visual: "risk"
  },
  {
    description:
      "Balances, reserves, and settlement controls keep every transfer visible from authorization through arrival.",
    title: "Money movement",
    visual: "payouts"
  },
  {
    description:
      "Live performance, reconciliation, and exports give finance and operations teams one dependable source of truth.",
    title: "Reporting",
    visual: "reporting"
  }
] as const;

export const operatingPrinciples = [
  { label: "Financial precision", value: "Ledger-first" },
  { label: "Access controls", value: "Role-based" },
  { label: "Operational visibility", value: "Real-time" }
];

export const footerColumns: MarketingFooterColumn[] = [
  {
    heading: "Products",
    links: [
      { href: "/#products", label: "Payments" },
      { href: "/#products", label: "Billing" },
      { href: "/#products", label: "Payouts" },
      { href: "/#solutions", label: "Reporting" }
    ]
  },
  {
    heading: "Platform",
    links: [
      { href: "/#developers", label: "Developers" },
      { href: "/#security", label: "Security" },
      { href: "/#solutions", label: "Partners" },
      { href: "/#pricing", label: "Pricing" }
    ]
  },
  {
    heading: "Company",
    links: [
      { href: "/#about", label: "About" },
      { href: "mailto:sales@acru.com", label: "Contact" },
      { href: "mailto:careers@acru.com", label: "Careers" },
      { href: "mailto:press@acru.com", label: "Press" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/acceptable-use", label: "Acceptable use" },
      { href: "/legal/cookies", label: "Cookie policy" },
      { href: "/legal/accessibility", label: "Accessibility" }
    ]
  }
];
