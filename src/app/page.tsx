import type { Metadata } from "next";

import { MarketingHome } from "@/features/marketing/components/marketing-home";

export const metadata: Metadata = {
  title: "Payments infrastructure, built for scale",
  description:
    "Accept cards, Apple Pay, Google Pay, PayPal, local payments, and buy now, pay later. Connect payment acceptance, risk, and settlement with Acru.",
  openGraph: {
    title: "Acru — Payments infrastructure, built for scale",
    description: "Payments, risk, settlement, and financial operations in one connected platform.",
    type: "website"
  },
  robots: { follow: true, index: true }
};

export default function HomePage() {
  return <MarketingHome />;
}
