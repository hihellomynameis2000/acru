import type { Metadata } from "next";

import { MarketingHome } from "@/features/marketing/components/marketing-home";

export const metadata: Metadata = {
  title: "Payments infrastructure, built for scale",
  description:
    "Acru combines payments, billing, payouts, reporting, and financial operations into one unified platform.",
  openGraph: {
    title: "Acru — Payments infrastructure, built for scale",
    description: "Accept payments and operate your business from one connected financial platform.",
    type: "website"
  },
  robots: { follow: true, index: true }
};

export default function HomePage() {
  return <MarketingHome />;
}
