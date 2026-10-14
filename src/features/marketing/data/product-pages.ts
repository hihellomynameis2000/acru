export type ProductPage = {
  title: string;
  headline: string;
  intro: string;
  section: string;
  summary: string;
  features: [string, string][];
  closing: string;
  note: string;
  theme: "accept" | "move" | "protect" | "platform" | "card-gradient";
};

function page(
  title: string,
  headline: string,
  intro: string,
  section: string,
  summary: string,
  features: [string, string][],
  closing: string,
  note: string,
  theme: ProductPage["theme"] = "accept"
): ProductPage {
  return { title, headline, intro, section, summary, features, closing, note, theme };
}

export const productPages: Record<string, ProductPage> = {
  "/features/card-processing": page(
    "Card processing",
    "Enterprise card processing.\nConnected payment infrastructure.",
    "Bring authorization, authentication, capture, and payment performance into one flow.",
    "Your card volume shouldn’t\ndisappear into a black box.",
    "See the decisions and context behind every card payment.",
    [
      [
        "Every basis point\nhas a reason.",
        "See where payments succeed, where they fail, and what happens between intent and authorization."
      ],
      [
        "See the decision.\nControl what follows.",
        "Keep authorization connected to authentication, customer context, capture, and the events that follow."
      ],
      [
        "Challenge the transaction.\nNot every customer.",
        "Apply supported 3D Secure flows where needed. Keep the outcome attached to the payment."
      ]
    ],
    "Authorization is a decision.\nCapture is a strategy.",
    "Separate authorization from capture when your approved payment flow calls for it.",
    "card-gradient"
  ),
  "/features/checkout": page(
    "Checkout",
    "Checkouts built around\nhow you sell.",
    "A familiar payment experience. Your brand. Your choice of integration.",
    "One checkout layer.\nThree ways to deploy.",
    "Hosted, embedded, or custom. Choose how much you want to build.",
    [
      [
        "Launch without\nbuilding from scratch.",
        "Send customers to an Acru-hosted payment experience with a clear path to completion."
      ],
      [
        "Keep the payment\ninside your product.",
        "Bring supported payment components into your site. Keep control of the experience around them."
      ],
      [
        "Own every pixel.",
        "Design your interface around your customer. Connect the payment states and events underneath."
      ]
    ],
    "Make the last step\nfeel like your product.",
    "Choose an integration with the right balance of control and build effort."
  ),
  "/features/bank-payments": page(
    "Bank payments",
    "From bank account\nto better checkout.",
    "Add bank payments alongside cards. Keep the activity in one place.",
    "Different rails.\nOne clear record.",
    "Match the bank payment method to the market and the moment.",
    [
      ["Give customers\nanother way to pay.", "Offer supported ACH and SEPA flows for eligible customers and markets."],
      ["Pending isn’t paid.", "Follow processing, completion, and returns before deciding what happens next."],
      [
        "Close the loop.",
        "Connect payment references to balances and reporting so your team can reconcile with context."
      ]
    ],
    "Build bank payments\ninto the flow.",
    "Timing, returns, and eligibility vary by rail and approved configuration."
  ),
  "/features/digital-wallets": page(
    "Digital wallets",
    "Familiar wallets.\nFewer checkout steps.",
    "Meet customers with the ways they already pay.",
    "Less to enter.\nMore continuity.",
    "Bring wallet payments into your existing customer journey.",
    [
      ["Start with familiar.", "Offer Apple Pay and Google Pay in supported checkout experiences."],
      [
        "Make room for choice.",
        "Connect eligible PayPal and Venmo payment options without fragmenting your payment view."
      ],
      ["Keep the context.", "Follow wallet transactions through the same payment, refund, and reporting workflows."]
    ],
    "Let familiarity\ndo the work.",
    "Wallet availability depends on device, market, and your approved setup."
  ),
  "/features/alternative-payment-methods": page(
    "Alternative payment methods",
    "Local habits.\nGlobal ambition.",
    "Go beyond cards with wallets, local payments, and buy now, pay later.",
    "The right method.\nFor the right market.",
    "Build your payment mix around how your customers buy.",
    [
      ["Pay the local way.", "Scope Pix, SEPA, and other supported methods around the markets you serve."],
      [
        "Give timing a choice.",
        "Include eligible Klarna and Afterpay options where buy now, pay later fits the purchase."
      ],
      ["One view of the outcome.", "Keep method-specific payment states connected to your orders and reporting."]
    ],
    "More ways to pay.\nLess to stitch together.",
    "Methods, currencies, and eligibility are confirmed during onboarding."
  ),
  "/features/subscriptions": page(
    "Subscriptions",
    "Keep the relationship\ngoing.",
    "Connect recurring charges, customer records, and payment status.",
    "A repeat payment.\nNot a disconnected event.",
    "Keep each billing cycle attached to the customer it belongs to.",
    [
      ["Set the cadence.", "Map billing intervals and payment consent to your subscription model."],
      [
        "Know what needs attention.",
        "Spot unsuccessful charges and follow the recovery steps supported by your program."
      ],
      [
        "Stay connected after billing.",
        "Bring refunds, cancellations, and payment history into the customer conversation."
      ]
    ],
    "Build for the\nnext billing cycle.",
    "Recurring methods and recovery options depend on your integration."
  ),
  "/payouts": page(
    "Payouts overview",
    "Money earned.\nMoney on its way.",
    "Connect available balances to eligible recipients and payout destinations.",
    "A payout is more\nthan a send button.",
    "Know who gets paid, how it travels, and where it stands.",
    [
      ["Choose the destination.", "Match supported bank, card, or digital-asset options to the recipient and market."],
      ["Send with context.", "Keep recipient verification, balance availability, and payout instructions connected."],
      ["Follow it through.", "Track payout states and exceptions so your team knows what needs attention."]
    ],
    "Move money.\nKeep the record.",
    "Delivery times, fees, and supported destinations vary by program.",
    "move"
  ),
  "/features/real-time-payments": page(
    "Real-time payments",
    "When timing matters,\nchoose the right rail.",
    "Scope faster bank transfers for eligible markets and recipients.",
    "Speed starts\nwith the setup.",
    "Bring eligibility, availability, and transfer status into the same flow.",
    [
      [
        "Check the route first.",
        "Confirm that the destination and payment type qualify for the supported real-time network."
      ],
      ["Make the status clear.", "Separate a submitted transfer from a confirmed outcome in your customer experience."],
      ["Plan for exceptions.", "Give operations a clear path when a transfer cannot complete as expected."]
    ],
    "Faster movement.\nClearer expectations.",
    "Real-time delivery depends on network availability, eligibility, and checks.",
    "move"
  ),
  "/features/push-to-card": page(
    "Push to card",
    "A familiar card.\nA payout destination.",
    "Send eligible payouts to supported debit cards.",
    "Meet recipients\nwhere they already are.",
    "Add card payouts to your approved money movement flow.",
    [
      ["Check eligibility.", "Confirm the card, recipient, and market support the payout before sending."],
      ["Keep funding connected.", "Tie each instruction to available funds and the recipient record."],
      ["Know the result.", "Bring completed, pending, and unsuccessful payouts into your operational view."]
    ],
    "Give payouts\nanother route.",
    "Availability and timing depend on the card issuer and program.",
    "move"
  ),
  "/features/instant-settlement": page(
    "Settlement",
    "Know what’s available.\nPlan what’s next.",
    "Follow processed payments into pending and available balances.",
    "Payment complete\nisn’t the whole story.",
    "Keep settlement timing visible alongside transaction activity.",
    [
      [
        "Separate the balances.",
        "See available funds, pending activity, and reserves without losing the transaction context."
      ],
      ["Understand the timing.", "Map your settlement schedule to the methods, markets, and terms of your program."],
      ["Reconcile with confidence.", "Connect settlement records to the payments and adjustments behind them."]
    ],
    "Make cash flow\nless of a guessing game.",
    "Settlement timing and reserves are established in your agreement; instant settlement is not universal.",
    "move"
  ),
  "/features/digital-assets": page(
    "Digital assets",
    "Crypto payments.\nConnected operations.",
    "Bring supported digital assets into your payment mix.",
    "More than\na wallet address.",
    "Keep asset, network, and payment status in context.",
    [
      ["Start with the wallet.", "Scope supported experiences with MetaMask, Coinbase Pay, and WalletConnect."],
      [
        "Choose the network carefully.",
        "Confirm supported assets and networks before presenting payment instructions."
      ],
      [
        "Follow the confirmation.",
        "Keep transaction references and confirmation states attached to the payment record."
      ]
    ],
    "Connect digital assets\nto the rest of your business.",
    "Asset, wallet, network, and settlement options depend on approval and market.",
    "move"
  ),
  "/platforms": page(
    "Platforms",
    "One platform.\nEvery side connected.",
    "Bring buyer payments, merchant records, fees, and payouts together.",
    "Your experience.\nA connected money layer.",
    "Build around the relationships that make your platform work.",
    [
      ["Onboard with context.", "Keep merchant information, verification requirements, and account status connected."],
      ["Follow the allocation.", "Connect each sale to platform fees and the parties entitled to its proceeds."],
      ["Pay out with visibility.", "Tie eligible seller payouts to available balances and transaction history."]
    ],
    "Build the platform.\nConnect the money.",
    "Funds flows and platform responsibilities are scoped during onboarding.",
    "platform"
  ),
  "/features/merchant-onboarding": page(
    "Merchant onboarding",
    "The right start\nfor every merchant.",
    "Connect business information, verification, and account readiness.",
    "Less handoff.\nMore clarity.",
    "Know what is complete and what still needs attention.",
    [
      ["Collect what matters.", "Structure information around the business, its owners, and its payment activity."],
      ["Keep requirements visible.", "Give your team a clear view of outstanding documents and verification steps."],
      ["Launch when ready.", "Align account capabilities with the approvals required for the payment program."]
    ],
    "Make onboarding\npart of the product.",
    "Requirements vary by business type, jurisdiction, and program.",
    "platform"
  ),
  "/features/split-payments": page(
    "Split payments",
    "One payment.\nThe right destinations.",
    "Connect buyer payments to seller proceeds and platform fees.",
    "Make every\nallocation traceable.",
    "Keep the original sale at the center of the money flow.",
    [
      ["Define the split.", "Map the parties, fee rules, and approved allocation structure before launch."],
      ["Keep adjustments connected.", "Account for refunds and reversals alongside the original allocation."],
      ["Follow the payout.", "Link each recipient’s available balance to its supported payout destination."]
    ],
    "Share the proceeds.\nKeep the context.",
    "Allocation models and funds handling depend on your approved platform program.",
    "platform"
  ),
  "/features/reporting": page(
    "Reporting & reconciliation",
    "Every movement.\nA clearer record.",
    "Connect payment activity, balances, and the exceptions that need attention.",
    "From transaction\nto explanation.",
    "Give finance and operations the same starting point.",
    [
      ["Find the payment.", "Review transaction references, methods, and outcomes in one view."],
      ["Explain the balance.", "Trace settlements and adjustments back to the activity behind them."],
      ["Act on the exception.", "Surface refunds, disputes, and unsuccessful payments for follow-up."]
    ],
    "Spend less time\nconnecting the dots.",
    "Reporting fields and data availability vary by integration.",
    "platform"
  ),
  "/features/risk-management": page(
    "Risk overview",
    "Protect the flow.\nNot just the payment.",
    "Connect identity, device, and transaction signals to the decisions you make.",
    "Risk with\ncustomer context.",
    "Keep review, authentication, and payment outcomes together.",
    [
      ["See the signals.", "Bring supported customer and device information into the transaction review."],
      ["Apply the right check.", "Use authentication and review steps appropriate to the payment and your program."],
      ["Learn from the outcome.", "Connect disputes and payment results to the original transaction context."]
    ],
    "Make informed decisions.\nKeep customers moving.",
    "Risk controls reduce exposure but cannot eliminate fraud or disputes.",
    "protect"
  ),
  "/features/authorization": page(
    "Authorization",
    "Know the decision.\nControl the next step.",
    "Connect authorization outcomes to authentication and capture.",
    "An approval\nis a starting point.",
    "Give your team the context behind the payment state.",
    [
      ["Read the response.", "Keep available issuer responses attached to the transaction."],
      [
        "Capture with intent.",
        "Separate authorization and capture where your payment method and configuration support it."
      ],
      [
        "Handle the other outcomes.",
        "Design clear paths for declines, expired authorizations, and additional authentication."
      ]
    ],
    "Turn payment states\ninto clear next steps.",
    "Authorization does not guarantee settlement; issuer and network rules apply.",
    "protect"
  ),
  "/features/chargeback-protection": page(
    "Chargeback protection",
    "Stay ahead\nof the dispute.",
    "Connect prevention, evidence, and case status to the original payment.",
    "Less searching.\nMore context.",
    "Give the team handling a dispute the payment story behind it.",
    [
      ["Keep the evidence close.", "Connect transaction records and supported authentication outcomes."],
      ["Know what’s due.", "Track open cases and the response steps required by your program."],
      [
        "Understand the coverage.",
        "Review eligible protection terms, exclusions, and responsibilities before you launch."
      ]
    ],
    "Protect revenue\nwith a clearer process.",
    "Protection is subject to eligibility and contractual terms, not a guarantee against every loss.",
    "protect"
  ),
  "/security": page(
    "Security",
    "Trust belongs\nin the architecture.",
    "Build payment operations around access controls and clear responsibilities.",
    "Protect the payment.\nProtect the operation.",
    "Security is part of the flow, not a separate conversation.",
    [
      ["Limit access.", "Align team permissions with the work each person needs to do."],
      [
        "Handle data deliberately.",
        "Choose an integration that limits unnecessary exposure to sensitive payment details."
      ],
      ["Review your requirements.", "Discuss security documentation and shared responsibilities with the Acru team."]
    ],
    "Start with\nthe right questions.",
    "Request current compliance documentation and integration-specific guidance.",
    "protect"
  ),
  "/industries/ecommerce": page(
    "Ecommerce",
    "Make the last step\na natural one.",
    "Connect familiar payment methods to the checkout you’ve built.",
    "A considered checkout.\nA connected operation.",
    "From purchase to refund, keep the customer’s payment in view.",
    [
      ["Offer familiar choices.", "Bring cards, wallets, and eligible local payment methods into the purchase flow."],
      ["Keep your brand close.", "Choose hosted, embedded, or custom checkout to match your store."],
      ["Stay useful after the sale.", "Connect transaction history, refunds, and disputes to customer support."]
    ],
    "Build for the purchase.\nStay for what follows.",
    "Method availability and program terms depend on your business and markets."
  ),
  "/industries/fintech": page(
    "Fintech",
    "Your product.\nConnected money movement.",
    "Make account funding and eligible withdrawals feel native.",
    "Build the experience.\nConnect the rails.",
    "Bring verification, payment states, and recipient context together.",
    [
      ["Fund with choice.", "Scope supported cards, bank payments, and digital assets around your use case."],
      ["Keep verification in flow.", "Connect account and transaction requirements to the customer journey."],
      ["Make withdrawals clear.", "Show the status of eligible payouts without losing the original account context."]
    ],
    "Make money movement\npart of your product.",
    "Use cases, licensing responsibilities, and supported rails require review.",
    "platform"
  ),
  "/industries/gaming": page(
    "Gaming",
    "Stay in the moment.\nKeep money moving.",
    "Connect familiar deposit options and eligible withdrawals.",
    "Built around\nthe player journey.",
    "Keep payment controls close to the player, market, and transaction.",
    [
      ["Start with the deposit.", "Offer approved methods that fit your players and supported markets."],
      ["Apply the right controls.", "Connect verification and transaction checks to your program requirements."],
      ["Make withdrawals visible.", "Track eligible funds and payout outcomes in one connected operation."]
    ],
    "A better payment flow\nfor the next session.",
    "Gaming programs are subject to jurisdiction, eligibility, and underwriting.",
    "platform"
  ),
  "/industries/marketplaces": page(
    "Marketplaces",
    "Good for buyers.\nBuilt for sellers.",
    "Connect buyer payments, seller records, fees, and payouts.",
    "One sale.\nSeveral connected outcomes.",
    "Keep every participant in the same payment story.",
    [
      ["Welcome the seller.", "Connect business verification and account readiness before accepting payments."],
      ["Keep fees transparent.", "Map approved allocations to the sale and the parties behind it."],
      ["Close with the payout.", "Follow seller balances to eligible destinations and track the result."]
    ],
    "Grow the marketplace.\nKeep the money connected.",
    "Funds flows and seller eligibility are established during program review.",
    "platform"
  ),
  "/industries/remittances": page(
    "Remittances",
    "From funding\nto destination.",
    "Connect the steps behind supported cross-border transfers.",
    "Every transfer\nneeds a clear path.",
    "Scope funding, recipient requirements, and delivery together.",
    [
      ["Start with the corridor.", "Confirm supported origins, destinations, and currencies for your program."],
      ["Connect the checks.", "Keep sender and recipient requirements attached to the transfer journey."],
      ["Make the outcome visible.", "Give operations context for delivery states and unsuccessful transfers."]
    ],
    "Make distance\nless complicated.",
    "Corridor coverage, fees, timing, and regulatory responsibilities require program approval.",
    "move"
  ),
  "/industries/global-payroll": page(
    "Global payroll",
    "Global teams.\nConnected payouts.",
    "Scope payment delivery around where your people work.",
    "The payroll is ready.\nPlan the delivery.",
    "Connect recipient details, available funds, and supported destinations.",
    [
      ["Know the destination.", "Confirm country, currency, and recipient requirements before sending."],
      ["Keep the schedule clear.", "Plan around funding requirements and the timing of supported payout rails."],
      ["Follow every payment.", "Keep payout references and exceptions available for reconciliation."]
    ],
    "Pay people.\nKeep the details connected.",
    "Acru’s payout scope does not replace payroll calculation, tax, or employment services.",
    "move"
  ),
  "/pricing": page(
    "Pricing",
    "A clear price\nfor your payment flow.",
    "Tell us your volume, methods, and markets. We’ll scope the commercial fit.",
    "Start with your business.\nNot a generic rate.",
    "Understand the costs behind the setup you actually need.",
    [
      ["Bring the payment mix.", "Share how customers pay, your typical transaction size, and expected volume."],
      ["Look beyond processing.", "Review payout, settlement, dispute, and other applicable costs together."],
      ["Know the terms.", "Get clarity on eligibility, reserves, and commitments before you decide."]
    ],
    "Less guesswork.\nA better conversation.",
    "Request a tailored proposal. No universal rate or savings guarantee is implied.",
    "platform"
  ),
  "/company": page(
    "About Acru",
    "More possibility.\nLess between you and it.",
    "We’re building a more connected way to manage payments.",
    "The flow matters.\nSo do the people behind it.",
    "Acru brings technology and implementation support into the same conversation.",
    [
      ["Start with the business.", "We look at how your customers pay and how your operation needs money to move."],
      ["Connect the moving parts.", "Acceptance, risk, balances, and payouts work better with shared context."],
      ["Stay close to the work.", "Our team helps scope the setup and the steps needed to bring it into your product."]
    ],
    "Your ambition.\nOur infrastructure.",
    "Tell us what you’re building. We’ll explore the fit together.",
    "platform"
  ),
  "/company/partners": page(
    "Partners",
    "Build something\nbetter together.",
    "Connect your product or customer relationships with Acru’s payment offering.",
    "A shared opportunity.\nA clear way forward.",
    "Explore a partnership around the value you can bring to customers.",
    [
      ["Bring your expertise.", "Share your market, product, or distribution focus with our team."],
      ["Define the relationship.", "Agree on responsibilities, customer experience, and commercial structure."],
      ["Build for the long term.", "Scope implementation and ongoing support before making commitments."]
    ],
    "Let’s find\nthe right fit.",
    "Partnership availability and terms are agreed individually.",
    "platform"
  ),
  "/contact": page(
    "Contact",
    "A real conversation.\nA clearer next step.",
    "Bring the payment challenge. We’ll help map the options.",
    "Start with\nwhat you want to build.",
    "A little context makes the first conversation more useful.",
    [
      ["Tell us about the business.", "Share your product, customers, and the markets you serve."],
      ["Show us the payment flow.", "Walk us through acceptance, risk, settlement, and payouts as they work today."],
      ["Define what better means.", "Tell us what you need to change and when you want to move."]
    ],
    "Let’s talk\nabout what’s next.",
    "Use the demo request form to reach the Acru team.",
    "platform"
  )
};

export const publicMarketingPaths = [...Object.keys(productPages), "/faq", "/resources"];
