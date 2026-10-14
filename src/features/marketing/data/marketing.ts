export type MarketingLink = {
  href: string;
  label: string;
};

export type MarketingFooterColumn = {
  heading: string;
  links: MarketingLink[];
};

export const marketingNavigation: MarketingLink[] = [
  { href: "/#platform", label: "Platform" },
  { href: "/#money-movement", label: "Money movement" },
  { href: "/developers/documentation", label: "Developers" },
  { href: "/#security", label: "Security" }
];

export const platformCapabilities = [
  {
    bullets: ["Cards, ACH, Apple Pay, and digital dollars", "Hosted checkout or a fully custom payment flow"],
    description:
      "Give customers the way they want to pay while Acru keeps the payment intent, authentication, and settlement path connected.",
    eyebrow: "Accept",
    title: "Convert more demand into settled revenue.",
    visual: "accept"
  },
  {
    bullets: ["Adaptive authentication and 3DS controls", "Dispute evidence and refund operations in one place"],
    description:
      "Use payment context to add protection where it matters without turning every legitimate purchase into a challenge.",
    eyebrow: "Protect",
    title: "Control risk without slowing good customers.",
    visual: "protect"
  },
  {
    bullets: ["Bank and USDC settlement destinations", "Programmable schedules, reserves, and payout rules"],
    description:
      "Route funds to the right destination on the right schedule, with every fee, reserve, and transfer visible before arrival.",
    eyebrow: "Settle",
    title: "Move funds across bank and stablecoin rails.",
    visual: "settle"
  },
  {
    bullets: [
      "A ledger-backed record for every payment state",
      "Live reporting, exports, and signed lifecycle webhooks"
    ],
    description:
      "Give finance and operations one dependable record from authorization through payout, without stitching together separate tools.",
    eyebrow: "Operate",
    title: "Reconcile the entire payment lifecycle.",
    visual: "operate"
  }
] as const;

export const platformRails = [
  {
    alt: "Visa",
    src: "/payment-rails/visa.svg"
  },
  {
    alt: "Mastercard",
    src: "/payment-rails/mastercard.svg"
  },
  {
    alt: "Apple Pay",
    src: "/payment-rails/apple-pay.svg"
  },
  {
    alt: "ACH",
    src: "/payment-rails/ach.svg"
  },
  {
    alt: "USDC",
    src: "/usdc.svg"
  }
] as const;

export const paymentLifecycle = [
  {
    detail: "Create an intent once, then present the right payment methods for the customer and transaction.",
    title: "Initiate"
  },
  { detail: "Apply authentication, fraud signals, and business rules before funds are captured.", title: "Authorize" },
  {
    detail: "Route proceeds to bank or digital-dollar destinations with reserve and schedule controls.",
    title: "Settle"
  },
  {
    detail: "Match payments, fees, refunds, disputes, and payouts against one ledger-backed record.",
    title: "Reconcile"
  }
] as const;

export const controlFeatures = [
  {
    description: "Assign view, create, approve, export, and administrative access by workspace area.",
    title: "Granular permissions"
  },
  {
    description: "Require a second reviewer before sensitive changes or high-value money movement.",
    title: "Approval workflows"
  },
  {
    description: "Protect every team account with mandatory multi-factor authentication and secure recovery.",
    title: "Mandatory MFA"
  },
  {
    description: "Keep an attributable history of configuration changes and financial actions.",
    title: "Complete activity history"
  }
] as const;

export const footerColumns: MarketingFooterColumn[] = [
  {
    heading: "Products",
    links: [
      { href: "/#platform", label: "Payments" },
      { href: "/#platform", label: "Checkout" },
      { href: "/#money-movement", label: "Payouts" },
      { href: "/#platform", label: "Risk and disputes" }
    ]
  },
  {
    heading: "Platform",
    links: [
      { href: "/developers/documentation", label: "Developers" },
      { href: "/#security", label: "Security" },
      { href: "/#money-movement", label: "Stablecoin rails" },
      { href: "/#platform", label: "Merchant operations" }
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
      { href: "/legal", label: "Legal center" },
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "mailto:legal@acru.com?subject=Privacy%20request", label: "Privacy requests" }
    ]
  }
];
