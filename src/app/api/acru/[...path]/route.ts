import { NextRequest, NextResponse } from "next/server";

import { isAllowedAcruApiPath, isSameOriginMutation } from "@/lib/acru-api/policy";
import { getServerEnv } from "@/lib/env";

type RouteContext = { params: Promise<{ path?: string[] }> };
const bodyMethods = new Set(["POST", "PATCH", "PUT", "DELETE"]);

async function handler(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  if (!isAllowedAcruApiPath(path)) return NextResponse.json({ error: "Unsupported ACRU API route" }, { status: 404 });
  if (bodyMethods.has(request.method) && !isSameOriginMutation(request.url, request.headers.get("origin"))) {
    return NextResponse.json({ error: "Cross-origin mutation rejected" }, { status: 403 });
  }

  const env = getServerEnv();
  const target = new URL(`/api/v1/${path.join("/")}${request.nextUrl.search}`, env.ACRU_API_URL);
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const headers = new Headers({ accept: "application/json", "x-request-id": requestId });
  for (const name of ["authorization", "cookie", "content-type", "idempotency-key"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (env.ACRU_WEB_SERVICE_TOKEN) headers.set("x-acru-service-token", env.ACRU_WEB_SERVICE_TOKEN);

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: bodyMethods.has(request.method) ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000)
    });
    const responseHeaders = new Headers({
      "cache-control": "no-store",
      "content-type": response.headers.get("content-type") ?? "application/json",
      "x-request-id": response.headers.get("x-request-id") ?? requestId
    });
    for (const cookie of response.headers.getSetCookie()) responseHeaders.append("set-cookie", cookie);
    return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return NextResponse.json(
      { error: timedOut ? "ACRU API timed out" : "ACRU API is unavailable" },
      { status: timedOut ? 504 : 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
