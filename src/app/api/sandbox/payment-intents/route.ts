import { NextResponse } from "next/server";

function requestId() {
  return `req_test_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
}

export async function POST(request: Request) {
  const id = requestId();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token.startsWith("sk_test_acru_")) {
    return NextResponse.json(
      { error: { type: "authentication_error", message: "Use a valid Acru test secret key." }, request_id: id },
      { status: 401, headers: { "X-Acru-Request-Id": id } }
    );
  }

  const body = (await request.json().catch(() => null)) as { amount?: number; currency?: string } | null;
  const amount = Number(body?.amount);
  const currency = body?.currency?.toLowerCase();
  if (!Number.isFinite(amount) || amount <= 0 || !currency || !["usd", "usdc"].includes(currency)) {
    return NextResponse.json(
      {
        error: { type: "invalid_request_error", message: "Amount must be positive and currency must be USD or USDC." },
        request_id: id
      },
      { status: 400, headers: { "X-Acru-Request-Id": id } }
    );
  }

  return NextResponse.json(
    {
      id: `pi_test_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`,
      object: "payment_intent",
      amount,
      currency,
      status: "succeeded",
      livemode: false,
      message: "Simulated successfully. No funds moved.",
      request_id: id
    },
    { status: 201, headers: { "Cache-Control": "no-store", "X-Acru-Request-Id": id } }
  );
}
