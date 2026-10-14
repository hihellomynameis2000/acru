export type ArticleImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ArticleCallout = {
  label: string;
  title: string;
  body: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  intro?: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  image?: ArticleImage;
  callout?: ArticleCallout;
  quote?: string;
};

export type Article = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
  publishedLabel: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    initials: string;
    portrait?: string;
  };
  hero: ArticleImage;
  sections: readonly ArticleSection[];
};

export const articles: readonly Article[] = [
  {
    slug: "building-a-better-payment-operation",
    category: "Payment operations",
    title: "A clear payment operation starts with the right questions.",
    summary:
      "A practical framework for connecting checkout, transaction states, reconciliation, and customer support before complexity sets in.",
    publishedAt: "2026-10-04",
    publishedLabel: "October 4, 2026",
    readTime: "8 min read",
    author: {
      name: "Clara Bennett",
      role: "Contributing Writer @ Acru",
      initials: "CB",
      portrait: "/marketing/authors/clara-bennett.webp"
    },
    hero: {
      src: "/marketing/payments-overview/intelligence.webp",
      alt: "Acru transaction intelligence cards showing payment status and operational context",
      caption: "Good payment operations connect the decision, the movement, and the record."
    },
    sections: [
      {
        id: "start-with-the-outcome",
        title: "Start with the outcome, not the rail",
        intro:
          "Payment teams often begin with a list of methods. Stronger systems begin with the outcome a customer and an operator need to understand.",
        paragraphs: [
          "Map the complete moment: what the customer sees, what the payment system decides, what your order system records, and what the operations team can verify later. A fast authorization is useful, but it is not the same thing as a completed order or available funds.",
          "This distinction becomes more important as you add wallets, bank payments, alternative methods, and markets. Each rail may move differently, while your customer still expects one clear answer."
        ],
        callout: {
          label: "Working principle",
          title: "One customer action should create one traceable record.",
          body: "Keep the order reference, payment attempt, final status, and any follow-on refund or dispute connected from the beginning."
        }
      },
      {
        id: "design-the-states",
        title: "Design the states your teams will actually use",
        paragraphs: [
          "A payment model should be precise enough for engineering and plain enough for support. Define the difference between initiated, action required, authorized, captured, failed, reversed, refunded, disputed, and settled in terms everyone can act on.",
          "Then decide who owns each transition. Some states are driven by a customer, some by a network, and some by your own system. Clear ownership prevents a temporary delay from becoming a duplicate charge or an unnecessary escalation."
        ],
        bullets: [
          "Give each attempt an idempotent reference before sending it to a provider.",
          "Treat browser redirects and timeouts as incomplete information, not proof of failure.",
          "Verify asynchronous outcomes before retrying or asking the customer to pay again.",
          "Store the reason and next action alongside the status shown to an operator."
        ],
        image: {
          src: "/marketing/payments-overview/authorization.webp",
          alt: "A payment moving through identity, device, risk, authentication, and authorization checks",
          caption: "The useful record is not only the decision. It is the path that produced it."
        }
      },
      {
        id: "close-the-loop",
        title: "Close the loop with reconciliation",
        paragraphs: [
          "A dashboard can look complete while the books still require manual detective work. Reconciliation works best when the payment, fees, refunds, disputes, reserves, and settlement entries share durable references.",
          "Build the exception path at the same time as the happy path. Your team should be able to identify what did not match, why it did not match, and who needs to act without exporting sensitive data into a spreadsheet."
        ],
        quote: "The best operational view answers two questions at once: what happened, and what should happen next?"
      },
      {
        id: "make-support-part-of-the-system",
        title: "Make support part of the system",
        paragraphs: [
          "Customers rarely describe a payment problem with a processor status. They say they were charged twice, their order is missing, or their refund has not arrived. Give support a safe view that translates system state into that real-world concern.",
          "That view should reveal enough context to resolve the issue while protecting credentials and sensitive payment data. Permission boundaries, audit history, and explicit actions matter just as much as search."
        ],
        callout: {
          label: "Operator checklist",
          title: "Search, explain, act, confirm.",
          body: "Let an operator find the record, understand the verified state, take a permitted action, and see whether that action succeeded."
        }
      },
      {
        id: "build-for-the-next-change",
        title: "Build for the next change",
        paragraphs: [
          "Your payment mix will change. New methods, markets, rules, and customer expectations will arrive. A connected model lets you add those capabilities without inventing a separate operational language each time.",
          "The goal is not more payment infrastructure. It is a payment operation that stays understandable as the business grows. Start with the records and decisions your teams need, then choose the technology that keeps them connected."
        ]
      }
    ]
  },
  {
    slug: "choosing-a-payout-path",
    category: "Money movement",
    title: "Choose a payout path your operation can explain.",
    summary:
      "Speed matters, but destination eligibility, funding, exceptions, and reconciliation determine whether a payout experience really works.",
    publishedAt: "2026-09-18",
    publishedLabel: "September 18, 2026",
    readTime: "6 min read",
    author: {
      name: "Clara Bennett",
      role: "Contributing Writer @ Acru",
      initials: "CB",
      portrait: "/marketing/authors/clara-bennett.webp"
    },
    hero: {
      src: "/marketing/guides/clarity-v1/payouts-sand.webp",
      alt: "Connected payout tracks leading funds toward a receiving destination",
      caption: "A payout promise is only as strong as the path behind it."
    },
    sections: [
      {
        id: "define-the-promise",
        title: "Define the promise before the speed",
        paragraphs: [
          "Instant, same day, and standard are only useful when every team agrees on when the clock starts and what can interrupt it. Document funding cutoffs, recipient eligibility, review windows, and the final state you will show the recipient.",
          "A clear promise accounts for weekends, currencies, destination rules, and the difference between a payout being submitted and the funds being available."
        ]
      },
      {
        id: "validate-the-destination",
        title: "Validate the destination early",
        paragraphs: [
          "Collect only the information a supported destination requires, and validate it before the recipient is counting on a delivery date. A correct account format does not guarantee that a specific rail, currency, or recipient is eligible.",
          "Keep validation outcomes explicit so an operator can tell the difference between missing information, an unsupported destination, and a temporary network issue."
        ],
        bullets: [
          "Confirm recipient, country, currency, and rail compatibility.",
          "Separate editable profile data from verified payout instructions.",
          "Require deliberate confirmation when a destination changes.",
          "Record who changed a destination and when it became active."
        ]
      },
      {
        id: "prepare-for-exceptions",
        title: "Prepare for the payout that does not arrive",
        paragraphs: [
          "Exceptions need a stable reference, a human explanation, and an owner. Design retry rules carefully: an unclear response should trigger verification, not an automatic duplicate instruction.",
          "Give operations a queue for returned, rejected, delayed, or review-required payouts. The next action should be visible without exposing full destination credentials."
        ],
        callout: {
          label: "Before retrying",
          title: "Verify the original instruction’s final state.",
          body: "A timeout tells you that the response was interrupted. It does not tell you that the payout failed."
        }
      },
      {
        id: "reconcile-the-result",
        title: "Reconcile the result",
        paragraphs: [
          "Connect the payout to the source balance, fees, delivery record, and any return. This creates an audit trail that finance can close and support can explain.",
          "The right payout path is the one your recipients can trust and your team can operate after the happy-path demo is over."
        ]
      }
    ]
  },
  {
    slug: "marketplace-money-movement-model",
    category: "Platforms",
    title: "Model marketplace money movement before you build it.",
    summary:
      "Define participants, balances, fees, reversals, and responsibilities as one system before connecting the first seller.",
    publishedAt: "2026-08-27",
    publishedLabel: "August 27, 2026",
    readTime: "7 min read",
    author: {
      name: "Clara Bennett",
      role: "Contributing Writer @ Acru",
      initials: "CB",
      portrait: "/marketing/authors/clara-bennett.webp"
    },
    hero: {
      src: "/marketing/guides/clarity-v1/platforms-lavender.webp",
      alt: "Connected platform tracks splitting one payment across several destinations",
      caption: "One sale can create several obligations. Model them together."
    },
    sections: [
      {
        id: "name-the-participants",
        title: "Name every participant and responsibility",
        paragraphs: [
          "Start with the buyer, seller, platform, payment provider, and payout destination. For each one, document who provides the product, who accepts the payment, who handles support, and who bears each type of risk.",
          "This is more than a diagram. The responsibilities shape onboarding, transaction records, reporting, disputes, and the agreements your program needs."
        ]
      },
      {
        id: "separate-money-from-accounting",
        title: "Separate money movement from accounting",
        paragraphs: [
          "A balance is an accounting record, not necessarily a bank account or a pool of funds that can move immediately. Define when proceeds become available, which adjustments can affect them, and what a seller is allowed to withdraw.",
          "Keep platform fees, seller proceeds, refunds, disputes, reserves, and payout activity linked to the original sale without collapsing them into a single number."
        ],
        quote: "A useful balance explains what is available, what is pending, and what changed."
      },
      {
        id: "design-reversals-first",
        title: "Design reversals before launch",
        paragraphs: [
          "Refunds and disputes test the model because the original proceeds may already have been allocated or paid out. Decide how each adjustment affects the platform and seller, and what happens when the available balance is not enough.",
          "Make those rules visible in the ledger and in the operator experience. Manual corrections should remain exceptional, permissioned, and auditable."
        ],
        callout: {
          label: "Model test",
          title: "Can you explain a partial refund after payout?",
          body: "If the answer requires changing the original sale record, the model probably needs a clearer adjustment layer."
        }
      },
      {
        id: "connect-the-lifecycle",
        title: "Connect the merchant lifecycle",
        paragraphs: [
          "Onboarding, capability changes, payment acceptance, balances, and payouts should share the same merchant identity. That lets the platform respond when a review changes what a seller can do.",
          "A connected lifecycle gives product teams room to improve the customer experience without leaving operations to assemble the truth across separate systems."
        ]
      }
    ]
  }
] as const;

export const articlePaths = ["/articles", ...articles.map((article) => `/articles/${article.slug}`)] as const;

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
