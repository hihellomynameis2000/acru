# Demo request page

The homepage's “See a demo” / “See demo” buttons lead to `/demo`. The form collects contact and business details with explicit contact consent; it never implies an appointment has already been booked.

## Activation still required

No destination has been provided yet. Until one is configured, `/api/demo-request` returns HTTP 503 without reading, storing, or forwarding a lead. The form preserves the applicant's inputs and explains that scheduling is not connected.

Configure these server-only variables once the intended calendar/CRM destination is confirmed:

- `ACRU_DEMO_WEBHOOK_URL`: HTTPS lead-receiver endpoint, accepting JSON POSTs.
- `ACRU_DEMO_WEBHOOK_TOKEN`: optional bearer token for that receiver.
- `ACRU_DEMO_BOOKING_URL`: optional HTTPS calendar URL to show after successful lead delivery.

Webhook payload: `{ type: "demo.requested", source: "acru-homepage", submittedAt: ISODate, lead: { firstName, lastName, email, company, website, country, businessType, volume, message, contactConsent } }`.

The endpoint validates the same schema as the form, checks same-origin requests, caps the request body at 12 KB, and uses an eight-second delivery timeout without following redirects. It does not log applicant details or persist them to browser storage. A non-2xx delivery never triggers a success message. A calendar link is not an appointment confirmation.

Before public activation, configure the lead receiver's deduplication and abuse/rate controls (or enforce them at the reverse proxy), verify its data-retention policy, and test delivery to an approved test destination. A mailbox alone is not sufficient configuration: it needs an authorized mail or CRM delivery integration.

The page was published to acru.com on September 9, 2026. Delivery remains unconfigured; no real leads have been sent. See [the production release record](deployments/acru-production-2026-09-09.md).
