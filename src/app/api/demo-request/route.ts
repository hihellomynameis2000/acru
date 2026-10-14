import { NextResponse } from "next/server";
import { demoRequestSchema } from "@/features/marketing/data/demo-request";

export const runtime = "nodejs";

const reply = (body: object, status: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" }
  });

function configuredHttpsUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // No lead is collected or reported as received until a real destination is configured.
  const destination = configuredHttpsUrl(process.env.ACRU_DEMO_WEBHOOK_URL);
  if (!destination) return reply({ accepted: false, error: "not_configured" }, 503);

  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return reply({ accepted: false, error: "invalid_origin" }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return reply({ accepted: false, error: "invalid_content_type" }, 415);
  }

  const limit = 12_000;
  if (Number(request.headers.get("content-length")) > limit) {
    return reply({ accepted: false, error: "request_too_large" }, 413);
  }

  let value: unknown;
  try {
    // Bound streamed requests too, rather than trusting Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply({ accepted: false, error: "invalid_request" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      size += chunk.byteLength;
      if (size > limit) {
        await reader.cancel();
        return reply({ accepted: false, error: "request_too_large" }, 413);
      }
      chunks.push(chunk);
    }
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply({ accepted: false, error: "invalid_request" }, 400);
  }

  const parsed = demoRequestSchema.safeParse(value);
  if (!parsed.success) return reply({ accepted: false, error: "invalid_details" }, 400);

  try {
    // The honeypot is only an abuse check, not part of the applicant's record.
    const lead = { ...parsed.data, companyFax: undefined };
    const response = await fetch(destination, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ACRU_DEMO_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.ACRU_DEMO_WEBHOOK_TOKEN}` }
          : {})
      },
      body: JSON.stringify({
        type: "demo.requested",
        source: "acru-homepage",
        submittedAt: new Date().toISOString(),
        lead
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8_000)
    });
    if (!response.ok) return reply({ accepted: false, error: "delivery_failed" }, 502);
  } catch {
    return reply({ accepted: false, error: "delivery_failed" }, 502);
  }

  return reply({ accepted: true, bookingUrl: configuredHttpsUrl(process.env.ACRU_DEMO_BOOKING_URL) }, 200);
}
