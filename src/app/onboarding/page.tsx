import type { Metadata } from "next";

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export const metadata: Metadata = { title: "Set up your workspace" };

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
