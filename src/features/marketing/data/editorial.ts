// Public marketing destinations stay separate from authenticated merchant routes.
export const editorialDestinations: Readonly<Record<string, string>> = {
  "/payments": "/payments/overview",
  "/payouts": "/payouts",
  "/features/card-processing": "/features/card-processing",
  "/features/checkout": "/features/checkout",
  "/features/bank-payments": "/features/bank-payments",
  "/features/digital-wallets": "/features/digital-wallets",
  "/features/alternative-payment-methods": "/features/alternative-payment-methods",
  "/features/subscriptions": "/features/subscriptions",
  "/features/real-time-payments": "/features/real-time-payments",
  "/features/push-to-card": "/features/push-to-card",
  "/features/instant-settlement": "/features/instant-settlement",
  "/features/digital-assets": "/features/digital-assets",
  "/platforms": "/platforms",
  "/features/reporting": "/features/reporting",
  "/features/authorization": "/features/authorization",
  "/features/chargeback-protection": "/features/chargeback-protection",
  "/security": "/security",
  "/industries/ecommerce": "/industries/ecommerce",
  "/industries/fintech": "/industries/fintech",
  "/industries/gaming": "/industries/gaming",
  "/industries/marketplaces": "/industries/marketplaces",
  "/industries/remittances": "/industries/remittances",
  "/industries/global-payroll": "/industries/global-payroll",
  "/resources": "/resources",
  "/articles": "/articles",
  "/faq": "/faq",
  "/help": "/help",
  "/pricing": "/pricing",
  "/company": "/company",
  "/contact": "/contact",
  "/demo": "/demo",
  "/platforms#onboarding": "/features/merchant-onboarding",
  "/features/split-payments": "/features/split-payments",
  "/developers": "/developers/documentation",
  "/risk": "/features/risk-management",
  "/partners": "/company/partners"
};
export function editorialHref(path: string) {
  const destination = editorialDestinations[path];
  if (!destination) throw new Error(`No public Acru destination configured for ${path}`);
  return destination;
}

export function homepageHref(href: string, onHomepage = true) {
  return !onHomepage && href.startsWith("#") ? `/${href}` : href;
}

export const landingGuides = [
  {
    slug: "designing-a-better-checkout",
    articleSlug: "building-a-better-payment-operation",
    category: "Payments",
    readTime: "4 min read",
    title: "The best checkout starts before the payment.",
    description: "How payment methods, customer context, and clear outcomes shape the last step of a purchase.",
    image: "/marketing/guides/clarity-v1/payments-blue.webp",
    alt: "A blue payment card passing through a glass gateway along a sculpted payment track"
  },
  {
    slug: "choosing-your-payout-rails",
    articleSlug: "choosing-a-payout-path",
    category: "Payouts",
    readTime: "4 min read",
    title: "The right payout is about more than speed.",
    description: "A practical way to think about delivery, destination, cost, and exception handling.",
    image: "/marketing/guides/clarity-v1/payouts-sand.webp",
    alt: "Sand-colored glass tiles moving along connected payout tracks toward a receiving tray"
  },
  {
    slug: "marketplace-money-movement",
    articleSlug: "marketplace-money-movement-model",
    category: "Platforms",
    readTime: "4 min read",
    title: "One sale. Several destinations. A clear record.",
    description: "Design buyer payments, platform fees, seller balances, and payouts as one connected flow.",
    image: "/marketing/guides/clarity-v1/platforms-lavender.webp",
    alt: "Lavender blocks connected by branching glass tracks that divide one payment among multiple destinations"
  }
] as const;

export const landingFaqs = [
  {
    id: "platform",
    question: "What does Acru bring together?",
    answer:
      "Acru connects payment acceptance, payouts, platform operations, and risk workflows. The right configuration depends on your business model, markets, methods, and how funds need to move."
  },
  {
    id: "methods",
    question: "Which payment methods can I offer?",
    answer:
      "Offer Apple Pay, Google Pay, PayPal, and Venmo; local and bank payments such as Pix, SEPA, and ACH; and buy now, pay later options including Klarna and Afterpay. Cards and crypto are also part of the payment mix. Your approved method mix is confirmed during onboarding and varies by market and use case."
  },
  {
    id: "settlement",
    question: "How do payouts and settlement work?",
    answer:
      "Payouts move available funds to an eligible recipient or destination. Settlement determines when and how processed funds become available to your business. Acru scopes both around your program, including timing, reserves, and eligible rails."
  },
  {
    id: "checkout",
    question: "Can I keep my own checkout and customer experience?",
    answer:
      "Yes. Choose a hosted experience, embedded components, or an API-led approach based on the control your product needs. The team will help map the integration and the payment states your application needs to handle."
  },
  {
    id: "marketplaces",
    question: "Is Acru built for marketplaces and platforms?",
    answer:
      "Acru’s platform workflows connect merchant onboarding, buyer payments, allocation of proceeds, and seller payouts. Your team gets merchant-level context across transaction activity, balances, and risk."
  },
  {
    id: "payment-states",
    question: "Does an approved payment mean the money is available?",
    answer:
      "Not yet. Authorization approves a payment, capture submits it for collection, and settlement determines when the proceeds become available under your agreement. Your available balance may also reflect fees, refunds, disputes, or reserves."
  },
  {
    id: "duplicate-payment",
    question: "What if checkout times out after the customer pays?",
    answer:
      "Check the original payment’s verified outcome before requesting another payment. A browser timeout does not prove a charge failed. Keep the order reference and payment state connected so your team can resolve the attempt without charging twice."
  },
  {
    id: "refund-dispute",
    question: "What’s the difference between a refund and a dispute?",
    answer:
      "A refund returns funds through the merchant’s payment process. A dispute is raised through the customer’s bank or payment provider. If a dispute is already open, check its state before issuing a refund to avoid reimbursing the same payment twice."
  },
  {
    id: "total-cost",
    question: "What should I look at besides the processing rate?",
    answer:
      "Compare the full cost of your payment mix: method and network charges, cross-border and conversion costs, refunds, disputes, payouts, and any minimum or platform fees. Review settlement schedules and reserve terms separately because they affect cash availability."
  },
  {
    id: "migration",
    question: "Can I bring saved payment details from another provider?",
    answer:
      "Possibly, but portability must be confirmed with the current and receiving providers. Review token compatibility, consent, and secure transfer requirements before setting a migration date. Do not export raw card details through ordinary files or email."
  },
  {
    id: "production-scope",
    question: "How do I know which capabilities will be available at launch?",
    answer:
      "Confirm a written implementation scope that names your approved methods, markets, currencies, integrations, and funding terms. It should distinguish available capabilities from planned work and identify the tests and approvals needed before production."
  },
  {
    id: "start",
    question: "How do I get started?",
    answer:
      "Start with a conversation about your business, expected volume, markets, and current payment flow. Acru will identify the relevant program requirements, commercial structure, and integration path."
  }
] as const;

const homepageFaqIds = new Set(["platform", "methods", "settlement", "checkout", "start"]);

export const homepageFaqs = landingFaqs.filter((faq) => homepageFaqIds.has(faq.id));

export const footerDirectory = [
  {
    title: "Accept payments",
    links: [
      ["Payments overview", "/payments"],
      ["Card processing", "/features/card-processing"],
      ["Checkout", "/features/checkout"],
      ["Bank payments", "/features/bank-payments"],
      ["Digital wallets", "/features/digital-wallets"],
      ["Alternative payment methods", "/features/alternative-payment-methods"],
      ["Subscriptions", "/features/subscriptions"]
    ]
  },
  {
    title: "Move money",
    links: [
      ["Payouts overview", "/payouts"],
      ["Real-time payments", "/features/real-time-payments"],
      ["Push to card", "/features/push-to-card"],
      ["Settlement", "/features/instant-settlement"],
      ["Digital assets", "/features/digital-assets"]
    ]
  },
  {
    title: "Platforms & operations",
    links: [
      ["Platforms", "/platforms"],
      ["Merchant onboarding", "/platforms#onboarding"],
      ["Split payments", "/features/split-payments"],
      ["Reporting & reconciliation", "/features/reporting"],
      ["Developer platform", "/developers"]
    ]
  },
  {
    title: "Risk & intelligence",
    links: [
      ["Risk overview", "/risk"],
      ["Authorization", "/features/authorization"],
      ["Chargeback protection", "/features/chargeback-protection"],
      ["Security", "/security"]
    ]
  },
  {
    title: "Solutions",
    links: [
      ["Ecommerce", "/industries/ecommerce"],
      ["Fintech", "/industries/fintech"],
      ["Gaming", "/industries/gaming"],
      ["Marketplaces", "/industries/marketplaces"],
      ["Remittances", "/industries/remittances"],
      ["Global payroll", "/industries/global-payroll"]
    ]
  },
  {
    title: "Explore Acru",
    links: [
      ["Guides & insights", "/resources"],
      ["Articles", "/articles"],
      ["FAQs", "/faq"],
      ["Help center", "/help"],
      ["Pricing", "/pricing"],
      ["About Acru", "/company"],
      ["Partners", "/partners"],
      ["Contact", "/contact"]
    ]
  }
] as const;
