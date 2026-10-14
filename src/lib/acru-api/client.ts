import "server-only";

import { getServerEnv } from "@/lib/env";

export class AcruApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly requestId?: string
  ) {
    super(message);
    this.name = "AcruApiError";
  }
}

export class AcruApiClient {
  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const env = getServerEnv();
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    headers.set("x-request-id", headers.get("x-request-id") ?? crypto.randomUUID());
    if (env.ACRU_WEB_SERVICE_TOKEN) headers.set("x-acru-service-token", env.ACRU_WEB_SERVICE_TOKEN);

    const response = await fetch(new URL(path, env.ACRU_API_URL), {
      ...init,
      headers,
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(10_000)
    });
    const payload = (await response.json()) as T & { message?: string | string[] };
    if (!response.ok) {
      const message = Array.isArray(payload.message) ? payload.message.join(", ") : payload.message;
      throw new AcruApiError(message ?? `ACRU API request failed with status ${response.status}`, response.status);
    }
    return payload;
  }
}

export function createAcruApiClient() {
  return new AcruApiClient();
}
