import type { ProductPage } from "./product-pages";

type Question = readonly [question: string, answer: string];

// Explain the mechanics without presenting unconfirmed program terms as guarantees.
export const productQuestions: Record<string, readonly Question[]> = {
  "Card processing": [
    [
      "What’s the difference between authorization, capture, and settlement?",
      "Authorization is the issuer’s approval to reserve funds. Capture submits the approved amount for collection. Settlement is when the resulting funds become available under your agreement. An approved payment is not yet an available balance."
    ],
    [
      "Can I authorize a card now and capture the payment later?",
      "Separate authorization and capture can fit businesses that confirm stock or delivery before charging. The capture window and any amount changes depend on the card network and your approved setup. An expired authorization may require a new approval."
    ],
    [
      "Why can a legitimate card payment be declined?",
      "Insufficient funds, expired details, issuer restrictions, and authentication failures can all cause declines. Review the returned reason before deciding whether to request another method or correct the details. Repeatedly retrying the same decline is not a reliable recovery strategy."
    ],
    [
      "Does every customer need to complete 3D Secure?",
      "Not necessarily. Some authentication flows complete without a visible challenge; others ask the customer to verify with their issuer. The outcome depends on the transaction, issuer, regional requirements, and approved authentication configuration."
    ],
    [
      "Is canceling a payment the same as refunding it?",
      "No. Before capture, a cancellation may release the authorization. After capture, returning funds generally requires a refund. The customer’s bank controls when the release or refund appears on their account."
    ],
    [
      "Can I move existing saved cards to Acru?",
      "Treat saved-card migration as a separate workstream. Token portability depends on the current provider, receiving provider, and security requirements. Confirm whether a secure provider-to-provider transfer is possible before planning a switch; do not export raw card data yourself."
    ],
    [
      "Will a better approval rate mean a lower processing cost?",
      "Not automatically. Approval performance and pricing are different measures. Compare transaction mix, network and processing charges, cross-border costs, refunds, and dispute fees before evaluating the total cost of a new setup."
    ],
    [
      "What should I bring to a card-processing review?",
      "Recent processing statements, average transaction value, monthly volume, customer countries, and refund and dispute rates make the review useful. Also explain when you fulfill orders and whether you need recurring payments or delayed capture."
    ]
  ],
  Checkout: [
    [
      "Should I choose hosted, embedded, or custom checkout?",
      "Hosted checkout moves the payment step to a managed page. Embedded components keep it inside your site. A custom interface gives you more design responsibility. Confirm which integration is available for your payment methods and how much payment logic your team wants to maintain."
    ],
    [
      "Can customers stay on my website when they pay?",
      "Embedded flows can keep the core payment step on your site, but a wallet, bank, or issuer may still require an external authorization step. Design the return journey so customers can see the outcome without starting the purchase again."
    ],
    [
      "When should my application mark an order as paid?",
      "Use a verified server-side payment outcome, not just a button click or browser redirect. Some methods remain pending after checkout. Keep pending, successful, and unsuccessful states separate so you do not fulfill an unconfirmed payment."
    ],
    [
      "How do I avoid charging someone twice?",
      "Disable repeated submissions in the interface and use the duplicate-request controls defined by your integration. After a timeout, check the original payment outcome before creating another payment. A missing browser response does not prove the payment failed."
    ],
    [
      "Will every payment option appear for every customer?",
      "No. Device, browser, country, currency, purchase type, and account approval can affect eligibility. Show only the options available for that checkout rather than presenting a method that cannot complete."
    ],
    [
      "Does hosted checkout remove all PCI responsibilities?",
      "No. A hosted flow can reduce direct handling of card data, but your business still has security and compliance responsibilities. Confirm the applicable requirements for the exact integration instead of assuming that a hosted page makes your entire environment compliant."
    ],
    [
      "Can I keep my order system and customer accounts?",
      "Plan to connect your existing order and customer references to the payment flow. Define what happens when payments remain pending, are refunded, or are disputed. The implementation review should establish the identifiers and events your systems need."
    ],
    [
      "What should we test before going live?",
      "Test successful payments, declines, authentication, canceled redirects, timeouts, duplicate submissions, and delayed outcomes. Include mobile devices and confirm that customers can recover without losing their order."
    ]
  ],
  "Bank payments": [
    [
      "How are bank payments different from card payments?",
      "Bank payments move funds through bank rails rather than card networks. Confirmation, settlement, returns, and customer authorization work differently. A submitted bank payment may remain pending before its outcome is known."
    ],
    [
      "Are ACH and SEPA interchangeable?",
      "No. They serve different markets and have different account formats, currencies, authorization rules, and return processes. Choose the rail based on the customer’s bank and your approved program, not just the checkout label."
    ],
    [
      "Can a completed bank payment still be returned?",
      "Depending on the rail, a payment can later be returned for reasons such as insufficient funds or an authorization issue. Keep returns connected to the original order and decide how your business handles fulfillment and recovery."
    ],
    [
      "What should customers see while a bank payment is pending?",
      "Show that the payment is processing, retain their order reference, and explain whether fulfillment is waiting for confirmation. Do not encourage a second payment simply because bank processing is not immediate."
    ]
  ],
  "Digital wallets": [
    [
      "Why might Apple Pay or Google Pay not appear?",
      "Wallet availability depends on the customer’s device, browser, wallet setup, and transaction eligibility. Your checkout should offer another supported method when a wallet cannot be used."
    ],
    [
      "Are PayPal and Venmo automatically included?",
      "Do not assume every wallet is enabled together. Confirm each wallet’s availability for your business, country, currency, and integration before displaying it in checkout."
    ],
    [
      "Does a wallet payment still need issuer approval?",
      "For card-funded wallets, issuer approval is still part of the payment flow. Wallet authentication does not guarantee authorization, and a payment can still be declined."
    ],
    [
      "How are wallet refunds handled?",
      "Refunds generally follow the original payment’s supported refund process. Customers should check the original funding source or wallet activity. The exact posting time depends on the wallet and underlying payment method."
    ]
  ],
  "Alternative payment methods": [
    [
      "How do I choose which methods to offer?",
      "Start with your customer countries, currencies, devices, and purchase sizes. Pix, SEPA, wallets, and buy now, pay later serve different needs. A smaller relevant selection is often clearer than a list of unavailable options."
    ],
    [
      "Do local methods confirm payments immediately?",
      "Not always. Some return a pending state or require the customer to finish a step outside your site. Wait for the confirmed outcome defined by the method before treating the order as paid."
    ],
    [
      "Can everyone use Klarna or Afterpay?",
      "No. Buy now, pay later is subject to provider availability, merchant eligibility, purchase conditions, and customer approval. Showing an option does not guarantee that the customer will qualify."
    ],
    [
      "Can I use the same refund policy across all methods?",
      "Your commercial policy can be consistent, but method-specific refund rules and timing may differ. Confirm partial refunds, refund windows, and the way funds reach the customer for each method."
    ]
  ],
  Subscriptions: [
    [
      "What needs to be agreed before charging a customer again?",
      "Make the amount or pricing basis, billing frequency, cancellation terms, and payment consent clear before the first recurring charge. Your integration must retain the authorization information required by the method and program."
    ],
    [
      "Should I retry every failed subscription payment?",
      "No. The reason matters: an expired credential, a temporary funding issue, and a withdrawn authorization need different responses. Agree on permitted retry rules and give customers a way to update their payment details."
    ],
    [
      "Does canceling a subscription refund earlier payments?",
      "Not by itself. Cancellation stops future billing according to your terms; a refund returns a previous charge. Handle those actions separately and tell the customer which one occurred."
    ],
    [
      "Can I migrate subscriptions without asking customers to re-enter details?",
      "That depends on payment-credential portability, consent, and your current provider. Review the migration path before setting a cutover date. If credentials cannot transfer, plan a secure customer update flow."
    ]
  ],
  "Payouts overview": [
    [
      "What has to happen before a payout can be sent?",
      "The recipient and destination must be eligible, required checks must be complete, and funds must be available. A successful customer payment does not necessarily mean its proceeds are ready for payout."
    ],
    [
      "Is a payout marked sent already in the recipient’s account?",
      "Not necessarily. Submission, processing, and delivery are distinct states. Use the destination rail’s final outcome and reference when confirming receipt or investigating a delay."
    ],
    [
      "What happens if the destination details are wrong?",
      "A payout may fail, be returned, or require investigation. Recovery is not guaranteed once funds have moved. Validate recipient details before sending and retain the transfer reference for support."
    ],
    [
      "Can a payout be canceled after submission?",
      "It depends on the rail and processing state. Some transfers become irrevocable quickly. Do not promise cancellation until the payout’s actual status and cancellation rules have been checked."
    ]
  ],
  "Real-time payments": [
    [
      "Does real-time mean every transfer arrives instantly?",
      "No. The destination must support the network, and account checks and funding requirements still apply. Confirm the specific rail and eligibility before making a delivery promise."
    ],
    [
      "Is real-time availability the same as settlement availability?",
      "No. A fast transfer network does not make pending merchant proceeds available sooner. The balance must first meet the funding conditions of your payout program."
    ],
    [
      "What if the recipient’s bank does not support the rail?",
      "The transfer cannot use that route. Any alternative bank or card route needs its own eligibility, timing, and fee review; do not assume a fallback happens automatically."
    ],
    [
      "Can I reverse a real-time transfer?",
      "Many real-time transfers are difficult or impossible to cancel after acceptance. Verify the recipient and amount first, and distinguish an investigation or recovery request from a guaranteed reversal."
    ]
  ],
  "Push to card": [
    [
      "Can payouts be sent to any card?",
      "No. Card type, issuer, country, currency, and network participation affect eligibility. Confirm that the destination supports push-to-card payouts before offering it to the recipient."
    ],
    [
      "Is a push-to-card payout a refund?",
      "No. A refund returns funds against an earlier payment. A push-to-card payout is a separate transfer to an eligible card and has its own program requirements."
    ],
    [
      "Why might a card payout be declined?",
      "The card may be ineligible, restricted, expired, or unable to receive the transfer. Review the returned outcome before requesting different destination details or choosing another approved rail."
    ],
    [
      "When can the recipient use the funds?",
      "Timing depends on the issuer and program. A successful submission is not a universal promise of immediate availability. Confirm the delivery state before telling the recipient the funds are ready."
    ]
  ],
  Settlement: [
    [
      "Why is my available balance lower than my payment volume?",
      "Gross payment volume can include funds that are still pending. Fees, refunds, disputes, adjustments, reserves, and previous payouts can also affect the available balance. Reconcile those components rather than comparing only the totals."
    ],
    [
      "What is the difference between settlement and payout?",
      "Settlement determines when processed proceeds become available under your agreement. A payout moves eligible available funds to a destination. The two stages can have different schedules."
    ],
    [
      "What is a reserve?",
      "A reserve is a portion of funds held under the account’s terms to cover potential exposure such as refunds or disputes. Whether one applies, its amount, and release conditions should be stated in your agreement."
    ],
    [
      "Is instant settlement available on every account?",
      "No universal instant-settlement promise applies. Timing depends on your approved program, payment methods, risk review, and funding terms. Confirm the actual schedule and any acceleration costs before planning cash flow."
    ]
  ],
  "Digital assets": [
    [
      "Is choosing the token enough to send a payment?",
      "No. The network matters too: an asset with the same name can exist on different chains. The payment instructions must specify both the supported asset and network."
    ],
    [
      "When should a crypto payment count as complete?",
      "A submitted blockchain transaction is not necessarily confirmed. Use the confirmation requirements and final payment status defined by your program before fulfilling an order."
    ],
    [
      "Can a crypto payment be refunded like a card charge?",
      "Blockchain transfers are not generally reversed in place. A return of funds may require a separate transfer and verified destination, with its own fees and controls. Confirm the supported refund process first."
    ],
    [
      "Does accepting crypto mean I receive crypto at settlement?",
      "Not necessarily. Acceptance, conversion, and settlement are separate choices. Confirm the supported settlement asset or currency, network, conversion terms, and fees for your approved setup."
    ]
  ],
  Platforms: [
    [
      "Who is the merchant in a platform payment?",
      "That depends on the approved commercial and funds-flow model. Identify who sells to the buyer, owns the payment relationship, and is responsible for refunds and disputes before choosing an integration."
    ],
    [
      "Can every seller start accepting payments immediately?",
      "No. Seller verification and account approval can be required before capabilities are enabled. Your onboarding experience should distinguish submitted information from an account that is ready to transact."
    ],
    [
      "How should platform fees and seller proceeds be handled?",
      "Define the allocation rules and keep them connected to the original sale. Also decide how fees and seller balances change when a payment is refunded or disputed."
    ],
    [
      "Does Acru automatically become our merchant of record?",
      "Do not assume that a payment integration transfers merchant-of-record responsibilities. The contracting parties, compliance duties, funds handling, and commercial model must be agreed explicitly."
    ]
  ],
  "Merchant onboarding": [
    [
      "What information may a merchant need to provide?",
      "The review can include business identity, ownership, operating address, website, expected activity, and payout details. Requirements vary by jurisdiction, business model, and payment program."
    ],
    [
      "Does completing the form mean the account is approved?",
      "No. Submitted information may still need verification or additional documentation. Keep application completion separate from approval and enabled payment capabilities."
    ],
    [
      "Why can more documents be requested after onboarding?",
      "Changes in ownership, products, markets, or transaction activity can require another review. Verification is not always a one-time event; plan a way to request and track updated information."
    ],
    [
      "Can I promise a fixed approval time to merchants?",
      "Only if a specific service commitment has been agreed. Incomplete documents and additional review can change the timeline. Show what is outstanding rather than guaranteeing a launch date."
    ]
  ],
  "Split payments": [
    [
      "Does splitting a payment send everyone their money immediately?",
      "No. Allocation records how proceeds belong to different parties. Settlement and payout determine when those parties can receive the funds. Keep those steps distinct in your product."
    ],
    [
      "What happens to a split when the buyer gets a refund?",
      "The refund must be reflected in the related allocations and balances. Agree on who bears the refund, how platform fees are treated, and what happens if a recipient has already been paid."
    ],
    [
      "Can the platform take a fee from each sale?",
      "Scope the fee model as part of the approved funds flow. Define whether fees are fixed or variable and how they behave on partial refunds, cancellations, and disputes."
    ],
    [
      "Who covers a negative seller balance?",
      "That is a contractual and program question, not an automatic property of a split. Agree on liability, reserves, recovery, and payout controls before onboarding sellers."
    ]
  ],
  "Reporting & reconciliation": [
    [
      "Why do sales totals and bank deposits differ?",
      "Deposits can combine settled activity across periods and reflect fees, refunds, reserves, and other adjustments. Reconcile the settlement components and dates rather than matching gross sales to a single deposit."
    ],
    [
      "Which reference should connect an order to its payment?",
      "Retain your order reference alongside the provider’s payment identifier. Also keep related refund, dispute, settlement, and payout references so a support or finance team can trace the full sequence."
    ],
    [
      "Should I report by payment date or settlement date?",
      "They answer different questions. Payment dates describe customer activity; settlement dates explain funds availability. Label the basis and timezone clearly so reports are comparable."
    ],
    [
      "Can we rely on the dashboard for our accounting integration?",
      "Confirm export formats, available fields, delivery methods, and update timing during integration planning. Do not assume an accounting connector or automated export exists until it is included in your implementation scope."
    ]
  ],
  "Risk overview": [
    [
      "Does authentication mean a payment is safe to fulfill?",
      "Authentication is one signal, not a complete fulfillment decision. Consider the payment outcome, customer and order context, and the controls agreed for your business."
    ],
    [
      "Should every suspicious payment be declined?",
      "Not necessarily. Depending on the approved workflow, a payment may need verification or review rather than an immediate decline. Balance the risk of loss against rejecting legitimate customers."
    ],
    [
      "Are fraud checks and chargeback protection the same thing?",
      "No. Checks help assess or prevent risky activity. Chargeback protection, where available, is a defined program with eligibility rules and exclusions. Neither implies that every loss is covered."
    ],
    [
      "What data makes a risk review more useful?",
      "Payment results, order details, customer history, delivery evidence, and prior disputes can provide context. Collect only what you need and handle it according to your privacy and security obligations."
    ]
  ],
  Authorization: [
    [
      "Is an authorization an actual charge?",
      "It is approval to reserve an amount, not the same as capture or settlement. Customers may see a temporary hold while the payment is awaiting capture or release."
    ],
    [
      "Why can an authorization expire?",
      "A hold is valid only for a limited window set by the method, network, and transaction type. If capture happens too late, a new authorization may be needed. Confirm the applicable window for your flow."
    ],
    [
      "What should happen after an issuer decline?",
      "Use the decline reason to choose the next step. Some failures need corrected details or another payment method; others may permit a later attempt. Avoid automatic retries without regard to the reason and network rules."
    ],
    [
      "Can a customer see a hold even if checkout failed?",
      "Yes. An authorization can succeed even if a later browser or application step fails. Check the original payment before creating another attempt, and cancel an unused authorization when supported."
    ]
  ],
  "Chargeback protection": [
    [
      "Does protection cover every chargeback?",
      "No blanket guarantee should be assumed. Coverage, eligible transactions, exclusions, evidence requirements, and submission deadlines must be defined in the applicable protection agreement."
    ],
    [
      "Is a refund the same as a chargeback?",
      "No. A refund is initiated through the merchant’s payment process. A chargeback is a dispute handled through the issuer and card-network process. Check the dispute state before issuing a refund to avoid duplicate reimbursement."
    ],
    [
      "What evidence should I keep for a dispute?",
      "Depending on the reason, useful records can include the order, customer consent, delivery or usage evidence, policies shown at purchase, and relevant communications. Keep evidence tied to the specific transaction."
    ],
    [
      "Does submitting evidence guarantee we win?",
      "No. Evidence must address the dispute reason and meet the deadline, and the relevant dispute process determines the outcome. A prevention or protection program does not remove the need to respond properly."
    ]
  ],
  Security: [
    [
      "Does using Acru make my business PCI compliant?",
      "No provider can automatically make your entire environment compliant. Your obligations depend on how you collect, transmit, store, and access payment data. Review the specific integration and applicable validation requirements."
    ],
    [
      "Can I send card details through email or support chat?",
      "Do not send full card numbers, security codes, passwords, or secret keys through ordinary support channels. Use the approved secure payment and support processes for sensitive information."
    ],
    [
      "Can I request compliance documentation?",
      "Ask the Acru team for current documentation and its scope during vendor review. A footer badge is not a substitute for reviewing the applicable report, attestation, covered services, and dates."
    ],
    [
      "What security responsibilities remain with our team?",
      "Protect user access, credentials, application code, and the data your systems handle. Limit permissions, keep software maintained, and define an incident response process alongside the payment integration."
    ]
  ],
  Ecommerce: [
    [
      "Should I charge at checkout or when the order ships?",
      "That depends on fulfillment timing and the approved payment flow. If using delayed capture, confirm the authorization window and what happens when an item is unavailable or ships later."
    ],
    [
      "What happens when a customer closes the checkout window?",
      "The payment may still have progressed. Your system should check the verified outcome and preserve the order rather than treating a closed browser as a canceled payment."
    ],
    [
      "How should partial refunds be handled?",
      "Connect the refund to the original payment and order items, and track its status separately. Confirm that the selected payment method supports the required partial-refund workflow."
    ],
    [
      "Can I add local methods without changing the entire store?",
      "Plan the method mix around the supported checkout integration. Some methods introduce redirects or delayed confirmation, so the order and fulfillment logic may still need changes even if the visual checkout stays familiar."
    ]
  ],
  Fintech: [
    [
      "Can account funding and withdrawals use different rails?",
      "They can be separate parts of an approved program, but each needs its own eligibility, verification, and funding review. A supported deposit method does not automatically imply a corresponding withdrawal route."
    ],
    [
      "Does a successful deposit make the balance withdrawable?",
      "Not necessarily. Settlement, returns exposure, reserves, and account checks may affect availability. Keep the displayed customer balance and the amount eligible for withdrawal clearly distinguished."
    ],
    [
      "Does a payment integration cover our licensing obligations?",
      "No automatic transfer of regulatory responsibility should be assumed. The business model, jurisdictions, contracting parties, and funds handling need review before launch."
    ],
    [
      "What should we bring to the initial review?",
      "A diagram of how funds enter, where they are held or recorded, and who receives them is a useful starting point. Include customer markets, verification steps, expected volumes, and the withdrawal experience."
    ]
  ],
  Gaming: [
    [
      "Can the same setup be used in every gaming market?",
      "No. Business type, licensing, jurisdiction, and payment-provider rules can affect eligibility. Confirm each market and use case before offering deposits or withdrawals there."
    ],
    [
      "Does a deposit approval mean the player can withdraw immediately?",
      "No. Funding availability, verification, and program controls may apply independently. Explain which funds are eligible for withdrawal rather than equating an approved deposit with withdrawable balance."
    ],
    [
      "Can players withdraw to a different method from their deposit?",
      "That depends on the approved program and its identity, destination, and payment rules. Do not offer unrestricted destination switching without confirming those requirements."
    ],
    [
      "How do we avoid duplicate deposits after a timeout?",
      "Check the original attempt’s verified outcome before creating another payment. Keep an order or deposit reference, show a processing state, and let the player recover without repeatedly submitting the same request."
    ]
  ],
  Marketplaces: [
    [
      "Who is responsible when a buyer disputes a seller’s payment?",
      "Responsibility depends on the marketplace agreement and approved payment model. Define who responds, provides evidence, and funds any resulting loss before sellers begin transacting."
    ],
    [
      "Can we pay sellers before their payments settle?",
      "Do not assume pending proceeds are eligible for payout. Early availability, if offered, requires explicit funding and risk terms. Model refunds, disputes, and reserves alongside seller payout timing."
    ],
    [
      "What happens if an order has several sellers?",
      "Map the original purchase to each seller’s allocation and your platform fee. Also define how partial refunds and failed fulfillment affect individual seller balances."
    ],
    [
      "Can seller onboarding be part of our own product?",
      "Plan the collection and status experience around the approved onboarding integration. Your product should show outstanding requirements without treating a submitted application as an approved account."
    ]
  ],
  Remittances: [
    [
      "What is a supported corridor?",
      "It is an approved origin-to-destination flow, with specific currency, recipient, and payment requirements. Support for one country pair does not establish coverage for every direction or currency."
    ],
    [
      "What should a sender know before confirming a transfer?",
      "Present the amount, currency, applicable fees, exchange terms where relevant, destination, and expected timing from the actual program terms. Avoid implying a guaranteed rate or arrival time that has not been agreed."
    ],
    [
      "Can a transfer be recalled after it is sent?",
      "Recall and cancellation depend on the rail and transfer state, and recovery may not be possible. Validate recipient details before submission and retain the transfer reference for investigations."
    ],
    [
      "Does Acru replace our regulatory review?",
      "No. Your business model, licensing responsibilities, sender and recipient checks, and supported corridors must be reviewed explicitly. A payment connection alone does not authorize a remittance business."
    ]
  ],
  "Global payroll": [
    [
      "Does Acru calculate payroll or employment taxes?",
      "This page concerns payout delivery, not payroll calculation, tax withholding, or employment services. Your payroll process must establish the correct amount and obligations before the payout instruction."
    ],
    [
      "Can everyone be paid in the same currency?",
      "Recipient location, destination account, and program support determine the available currencies. Confirm any conversion and fees before communicating the amount a recipient will receive."
    ],
    [
      "How far ahead should we fund a payroll run?",
      "Work backward from your agreed funding requirements, cutoffs, and payout timings. A payroll due date does not override bank holidays, compliance checks, or destination-rail constraints."
    ],
    [
      "What happens when one recipient’s payout fails?",
      "Keep that recipient’s outcome distinct from the rest of the payroll run. Check the reason and destination details before reissuing, and verify the original transfer did not complete to avoid paying twice."
    ]
  ],
  Pricing: [
    [
      "Is there one published rate for every business?",
      "Pricing is scoped to the business and payment flow rather than a universal rate on this page. Volume, average transaction size, methods, markets, and risk profile are relevant to the proposal."
    ],
    [
      "What charges should I compare besides processing?",
      "Ask about network and method charges, cross-border and conversion costs, refunds, disputes, payouts, and any platform or minimum fees. Compare the total expected cost for your actual transaction mix."
    ],
    [
      "Are reserves the same as fees?",
      "No. Fees are charges for services; reserves are funds held under agreed conditions. Review reserve amounts and release terms separately because they affect cash availability even when they are not processing charges."
    ],
    [
      "Will switching providers guarantee a saving?",
      "No saving should be assumed without a like-for-like comparison. Use recent statements and include all relevant fees and funding terms, not only the headline processing rate."
    ]
  ],
  "About Acru": [
    [
      "What part of the payment operation does Acru focus on?",
      "Acru’s offering connects acceptance, payment context, risk workflows, and eligible money movement. The implementation scope should identify which of those pieces your business will actually use."
    ],
    [
      "Is Acru only for businesses replacing their entire stack?",
      "The first review should identify the problem you want to solve and which existing systems need to stay. Do not assume a complete migration is necessary—or that every existing provider can connect without changes."
    ],
    [
      "Who should join an initial product conversation?",
      "A business owner for the payment flow and someone familiar with the integration are useful. Bring finance or risk colleagues if settlement, reconciliation, disputes, or reserves are central to the decision."
    ],
    [
      "How do we distinguish a proposed feature from a launch commitment?",
      "Ask for a written implementation scope that identifies available capabilities, dependencies, and any planned work. Product direction is not a substitute for an agreed production deliverable."
    ]
  ],
  Partners: [
    [
      "What should I include in a partnership enquiry?",
      "Describe your product or customer audience, the markets you serve, expected activity, and what you would contribute. Explain whether you are proposing a technical integration, commercial relationship, or customer referral."
    ],
    [
      "Does a partnership let us approve merchants ourselves?",
      "Not automatically. Merchant approval, verification, and account capabilities follow the agreed program. Define who can collect information, communicate decisions, and support the customer."
    ],
    [
      "Are referral fees or revenue shares published?",
      "No standard commercial arrangement is promised here. Any compensation, eligibility, attribution rules, and payment schedule must be agreed in the partnership terms."
    ],
    [
      "Can we use Acru branding before an agreement is signed?",
      "Confirm brand permissions and approved claims first. A discussion about a potential partnership does not itself establish an endorsed relationship or permission to announce one."
    ]
  ],
  Contact: [
    [
      "What should I put in the demo request?",
      "Include what your business sells, your main customer markets, approximate monthly volume, and the payment issue you want to solve. A short description of your current setup helps route the conversation."
    ],
    [
      "Should I send processing statements with the first message?",
      "You can mention that statements are available without attaching sensitive material to an initial enquiry. Ask the team for the appropriate secure channel if documents are needed for the review."
    ],
    [
      "Is a demo request an application approval?",
      "No. A conversation can establish fit, but pricing, underwriting, verification, and integration scope may still need separate review before an account is ready to process."
    ],
    [
      "What if my question concerns an existing payment?",
      "Use the support contact established for your account and include the transaction reference and a clear description of the issue. Do not send full card details, passwords, or secret keys."
    ]
  ]
};

const operationalQuestions: readonly Question[] = [
  [
    "How do we confirm what is available for our business?",
    "Ask for a written scope naming the methods, markets, currencies, integrations, and responsibilities included in your program. Separate capabilities available at launch from planned work so the implementation and commercial terms match."
  ],
  [
    "Can we test the full flow before launch?",
    "Agree on a test plan with the implementation team: successful and failed outcomes, pending states, retries, refunds, and reconciliation where relevant. Confirm which test environment and production checks apply to your setup; a simulated success is not proof that every live rail is enabled."
  ]
];

export function getProductFaqs(page: ProductPage) {
  const questions = productQuestions[page.title];
  if (!questions) throw new Error(`Missing FAQs for ${page.title}`);
  return [...questions, ...operationalQuestions].map(([question, answer], index) => ({
    id: `product-question-${index + 1}`,
    question,
    answer
  }));
}
