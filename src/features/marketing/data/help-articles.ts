export type HelpArticle = {
  slug: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  sections: { id: string; title: string; paragraphs?: string[]; steps?: string[]; items?: string[] }[];
};

// Original Acru guidance. Export instructions follow transactions-page.tsx,
// not the Authorize.net interface used as the visual reference.
export const helpArticles: HelpArticle[] = [
  {
    slug: "gateway-reporting-vs-custom-checkout",
    number: "ACRU-004",
    category: "Getting started",
    title: "Is gateway reporting the same as Acru Checkout?",
    summary:
      "No. Reporting for an existing gateway and building on Acru’s custom checkout are separate integration paths.",
    sections: [
      {
        id: "traditional-gateway",
        title: "Traditional gateway: NMI or Authorize.net",
        paragraphs: [
          "With this setup, payments continue through the merchant’s NMI or Authorize.net gateway. Acru is the reporting layer where the merchant can view the connected activity. Connecting a gateway does not replace the processor, change funding terms, or automatically add custom-checkout features.",
          "Confirm the gateway account, credentials, reporting permissions, and data coverage during onboarding. Never share secret gateway keys in a support message."
        ]
      },
      {
        id: "custom-checkout",
        title: "Acru custom checkout",
        paragraphs: [
          "The custom-checkout path uses Acru’s payment interfaces and API-led flows. Hosted, Embedded, and API are implementation options to discuss for that product, not automatic upgrades to a traditional gateway connection.",
          "Wallet infrastructure, smart-contract components, and custom-checkout risk services belong to this path only when included in the approved implementation. They are not prerequisites for viewing NMI or Authorize.net reporting."
        ]
      },
      {
        id: "what-to-confirm",
        title: "What to confirm before launch",
        items: [
          "Which of the two paths your account will use",
          "Who processes the payment and who supplies the reporting data",
          "Which account, transaction states, and reporting fields are connected",
          "Which features are ready for use versus planned work",
          "What your team must test before using live payments"
        ]
      },
      {
        id: "availability",
        title: "Partner availability",
        paragraphs: [
          "A provider appearing in an integration directory does not mean every account can use every feature. New processor connections, payout services, and risk products require their own approved scope. Confirm availability with Acru before designing a customer flow around them."
        ]
      }
    ]
  },
  {
    slug: "export-transactions",
    number: "ACRU-001",
    category: "Transactions & reporting",
    title: "How do I export my transactions?",
    summary: "Filter your transaction list and download the matching records as a CSV file.",
    sections: [
      {
        id: "before-you-start",
        title: "Before you start",
        paragraphs: [
          "Open Transactions in your Acru dashboard. This guide describes the current dashboard interface; available records depend on your account and data source. In a demo or test environment, an export contains demo or test records—not live payment activity."
        ]
      },
      {
        id: "download",
        title: "Download a transaction export",
        steps: [
          "Open Transactions from the Payments navigation.",
          "Set the date range for the period you need. The initial selection is Last 30 days.",
          "Use the status tabs, payment-method filter, or search field to narrow the results. Search accepts a transaction ID, customer name, email, description, or last four digits.",
          "Select Export at the top right of the transaction list.",
          "Open acru-transactions.csv from your browser’s downloads in your spreadsheet or reporting tool."
        ],
        paragraphs: [
          "The export includes every matching record in the loaded collection, not just the six rows on the current table page. Clear unwanted filters before downloading a broader set of results."
        ]
      },
      {
        id: "included-fields",
        title: "What is included?",
        paragraphs: ["The CSV contains these columns:"],
        items: [
          "Transaction ID and creation date/time",
          "Amount and currency",
          "Payment status and method",
          "Customer name and email",
          "Last four digits",
          "Fee and net amount"
        ]
      },
      {
        id: "check-results",
        title: "If records are missing",
        paragraphs: [
          "Check the date range, selected status, payment method, and search text. Each active filter narrows the export. If no records match, the CSV contains column headings only.",
          "This file is a transaction export, not a settlement statement. Its net column is calculated as amount minus fee; do not treat that value as proof that funds have settled or are available for payout."
        ]
      },
      {
        id: "handle-file",
        title: "Handle the file carefully",
        paragraphs: [
          "The export includes customer names and email addresses. Store it in an approved location and share it only with people who need access. The export does not include full card numbers or card security codes."
        ]
      }
    ]
  },
  {
    slug: "choose-checkout-integration",
    number: "ACRU-002",
    category: "Checkout",
    title: "Which checkout integration should I choose?",
    summary: "Compare Hosted, Embedded, and API before deciding what your team will build.",
    sections: [
      {
        id: "hosted",
        title: "Hosted checkout",
        paragraphs: [
          "Choose a hosted experience when you want a managed payment page instead of building the checkout interface. Plan the handoff from your product and the page customers return to after payment."
        ]
      },
      {
        id: "embedded",
        title: "Embedded checkout",
        paragraphs: [
          "Choose embedded components when the payment step should sit inside your existing website or application. Confirm how the supported methods handle authentication, redirects, and completion states."
        ]
      },
      {
        id: "api",
        title: "API-led checkout",
        paragraphs: [
          "Choose an API-led flow when your team needs to own the interface and payment orchestration. Scope error handling, confirmation, duplicate-request protection, and operational support as part of the build.",
          "The public developer documentation currently describes an implementation-in-progress contract. Confirm API access and supported operations with Acru before treating those examples as production endpoints."
        ]
      },
      {
        id: "confirm-scope",
        title: "Confirm your launch scope",
        items: [
          "Your business model, customer countries, and currencies",
          "The payment methods approved for your account",
          "Authentication and redirect requirements",
          "Payment confirmation and order-update behavior",
          "Test cases, launch requirements, and team responsibilities"
        ]
      }
    ]
  },
  {
    slug: "confirm-checkout-payment",
    number: "ACRU-003",
    category: "Checkout",
    title: "When should I mark an order as paid?",
    summary: "Use a confirmed payment result—not a browser redirect—to update an order.",
    sections: [
      {
        id: "confirmation",
        title: "Wait for payment confirmation",
        paragraphs: [
          "A customer arriving at a success page does not independently confirm that a payment completed. Use the authoritative payment state defined by your approved integration, and keep the payment reference attached to the order."
        ]
      },
      {
        id: "pending",
        title: "Keep pending separate from paid",
        paragraphs: [
          "Some methods take time to confirm. Show a pending state while you wait for the required result. Authorization, capture, settlement, and payout are different stages; agree which state permits fulfillment for your business."
        ]
      },
      {
        id: "retries",
        title: "Check before retrying",
        paragraphs: [
          "A timeout or missing browser response does not prove that a payment failed. Check the original payment outcome and follow your integration’s duplicate-request controls before creating another payment."
        ]
      },
      {
        id: "support",
        title: "What to include when asking for help",
        items: [
          "Order and payment references",
          "Approximate time and time zone",
          "The status or error message you saw",
          "Whether this happened in a test or live environment"
        ],
        paragraphs: ["Do not send full card numbers, card security codes, API secrets, or passwords."]
      }
    ]
  }
];

export const helpPaths = ["/help", ...helpArticles.map((article) => `/help/${article.slug}`)];

export function searchHelpArticles(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return helpArticles.filter((article) => {
    const text = JSON.stringify(article).toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
