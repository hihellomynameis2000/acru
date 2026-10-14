import { ApiKeysPage, VerifyConnectionPage } from "@/features/developers/components/developer-pages";
import { LogsPage } from "@/features/developers/components/developer-shell-pages";
import { DocumentationPage } from "@/features/developers/components/documentation-page";
import { WebhooksPage } from "@/features/developers/components/webhooks-page";
import { notFound } from "next/navigation";

export default async function DevelopersSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section === "api-keys") return <ApiKeysPage />;
  if (section === "verify-connection") return <VerifyConnectionPage />;
  if (section === "webhooks") return <WebhooksPage />;
  if (section === "logs") return <LogsPage />;
  if (section === "documentation") return <DocumentationPage />;
  notFound();
}
