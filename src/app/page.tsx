import type { Metadata } from "next";

import { MarketingHome } from "@/features/marketing/components/marketing-home";

export const metadata: Metadata = {
  title: "Payments and money movement, unified",
  description:
    "Accept payments, protect revenue, and settle across card, bank, and digital-dollar rails through one connected platform.",
  openGraph: {
    title: "Acru — One system for every way money moves",
    description: "Payments, risk, settlement, and financial operations in one connected platform.",
    type: "website"
  },
  robots: { follow: true, index: true }
};

export default function HomePage() {
  return <MarketingHome />;
}
