import { NextResponse } from "next/server";

function requestId() {
  return `req_test_${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}`;
}

export async function GET(request: Request) {
  const id = requestId();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";

  if (!token.startsWith("sk_test_acru_")) {
    return NextResponse.json(
      { error: { type: "authentication_error", message: "Use a valid Acru test secret key." }, request_id: id },
      { status: 401, headers: { "X-Acru-Request-Id": id } }
    );
  }

  return NextResponse.json(
    {
      id: "acct_test_northstar",
      object: "account",
      name: "Northstar Studio",
      livemode: false,
      mode: "direct_api",
      capabilities: ["payments", "checkout", "customers", "subscriptions", "fiat_settlements", "usdc_settlements"],
      request_id: id
    },
    { headers: { "Cache-Control": "no-store", "X-Acru-Request-Id": id } }
  );
}
