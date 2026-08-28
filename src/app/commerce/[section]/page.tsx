import { ProductsPage } from "@/features/products/components/products-page";
import { notFound, redirect } from "next/navigation";

export default async function CommerceSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section === "products") return <ProductsPage />;
  if (section === "checkout") redirect("/payments/checkout");
  if (section === "subscriptions") redirect("/payments/subscriptions");
  notFound();
}
