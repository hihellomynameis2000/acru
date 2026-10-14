export const checkoutIntro =
  "Add a hosted checkout, embed payment components, or build your own interface. Keep each payment connected to the order behind it.";

// TODO(product/content review): Confirm Studio controls, embedded integration,
// webhook coverage, test-state coverage and idempotency semantics before publishing.
// Component names, API paths and event names in the artwork are illustrative,
// not an integration contract. This is a local marketing-content preview only.
export const checkoutTabs = [
  {
    id: "design",
    label: "Design it",
    title: "Checkout should look\nlike you built it.",
    body: "Configure the customer-facing experience around your brand, payment methods, required information, and post-payment flow.",
    capabilities: [
      ["Brand controls", "Keep checkout consistent with the rest of your product."],
      ["Payment presentation", "Control which supported ways to pay appear."],
      ["Customer fields", "Collect the information your transaction requires."],
      ["Completion states", "Control what customers see after payment."]
    ],
    cta: "Explore Checkout Studio",
    href: "/#checkout-studio"
  },
  {
    id: "build",
    label: "Build it",
    title: "Start fast.\nGo as custom as you need.",
    body: "Use Acru’s hosted experience, embed payment components, or control the interface through APIs without rebuilding the payment lifecycle underneath.",
    capabilities: [
      ["APIs", "Create and control payment flows programmatically."],
      ["Webhooks", "React to payment, refund, dispute, and settlement events."],
      ["Test environment", "Build against simulated payment states before going live."],
      ["Idempotency", "Safely retry requests without accidentally creating duplicate payments."]
    ],
    cta: "Read the docs",
    href: "/developers/documentation"
  },
  {
    id: "understand",
    label: "Understand it",
    title: "Know where\nevery checkout ends.",
    body: "Follow the customer journey through payment selection, authentication, authorization, and completion—and investigate where transactions fail or customers drop.",
    capabilities: [],
    cta: "Explore reporting",
    href: "/features/reporting"
  }
] as const;

export const checkoutDeployment = [
  {
    label: "Hosted",
    title: "Launch without\nbuilding from scratch.",
    body: "Send customers to a secure Acru-hosted checkout configured around your business, payment methods, and brand.",
    cta: "Explore the fit",
    href: "/demo",
    sample: "checkout.acru…"
  },
  {
    label: "Embedded",
    title: "Keep payment\ninside your product.",
    body: "Bring checkout into your existing experience while Acru manages the payment flow behind it.",
    cta: "Explore embedded",
    href: "#checkout-layer",
    sample: "Your product + checkout"
  },
  {
    label: "API",
    title: "Own every pixel.",
    body: "Build the interface around your customer and use Acru APIs, payment states, and events underneath.",
    cta: "Explore the API",
    href: "/developers/documentation",
    sample: "Your interface. Acru events."
  }
] as const;

export const checkoutFeatures = [
  {
    id: "payment-methods",
    artwork: "methods",
    label: "Payment methods",
    title: "Let customers choose\nhow they pay.",
    body: "Offer cards, wallets, bank payments, and supported digital assets in the same checkout. Choose the methods available for your business and market, without sending customers through separate payment experiences.",
    cta: "Explore payment methods",
    href: "/payments/overview"
  },
  {
    id: "authentication",
    artwork: "authorization",
    label: "Authentication",
    title: "Handle authentication\ninside the payment flow.",
    body: "Keep supported 3D Secure checks within the payment journey, with a return path to checkout. Connect the authentication result to authorization so your team can distinguish a failed check from a declined payment.",
    cta: "Explore authorization",
    href: "/features/authorization"
  },
  {
    id: "payment-status",
    artwork: "intelligence",
    label: "Payment status",
    title: "Know when an order\nis ready to move.",
    body: "A customer returning to your site is not proof of payment. Use confirmed payment states to update orders, keep pending payments visible, and give support the transaction context behind each purchase.",
    cta: "Explore reporting",
    href: "/features/reporting"
  }
] as const;

export const checkoutFaqs = [
  [
    "Which Acru Checkout integration should I choose?",
    "Choose Hosted for a ready-made checkout, Embedded for payment components on your site, or API to build your own interface. Confirm supported methods and requirements before choosing."
  ],
  [
    "Which payment methods can I offer?",
    "Cards, wallets, bank payments, and supported digital assets. Available options depend on your business, market, currency, device, and approved integration."
  ],
  [
    "When should I mark an order as paid?",
    "Use a verified server-side payment result—not a browser redirect. Keep pending payments separate and fulfill only after confirmation."
  ],
  [
    "How do I avoid duplicate payments?",
    "Use your integration’s duplicate-request controls. After a timeout, check the original payment outcome before trying again."
  ],
  [
    "Does hosted checkout remove all PCI responsibilities?",
    "No. Hosted checkout can reduce direct card-data handling, but your business still has security and compliance responsibilities. Confirm the requirements for your integration."
  ],
  [
    "What should we test before going live?",
    "Test successful payments, declines, authentication, timeouts, duplicate submissions, and delayed outcomes. Check mobile flows and confirm customers can retry without losing their order."
  ]
].map(([question, answer], index) => ({ id: `checkout-story-${index}`, question, answer }));

// TODO(legal/content review): Retain qualified PCI wording and have the final
// integration-specific responsibilities reviewed. Do not promise universal scope reduction.
