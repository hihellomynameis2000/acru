export type AcruPortal = "merchant" | "sandbox" | "partner" | "admin";

export function portalFromValue(value?: string | null): AcruPortal {
  if (value === "sandbox" || value === "partner" || value === "admin") return value;
  return "merchant";
}

export function portalForHostname(hostname: string): AcruPortal {
  const normalized = hostname.toLowerCase().split(":")[0];

  if (normalized === "sandbox-merchant.acrudevelopment.com") return "sandbox";
  if (normalized === "partners.acrudevelopment.com") return "partner";
  if (normalized === "admin.acrudevelopment.com") return "admin";
  return "merchant";
}

export function portalForLocation(hostname: string, pathname = ""): AcruPortal {
  const portal = portalForHostname(hostname);
  if (portal !== "merchant") return portal;

  if (pathname.startsWith("/sandbox")) return "sandbox";
  if (pathname.startsWith("/partners")) return "partner";
  if (pathname.startsWith("/admin")) return "admin";
  return "merchant";
}

export function portalQuery(portal: AcruPortal) {
  return portal === "merchant" ? "" : `?portal=${portal}`;
}

export function signInPathForPortal(portal: AcruPortal) {
  return `/sign-in${portalQuery(portal)}`;
}

export function signUpPathForPortal(portal: AcruPortal) {
  if (portal === "admin") return signInPathForPortal(portal);
  return `/sign-up${portalQuery(portal)}`;
}

export function forgotPasswordPathForPortal(portal: AcruPortal) {
  return `/forgot-password${portalQuery(portal)}`;
}

export function confirmationPathForPortal(portal: AcruPortal) {
  if (portal === "admin") return signInPathForPortal(portal);
  return `/confirm-email${portalQuery(portal)}`;
}

export function destinationForPortal(portal: AcruPortal, onboardingSubmitted = false) {
  if (portal === "sandbox") return "/sandbox";
  if (portal === "partner") return "/partners";
  if (portal === "admin") return "/admin";
  return onboardingSubmitted ? "/dashboard" : "/onboarding";
}

export const portalLabels: Record<AcruPortal, string> = {
  merchant: "Acru",
  sandbox: "Acru API sandbox",
  partner: "Acru Partners",
  admin: "Acru Admin"
};
