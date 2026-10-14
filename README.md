# ACRU

Product UI work follows the [ACRU product design standard](docs/product-design.md).

ACRU is an independent payments operating system and a Launchpad infrastructure tenant. ACRU owns its web product,
payment backend, database, ledgers, provider integrations, and customer data. Launchpad supplies hosting, server usage,
security, telemetry, and shared backend framework primitives.

## Stack

- Next.js App Router, React, and strict TypeScript
- Separate ACRU-owned [NestJS API repository](https://github.com/hihellomynameis2000/acru-backend)
- Launchpad as the tenant control plane for hosting, usage, security, and platform operations
- Zod for runtime configuration validation
- Vitest, ESLint, and Prettier for local and CI validation
- Standalone Next.js output in a non-root multi-stage Docker image

## Local development

Use Node.js 24 for development and CI. Run the ACRU API and web app from their separate repositories.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The web app runs at `http://localhost:3000`; the standalone ACRU API defaults to `http://localhost:4000`.
Follow the backend repository's setup instructions separately. The old local `apps/api` directory
is retained for transition purposes but is excluded from frontend Git commits and builds.

## Commands

```bash
npm run dev          # local Next.js server
npm run test         # unit tests
npm run lint         # ESLint with Next.js rules
npm run typecheck    # strict TypeScript validation
npm run build        # production standalone build
npm run validate     # the complete CI gate
```

## Environment

Only `NEXT_PUBLIC_*` values may enter the browser bundle. Launchpad credentials are server-only.

```bash
ACRU_API_URL=http://localhost:4000
ACRU_WEB_SERVICE_TOKEN=
ACRU_ENVIRONMENT=development
NEXT_PUBLIC_ACRU_APP_URL=http://localhost:3000
```

## Backend contract

Server Components use `src/lib/acru-api/client.ts`. Browser interactions call the same-origin `/api/acru/*` gateway,
which forwards only ACRU product namespaces to ACRU's API. Only the standalone backend communicates with Launchpad's control plane.

The backend is currently a scaffold. Production authentication, tenant authorization, database persistence,
and payment processing are not implemented; do not treat demo sessions or API examples as live financial capabilities.

See [docs/architecture.md](docs/architecture.md) for system boundaries and contribution rules.
