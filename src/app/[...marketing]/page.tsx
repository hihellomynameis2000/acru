import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productPages, publicMarketingPaths } from "@/features/marketing/data/product-pages";
import { MarketingResources, ProductLanding } from "@/features/marketing/components/product-landing";
import { CheckoutLanding } from "@/features/marketing/components/checkout-landing";
import { checkoutIntro } from "@/features/marketing/data/checkout-story";

type Props = { params: Promise<{ marketing: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return publicMarketingPaths.map((path) => ({ marketing: path.slice(1).split("/") }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = "/" + (await params).marketing.join("/");
  const page = productPages[path];
  return {
    title: `${page?.title || (path === "/faq" ? "FAQs" : "Guides & insights")} | Acru`,
    description:
      path === "/features/checkout"
        ? checkoutIntro
        : page?.intro || "Clear answers and practical payment guides from Acru.",
    alternates: { canonical: `https://acru.com${path}` }
  };
}
export default async function MarketingPage({ params }: Props) {
  const path = "/" + (await params).marketing.join("/");
  if (path === "/faq" || path === "/resources") return <MarketingResources faq={path === "/faq"} />;
  if (path === "/features/checkout") return <CheckoutLanding />;
  const page = productPages[path];
  if (!page) notFound();
  return <ProductLanding page={page} />;
}
