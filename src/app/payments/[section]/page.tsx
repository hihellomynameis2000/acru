import { notFound } from "next/navigation";

import { CustomersPage } from "@/features/customers/components/customers-page";
import { DisputesPage } from "@/features/disputes/components/disputes-page";
import { PayoutsPage } from "@/features/payouts/components/payouts-page";
import {
  CheckoutPage,
  InvoicesPage,
  PaymentLinksPage,
  RefundsPage
} from "@/features/payment-operations/components/payment-operations-pages";
import { SubscriptionsPage } from "@/features/payment-operations/components/subscriptions-page";
import { TransactionsPage } from "@/features/transactions/components/transactions-page";

export default async function PaymentsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section === "customers") return <CustomersPage />;
  if (section === "transactions") return <TransactionsPage />;
  if (section === "subscriptions") return <SubscriptionsPage />;
  if (section === "checkout") return <CheckoutPage />;
  if (section === "payouts") return <PayoutsPage />;
  if (section === "disputes") return <DisputesPage />;
  if (section === "refunds") return <RefundsPage />;
  if (section === "payment-links") return <PaymentLinksPage />;
  if (section === "invoices") return <InvoicesPage />;
  notFound();
}
