export type DocTopic = "quickstart" | "authentication" | "payments" | "checkout" | "webhooks" | "errors";
export type CodeLanguage = "cURL" | "JavaScript" | "Python";
type DocSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  fields?: Array<{ name: string; detail: string }>;
  example?: { samples: Record<CodeLanguage, string>; status: string; response: string; note: string };
};
export type DocumentationTopic = {
  title: string;
  description: string;
  endpoint?: { method: "GET" | "POST"; path: string };
  sections: DocSection[];
};

// Official forward-looking contract, authored for implementation at the user's request.
// Preserve the existing NestJS /api/v1 prefix and Acru's payment ownership boundary.
// These operations are not implemented yet; never label these examples as live results.
export const integrationSpecification = {
  version: "0.1",
  status: "Implementation in progress",
  basePath: "/api/v1",
  requestIdHeader: "x-request-id",
  idempotencyHeader: "Idempotency-Key"
} as const;
export const apiPaths = {
  account: "/api/v1/account",
  paymentIntents: "/api/v1/payment-intents",
  checkoutSessions: "/api/v1/checkout/sessions",
  webhookEndpoints: "/api/v1/webhook-endpoints"
} as const;

export function requestSamples(
  path: string,
  body?: Record<string, unknown>,
  key?: string
): Record<CodeLanguage, string> {
  const json = body ? JSON.stringify(body) : undefined;
  return {
    cURL: `# Contract example — available when the Acru API launches.
# Use the origin and secret key provisioned by Acru.
: "\${ACRU_API_BASE_URL:?Set your provisioned Acru API origin}"
: "\${ACRU_SECRET_KEY:?Set your server-side Acru secret key}"

curl --include --fail-with-body "$ACRU_API_BASE_URL${path}" \\
  -H "Authorization: Bearer $ACRU_SECRET_KEY"${
    key
      ? ` \\
  -H "Idempotency-Key: ${key}"`
      : ""
  }${
    json
      ? ` \\
  -H "Content-Type: application/json" \\
  --data '${json}'`
      : ""
  }`,
    JavaScript: `// Server-side contract example, using Node.js native fetch.
// No Acru SDK is required or published yet.
const baseUrl = process.env.ACRU_API_BASE_URL;
const secretKey = process.env.ACRU_SECRET_KEY;
if (!baseUrl || !secretKey) throw new Error("Configure your Acru API access");

const response = await fetch(new URL("${path}", baseUrl), {
  method: "${body ? "POST" : "GET"}",
  headers: {
    Authorization: \`Bearer \${secretKey}\`${key ? `,\n    "Idempotency-Key": "${key}"` : ""}${body ? ',\n    "Content-Type": "application/json"' : ""}
  }${json ? `,\n  body: JSON.stringify(${JSON.stringify(body, null, 2).replaceAll("\n", "\n  ")})` : ""}
});
const requestId = response.headers.get("x-request-id");
const data = await response.json();
if (!response.ok) {
  throw new Error(\`\${data.error?.code}: \${data.error?.message} (\${requestId})\`);
}
console.log(data);
`,
    Python: `# Contract example using the Python standard library.
import json
import os
from urllib.request import Request, urlopen
from urllib.error import HTTPError

request = Request(
    os.environ["ACRU_API_BASE_URL"].rstrip("/") + "${path}",
    method="${body ? "POST" : "GET"}",${json ? `\n    data=${JSON.stringify(json)}.encode("utf-8"),` : ""}
    headers={
        "Authorization": "Bearer " + os.environ["ACRU_SECRET_KEY"]${key ? `,\n        "Idempotency-Key": "${key}"` : ""}${body ? ',\n        "Content-Type": "application/json"' : ""}
    },
)
try:
    with urlopen(request, timeout=15) as response:
        print(response.headers.get("x-request-id"))
        print(json.load(response))
except HTTPError as error:
    print(error.code, error.headers.get("x-request-id"))
    print(error.read().decode("utf-8"))
    raise
`
  };
}

export const paymentIntentRequest = {
  amount: 12500,
  currency: "usd",
  merchant_reference: "order_1048",
  capture_method: "automatic",
  metadata: { order_id: "1048" }
};
export const paymentIntentExample = {
  id: "pi_example",
  object: "payment_intent",
  ...paymentIntentRequest,
  status: "requires_payment_method",
  livemode: false,
  created_at: "2026-09-10T12:00:00Z"
};
const createIntentExample: NonNullable<DocSection["example"]> = {
  samples: requestSamples(apiPaths.paymentIntents, paymentIntentRequest, "order_1048_create_intent"),
  status: "201 Created · contract example",
  response: JSON.stringify(paymentIntentExample, null, 2),
  note: "IDs are illustrative placeholders. Creating an intent does not authorize, capture, or settle funds. Collect payment details through a checkout session, then follow the intent’s status."
};

export const docsNav: Array<{ group: string; items: Array<{ id: DocTopic; label: string }> }> = [
  {
    group: "Get started",
    items: [
      { id: "quickstart", label: "Quickstart" },
      { id: "authentication", label: "Authentication" }
    ]
  },
  {
    group: "Accept payments",
    items: [
      { id: "payments", label: "Payment intents" },
      { id: "checkout", label: "Checkout" }
    ]
  },
  {
    group: "Build reliably",
    items: [
      { id: "webhooks", label: "Webhooks" },
      { id: "errors", label: "Errors and retries" }
    ]
  }
];

export const docContent: Record<DocTopic, DocumentationTopic> = {
  quickstart: {
    title: "Build your payment flow",
    description:
      "Connect your product to Acru. Create a payment intent, collect payment details with checkout, and keep your application in sync with verified events.",
    endpoint: { method: "POST", path: apiPaths.paymentIntents },
    sections: [
      {
        id: "before-you-begin",
        title: "Before you begin",
        paragraphs: [
          "This is Acru’s v0.1 integration specification: the contract for the API being built. The live API and credential provisioning are not available yet. Examples define the intended requests and responses; they are not connected to a running processor.",
          "When access opens, Acru will provision your merchant account, API origin, test credentials, and enabled capabilities. Keep test and live resources separate. Use HTTPS and send secret-authenticated requests from your server."
        ],
        items: [
          "Store your provisioned origin in ACRU_API_BASE_URL and your secret in ACRU_SECRET_KEY.",
          "Use JSON over HTTP with the /api/v1 prefix. No Acru SDK installation is required by this specification.",
          "Persist a unique idempotency key with each logical write operation and its request payload."
        ]
      },
      {
        id: "create-a-payment",
        title: "Create a payment intent",
        paragraphs: [
          "A payment intent tracks one attempt to collect an amount in a single currency. This example represents USD 125.00 using integer cents. Create it on your server before sending the customer to checkout."
        ],
        example: createIntentExample
      },
      {
        id: "complete-the-flow",
        title: "Complete the flow",
        paragraphs: [
          "Create a checkout session referencing the intent ID. Redirect the customer to the returned hosted URL; Acru collects payment details and handles required customer authentication.",
          "Your return page should retrieve the intent’s status through your server. Use a verified payment_intent.succeeded event to drive fulfillment, with event deduplication. A return URL alone is never proof of payment."
        ],
        fields: [
          {
            name: "1. Your server",
            detail: "Create the intent and session. Never send a secret key to the customer’s browser."
          },
          {
            name: "2. Acru checkout",
            detail: "Collect payment details using methods enabled for the merchant, currency, and customer context."
          },
          {
            name: "3. Your event receiver",
            detail: "Verify the raw signed payload, persist the event ID, and update your order exactly once."
          }
        ]
      },
      {
        id: "current-preview",
        title: "About the current preview",
        paragraphs: [
          "The dashboard and /api/sandbox/* handlers are interface simulators, not this API. Their sample keys, capability lists, and succeeded responses must not be used to validate a real integration. These documentation examples become executable when the specified backend is implemented and access is provisioned."
        ]
      }
    ]
  },
  authentication: {
    title: "Authentication",
    description:
      "Authenticate on your server with a merchant-scoped secret key. Separate environments and keep credentials out of the customer experience.",
    endpoint: { method: "GET", path: apiPaths.account },
    sections: [
      {
        id: "api-keys",
        title: "API keys and environments",
        paragraphs: [
          "Send Authorization: Bearer <secret_key>. Each issued key belongs to one merchant and one environment. A prefix is a label, not authentication: the backend must validate the issued key, permissions, merchant, environment, and revocation state on every request."
        ],
        fields: [
          { name: "sk_test_acru_…", detail: "Server-side test credential. Test operations must not move real funds." },
          {
            name: "sk_live_acru_…",
            detail: "Production credential, provisioned only after account activation and capability approval."
          },
          {
            name: "Permissions",
            detail:
              "Initial scopes: account:read, payments:read, payments:write, checkout:write, and webhooks:write. Grant only the scopes your integration needs."
          }
        ]
      },
      {
        id: "verify-access",
        title: "Verify account access",
        paragraphs: [
          "GET /api/v1/account requires account:read. The response identifies the authenticated merchant and its enabled capabilities. Capabilities are account-specific, not a promise that every method is available."
        ],
        example: {
          samples: requestSamples(apiPaths.account),
          status: "200 OK · contract example",
          response: JSON.stringify(
            {
              id: "acct_example",
              object: "account",
              livemode: false,
              capabilities: {
                card_payments: "active",
                bank_payments: "inactive",
                crypto_payments: "inactive",
                bnpl: "inactive"
              }
            },
            null,
            2
          ),
          note: "This is the intended account contract, not the current preflight simulator. Actual IDs and capabilities must come from the authenticated account."
        }
      },
      {
        id: "key-security",
        title: "Keep secrets server-side",
        paragraphs: [
          "Keep keys in your server’s secret manager or environment configuration. Do not commit them, embed them in client JavaScript, or include them in URLs, analytics, or logs.",
          "For rotation, issue a replacement with the required scopes, update and verify each consumer, then revoke the old key. The key-management backend must support this lifecycle before production access is enabled."
        ],
        items: [
          "Missing, invalid, expired, or revoked credentials return 401.",
          "Valid credentials without the required scope return 403.",
          "Resources outside the authenticated merchant or environment return 404 without disclosing their existence."
        ]
      }
    ]
  },
  payments: {
    title: "Payment intents",
    description:
      "One resource for the payment lifecycle—from collecting a payment method to authorization, capture, and the final outcome.",
    endpoint: { method: "POST", path: apiPaths.paymentIntents },
    sections: [
      {
        id: "parameters",
        title: "Create an intent",
        paragraphs: [
          "Requires payments:write and an Idempotency-Key header. Send application/json. Amounts are positive safe integers, never floating-point monetary values. Unsupported currencies or capabilities return validation errors."
        ],
        fields: [
          {
            name: "amount · integer · required",
            detail:
              "The smallest specified currency unit, up to 9,007,199,254,740,991, subject to lower account limits. USD uses cents: 12500 is USD 125.00. USDC uses six decimal places: 125000000 is 125 USDC."
          },
          {
            name: "currency · string · required",
            detail:
              "Lowercase currency code. The initial contract covers usd and usdc, subject to account capabilities. Currency is not a payment rail; network and asset selection belong to the enabled crypto method."
          },
          {
            name: "merchant_reference · string",
            detail:
              "Your order or invoice reference, up to 255 characters. Persist it for reconciliation. It does not replace an idempotency key."
          },
          {
            name: "capture_method · string",
            detail:
              "automatic by default; manual only for methods that support separate authorization and capture. Unsupported combinations return 422."
          },
          {
            name: "metadata · object",
            detail:
              "Up to 20 string key/value pairs, with keys up to 40 characters and values up to 500. Never include sensitive payment or personal data."
          }
        ]
      },
      {
        id: "request-example",
        title: "Request and response",
        paragraphs: [
          "A new intent starts in requires_payment_method. Store its ID with your order and pass it to the checkout-session endpoint."
        ],
        example: createIntentExample
      },
      {
        id: "payment-lifecycle",
        title: "Payment lifecycle",
        paragraphs: [
          "Not every method follows every state. Cards may be authorized and captured separately, while an asynchronous bank payment can remain processing before its outcome is known."
        ],
        fields: [
          {
            name: "requires_payment_method",
            detail: "Waiting for a customer payment method. No funds have been collected."
          },
          {
            name: "requires_action",
            detail: "The customer must complete an authentication or authorization step through checkout."
          },
          { name: "processing", detail: "Submitted, but the result is not final. Do not assume success." },
          {
            name: "authorized",
            detail:
              "A manual-capture payment is authorized but not captured. Observe the authorization’s expires_at value when provided."
          },
          {
            name: "succeeded",
            detail:
              "Collection is confirmed under the method’s rules. This does not mean funds are settled, available for payout, or immune to disputes and reversals."
          },
          {
            name: "failed / canceled",
            detail:
              "Terminal outcomes. Inspect the failure code when present. A subsequent payment attempt uses a new intent."
          }
        ]
      },
      {
        id: "follow-up-operations",
        title: "Retrieve, capture, cancel, and refund",
        paragraphs: [
          "Reads require payments:read. Writes require payments:write and a new operation-specific idempotency key. Resources remain merchant- and environment-scoped. Invalid state transitions return 409."
        ],
        fields: [
          {
            name: "GET /api/v1/payment-intents/{id}",
            detail: "Retrieve the current payment state using the ID stored with your order."
          },
          {
            name: "POST /api/v1/payment-intents/{id}/capture",
            detail:
              "Capture an authorized intent. Body: amount (optional integer; defaults to the remaining authorized amount). Partial capture is allowed only where the method supports it."
          },
          {
            name: "POST /api/v1/payment-intents/{id}/cancel",
            detail:
              "Send an empty JSON object to cancel before collection where the method allows it. A pending asynchronous operation may not be cancelable."
          },
          {
            name: "POST /api/v1/refunds",
            detail:
              "Body: payment_intent_id and amount. Never exceed the remaining refundable amount. Refunds are separate resources with pending, succeeded, and failed states; creation is not proof of completion."
          }
        ]
      }
    ]
  },
  checkout: {
    title: "Checkout",
    description:
      "Bring customers into a payment flow connected to your order, your merchant capabilities, and a single payment intent.",
    endpoint: { method: "POST", path: apiPaths.checkoutSessions },
    sections: [
      {
        id: "checkout-session",
        title: "Create a hosted session",
        paragraphs: [
          "Requires checkout:write and an Idempotency-Key header. Create an intent first, then reference its ID. Both resources must belong to the same merchant and environment.",
          "Hosted checkout is the initial integration contract. Embedded checkout and browser SDKs will have their own contracts before release. Do not assume iframe support or install an unverified package."
        ],
        fields: [
          {
            name: "payment_intent_id · required",
            detail: "An intent in requires_payment_method. Its amount and currency cannot be overridden by the browser."
          },
          {
            name: "return_url · required",
            detail:
              "An absolute HTTPS URL on a return domain registered to your merchant. Acru appends session_id after the customer returns. This is not payment confirmation."
          },
          {
            name: "payment_methods · optional",
            detail:
              "Method families: card, bank, crypto, bnpl. The list must be a supported subset for the account, intent, and market. Omit it to use eligible account defaults."
          }
        ]
      },
      {
        id: "checkout-example",
        title: "Redirect to checkout",
        paragraphs: [
          "Return the session URL to your frontend and navigate the customer there. Never expose your API secret. Acru handles payment-detail collection and method eligibility."
        ],
        example: {
          samples: requestSamples(
            apiPaths.checkoutSessions,
            {
              payment_intent_id: "pi_example",
              return_url: "https://merchant.example/orders/1048/return",
              payment_methods: ["card"]
            },
            "order_1048_create_checkout"
          ),
          status: "201 Created · contract example",
          response: JSON.stringify(
            {
              id: "cs_example",
              object: "checkout_session",
              payment_intent_id: "pi_example",
              status: "open",
              url: "https://<provisioned-checkout-origin>/c/cs_example",
              expires_at: "2026-09-10T12:30:00Z",
              livemode: false
            },
            null,
            2
          ),
          note: "The URL and IDs are placeholders, not live destinations. Sessions expire after 30 minutes. After expiry, create a new session with a new key instead of replaying the previous creation request."
        }
      },
      {
        id: "checkout-return",
        title: "Handle the return",
        paragraphs: [
          "GET /api/v1/checkout/sessions/{id} requires payments:read. Session states are open, completed, and expired. Completed means the checkout interaction was submitted; asynchronous payment collection can still be processing.",
          "Retrieve the associated intent on your server and display a pending outcome when needed. Fulfill only after the payment’s outcome is confirmed by your server or a verified webhook."
        ]
      },
      {
        id: "payment-methods",
        title: "Methods, wallets, and networks",
        paragraphs: [
          "Card, bank, crypto, and buy-now-pay-later are method families, not promises of provider availability. Individual wallets, bank rails, networks, and BNPL providers must be explicitly enabled and documented as their adapters are added.",
          "USDC is an asset, not a rail. Crypto integrations must specify the supported network and confirmation policy. Do not infer wallet or provider support from a homepage animation or dashboard preview."
        ]
      }
    ]
  },
  webhooks: {
    title: "Webhooks",
    description:
      "Receive server-to-server payment events. Verify deliveries, record them durably, and make your event handling safe to repeat.",
    endpoint: { method: "POST", path: apiPaths.webhookEndpoints },
    sections: [
      {
        id: "register-endpoint",
        title: "Register a destination",
        paragraphs: [
          "Requires webhooks:write and an Idempotency-Key header. Register an HTTPS endpoint in the same environment as your integration. The signing secret is returned once on creation and must be stored server-side.",
          "This is the delivery contract to implement. The current dashboard and simulator do not send signed events."
        ],
        example: {
          samples: requestSamples(
            apiPaths.webhookEndpoints,
            {
              url: "https://merchant.example/webhooks/acru",
              events: ["payment_intent.succeeded", "payment_intent.failed"]
            },
            "register_primary_payment_webhook"
          ),
          status: "201 Created · contract example",
          response: JSON.stringify(
            {
              id: "we_example",
              object: "webhook_endpoint",
              url: "https://merchant.example/webhooks/acru",
              events: ["payment_intent.succeeded", "payment_intent.failed"],
              signing_secret: "<one-time-signing-secret>",
              livemode: false,
              enabled: true
            },
            null,
            2
          ),
          note: "Store the actual returned secret securely. This placeholder is not a credential. Test and live destinations use different signing secrets."
        }
      },
      {
        id: "signature-verification",
        title: "Verify the signature",
        paragraphs: [
          "The v0.1 contract defines Acru-Signature: t=<unix_seconds>,v1=<hex_digest>. The digest is HMAC-SHA256 over the ASCII timestamp, a literal period, and the exact raw UTF-8 request-body bytes. Use the endpoint’s signing secret as a UTF-8 key.",
          "Do not parse and reserialize JSON before verification. Require a timestamp within five minutes of your server clock and compare the 32-byte digest in constant time. During rotation, accept any valid v1 signature from an active endpoint secret. Reject missing, malformed, stale, or invalid signatures before processing."
        ],
        items: [
          "Preserve the raw request body before JSON middleware changes it.",
          "Verify the timestamp and HMAC against the active endpoint secret.",
          "Only then parse the event and enforce the merchant/environment association.",
          "Persist the event ID with a uniqueness constraint before applying business effects."
        ]
      },
      {
        id: "event-contract",
        title: "Events and payloads",
        paragraphs: [
          "Each event contains id, object: event, type, created_at (UTC RFC 3339), livemode, and data.object (the resource snapshot). The event retains its ID across retries. Each delivery receives a new signature timestamp."
        ],
        fields: [
          { name: "payment_intent.processing", detail: "An asynchronous method is awaiting its final outcome." },
          {
            name: "payment_intent.authorized",
            detail: "A manual-capture payment is authorized; collection is not complete."
          },
          {
            name: "payment_intent.succeeded / failed / canceled",
            detail: "The corresponding payment outcome. Match data.object.id to your stored order."
          },
          {
            name: "refund.succeeded / failed",
            detail: "A refund reached its reported outcome. Match the refund and its payment_intent_id."
          },
          {
            name: "checkout_session.completed / expired",
            detail: "The checkout interaction completed or expired. Neither event alone proves payment success."
          }
        ]
      },
      {
        id: "delivery-retries",
        title: "Acknowledgments and retries",
        paragraphs: [
          "Durably enqueue a verified event and return HTTP 2xx within five seconds. Process business logic asynchronously. Any non-2xx response or timeout is a failed delivery; redirects are not followed.",
          "The contract requires at-least-once delivery with exponential backoff for up to 72 hours. Exact delivery times are not guaranteed. Duplicates and out-of-order events are expected. Deduplicate by event ID and retrieve the resource when you need its current state.",
          "Keep failed business jobs in your own retry queue after acknowledging receipt. A 2xx acknowledgment stops Acru’s delivery retries; it does not confirm that your application completed its work."
        ]
      }
    ]
  },
  errors: {
    title: "Errors and retries",
    description:
      "Use stable error codes and request IDs to diagnose failures. Use persisted idempotency to make write retries safe.",
    sections: [
      {
        id: "error-contract",
        title: "Error responses",
        paragraphs: [
          "API errors contain error.type, error.code, error.message, and error.param when a field is responsible, plus request_id at the top level. The same ID is returned in x-request-id. Log status, code, and ID—not secrets or sensitive payment details."
        ],
        fields: [
          {
            name: "400 · invalid_request_error",
            detail: "Malformed JSON or request shape. Correct the request before retrying."
          },
          {
            name: "401 / 403 · authentication / permission error",
            detail: "Invalid credentials or insufficient scope. Correct access before retrying."
          },
          {
            name: "404 · resource_not_found",
            detail: "The resource is not available to this merchant and environment."
          },
          {
            name: "409 · conflict_error",
            detail:
              "Invalid state, idempotency_key_reused with a changed payload, or idempotency_in_progress. Only the in-progress case is retryable with the same key after Retry-After."
          },
          {
            name: "422 · validation_error",
            detail: "An unsupported field value, currency, or capability. Inspect code and param."
          },
          {
            name: "429 · rate_limit_error",
            detail: "Honor Retry-After (seconds), add jitter, and reuse the original operation key."
          },
          {
            name: "500 / 502 / 503 / 504 · api_error",
            detail:
              "The outcome may be unknown. Reconcile and retry only with the same idempotency key; do not create a second logical payment."
          }
        ]
      },
      {
        id: "validation-example",
        title: "Validation example",
        paragraphs: [
          "This request intentionally sets amount to zero. The expected response identifies the invalid field without creating an intent."
        ],
        example: {
          samples: requestSamples(
            apiPaths.paymentIntents,
            { ...paymentIntentRequest, amount: 0 },
            "order_1048_invalid_amount_test"
          ),
          status: "422 Unprocessable Entity · contract example",
          response: JSON.stringify(
            {
              error: {
                type: "validation_error",
                code: "invalid_amount",
                message: "Amount must be a positive integer in the currency's specified unit.",
                param: "amount"
              },
              request_id: "req_example"
            },
            null,
            2
          ),
          note: "This is the target API format. Current simulator and web-proxy errors differ and are not conformance tests for this contract."
        }
      },
      {
        id: "idempotency",
        title: "Idempotency",
        paragraphs: [
          "Send Idempotency-Key on every POST in this reference. Use a unique value per logical operation, up to 255 characters, and retain it with the payload. Creation, capture, cancellation, and refund each use different keys.",
          "The backend must persist keys for at least 24 hours, scoped to merchant, environment, method, and route. For the same key and payload, replay the stored response after the operation has been accepted. A changed payload returns 409 with idempotency_key_reused.",
          "Concurrent requests for a key already executing return idempotency_in_progress and Retry-After. Validation and authentication failures before acceptance do not consume the key. Coordinate financial effects with the operation record so retries cannot execute twice."
        ]
      },
      {
        id: "unknown-outcomes",
        title: "Unknown outcomes",
        paragraphs: [
          "A timeout does not prove failure: the backend or provider may have accepted the payment. Retry the exact request with its original key while valid, and reconcile against the stored intent or refund ID.",
          "After the retention window, do not blindly resubmit with a new key. Reconcile the resource ID and merchant reference first. Escalate unresolved outcomes with the request ID.",
          "The current web proxy forwards Idempotency-Key, but forwarding alone is not deduplication. Persisted backend idempotency is required before this integration processes real payments."
        ]
      }
    ]
  }
};
