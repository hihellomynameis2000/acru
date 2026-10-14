import type { Metadata } from "next";
import { IntegrationDirectory } from "@/features/marketing/components/integration-directory";
export const metadata: Metadata = {
  title: "Integrations",
  description: "Explore Acru’s commerce, billing, gateway and operations integrations."
};
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  return <IntegrationDirectory initialQuery={typeof q === "string" ? q : ""} />;
}
