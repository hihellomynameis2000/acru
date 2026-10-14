export const acruApiNamespaces = new Set([
  "auth",
  "balances",
  "ledger",
  "merchants",
  "payment-intents",
  "payments",
  "payouts",
  "risk"
]);

const safeSegment = /^[a-zA-Z0-9._~-]+$/;

export function isAllowedAcruApiPath(path: string[]) {
  return (
    path.length > 0 &&
    acruApiNamespaces.has(path[0]) &&
    path.every((segment) => segment !== "." && segment !== ".." && safeSegment.test(segment))
  );
}

export function isSameOriginMutation(requestUrl: string, origin: string | null) {
  return origin === null || origin === new URL(requestUrl).origin;
}
