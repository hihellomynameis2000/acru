import { notFound, redirect } from "next/navigation";
import { AcceptanceRatePage } from "@/features/reports/components/acceptance-rate-page";
import { AnalyticsPage, ExportsPage, StatementsPage, WalletPage } from "@/features/reports/components/reports-pages";

export default async function ReportsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (section === "analytics") return <AnalyticsPage />;
  if (section === "acceptance") return <AcceptanceRatePage />;
  if (section === "statements") return <StatementsPage />;
  if (section === "wallet") return <WalletPage />;
  if (section === "exports") return <ExportsPage />;
  if (section === "balance") redirect("/reports/wallet");

  notFound();
}
