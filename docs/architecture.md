# ACRU architecture

ACRU is an independent payment data plane and a Launchpad infrastructure tenant, similar to CRCL's tenant relationship
but with ACRU owning the payment technology itself.

```text
ACRU customers
  └─ ACRU Next.js web
       └─ ACRU NestJS API
            ├─ ACRU auth and authorization
            ├─ ACRU merchants and payment intents
            ├─ ACRU double-entry ledger and balances
            ├─ ACRU payouts, risk, disputes, and webhooks
            ├─ ACRU database and provider adapters
            └─ Launchpad control-plane adapter
                 ├─ tenant hosting and deployment
                 ├─ server usage and metering
                 ├─ security telemetry and platform policy
                 └─ infrastructure health and audit activity
```

## Ownership boundary

Launchpad must never be ACRU's payment system of record. Launchpad can provide reusable framework code and operational
services, but ACRU owns payment state, domain authorization, ledger entries, risk decisions, provider credentials,
webhook processing, and financial data retention. ACRU can evolve or deploy its payment backend without changing the
Launchpad control plane.

The web app calls only ACRU's API. The ACRU API calls Launchpad server-to-server with the `acru` tenant identity. This
prevents Launchpad's general product-payment endpoints from becoming accidental ACRU domain APIs.

## Repository boundaries

- `src/app`, `src/components`, `src/features` — ACRU Next.js product
- `src/lib/acru-api` — browser BFF policy and server-side ACRU API client
- `acru-backend/src/domains` — independently owned backend modules in the separate repository
- `acru-backend/src/platform` — outbound Launchpad control-plane adapter in that repository
- Local hosting registration and release evidence are kept outside the frontend source commit

The backend repository is https://github.com/hihellomynameis2000/acru-backend. The legacy local
`apps/api` scaffold is retained but ignored; frontend commands no longer depend on that workspace.
The diagram above describes the target architecture. Authentication, authorization, database
persistence, ledger posting, and provider integrations are still to be implemented.

The initial backend modules establish boundaries for merchants, payments, ledger, and risk. Persistence and provider
implementations should be added behind those modules rather than inside web route handlers.

## Financial invariants

- Store monetary amounts as integer minor units plus ISO currency.
- Require persisted idempotency keys for every retryable command.
- Keep ledger entries append-only and balanced; corrections use compensating entries.
- Verify, persist, and deduplicate provider webhooks before asynchronous processing.
- Keep provider and Launchpad credentials inside the ACRU API runtime.
- Emit usage/security telemetry to Launchpad without exporting sensitive financial payloads.
