# Acru integration specification v0.1

Status: official forward-looking documentation; backend implementation pending.

The user explicitly requested documentation for the integration Acru will build, not an invented description of a
running API. The published documentation component is `src/features/developers/components/documentation-page.tsx`;
the canonical topic content and HTTP examples are in `src/features/developers/data/integration-documentation.ts`.
Changes remain local until a deployment is requested.

## Existing implementation boundary

- NestJS uses `/api/v1`. Payment, merchant, ledger, and risk modules are currently empty module boundaries.
- The Next.js `/api/acru/*` proxy forwards allowed requests and the `idempotency-key` header; it does not implement
  payment operations, authentication, persistence, or idempotency itself.
- `/api/sandbox/preflight` and `/api/sandbox/payment-intents` are simulators. Their prefix-only credential check and
  hard-coded outcomes are not the production contract.
- The API-key and webhook management screens contain demo state. They do not provision credentials or delivery.
- No SDK installation or assumed public API hostname is required by this specification.

## Contract decisions to implement

- Merchant- and environment-scoped bearer credentials, validated on the backend with explicit permissions.
- `/api/v1/account`, payment intents, hosted checkout sessions, refunds, and webhook destinations.
- JSON bodies; amounts as safe integer units (USD cents; USDC six-decimal atomic units). Account and method limits
  apply independently. Asset, network, wallet, and payment rail are not interchangeable.
- Newly created intents require a payment method; they do not immediately report success.
- Checkout references an existing intent. The hosted session returns to a registered HTTPS domain. Neither a return
  URL nor a completed session is proof of collected payment. Embedded checkout is outside the initial contract.
- `x-request-id` plus structured error codes; endpoint-specific scope and state validation.
- Persisted, merchant/environment/method/route-scoped idempotency for at least 24 hours. Same key with a changed
  payload returns 409. Concurrent in-progress operations return 409 with Retry-After. Forwarding a header is not enough.
- Raw-body webhook HMAC-SHA256 with `Acru-Signature`, timestamp tolerance of five minutes, constant-time verification,
  event-ID deduplication, at-least-once delivery, a five-second acknowledgment window, and backoff up to 72 hours.

These are newly defined implementation requirements, not verified capabilities of the existing runtime or a processor.
Before enabling a live integration, build and test the credential lifecycle, resource schemas, provider adapters,
ledger and reconciliation, state transitions, idempotency guarantees, and webhook delivery/security against this
contract. Expand the BFF allowlist only alongside authenticated handlers; currently account, checkout, refunds, and
webhook-endpoint namespaces are not allowed by it. Do not route the new docs to the simulator as a shortcut.

## Verification scope

Documentation tests cover every topic, dark-theme markup, valid section anchors, explicit implementation status, JSON
examples, and request construction with mocked HTTP. They do not certify a live payment backend. No live requests,
credential provisioning, or money movement are performed by these tests.

Local verification on 2026-09-10: 13 targeted documentation/legal/demo tests passed; new documentation files and the
route passed ESLint. An isolated Linux production build, including TypeScript, passed as
`acru:docs-dark-local-20260910`. Local `/developers/documentation` returned HTTP 200. No browser visual QA or deployment
was performed. A broader lint check also reported the pre-existing `setPage(1)` effect in the unrelated request-log
component; that behavior was left unchanged.
