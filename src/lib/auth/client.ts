import { destinationForPortal } from "@/lib/portal";
import type { AcruPortal } from "@/lib/portal";

export const ACRU_SESSION_KEY = "acru-session";
export const ACRU_PENDING_EMAIL_KEY = "acru-pending-email";
export const ACRU_PENDING_PORTAL_KEY = "acru-pending-portal";
export const ACRU_ONBOARDING_KEY = "acru-onboarding";

export type AcruSession = {
  email: string;
  name?: string;
  provider: "email" | "google";
  verified: boolean;
  portal?: AcruPortal;
};

export type AcruOnboardingState = {
  step: number;
  submitted: boolean;
  businessName?: string;
  dba?: string;
  settlement?: "bank" | "usdc" | "credits";
};

export function readSession(): AcruSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(ACRU_SESSION_KEY);
    return value ? (JSON.parse(value) as AcruSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AcruSession) {
  window.localStorage.setItem(ACRU_SESSION_KEY, JSON.stringify(session));
}

export function readOnboarding(): AcruOnboardingState {
  if (typeof window === "undefined") return { step: 0, submitted: false };
  try {
    const value = window.localStorage.getItem(ACRU_ONBOARDING_KEY);
    return value ? (JSON.parse(value) as AcruOnboardingState) : { step: 0, submitted: false };
  } catch {
    return { step: 0, submitted: false };
  }
}

export function saveOnboarding(state: AcruOnboardingState) {
  window.localStorage.setItem(ACRU_ONBOARDING_KEY, JSON.stringify(state));
}

export function destinationForSession(portal: AcruPortal = "merchant") {
  return destinationForPortal(portal, readOnboarding().submitted);
}
