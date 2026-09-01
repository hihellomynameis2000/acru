import type { Metadata } from "next";

import { LegalCenter } from "@/features/marketing/components/legal-center";

export const metadata: Metadata = {
  title: "Legal center",
  description: "Acru’s current terms of service, privacy policy, and legal contact information.",
  robots: { follow: true, index: true }
};

export default function LegalCenterPage() {
  return <LegalCenter />;
}
