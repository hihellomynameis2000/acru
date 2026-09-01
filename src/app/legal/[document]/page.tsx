import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/features/marketing/components/legal-page";
import { getLegalDocument, legalDocumentList } from "@/features/marketing/data/legal";

type LegalDocumentPageProps = {
  params: Promise<{ document: string }>;
};

export async function generateMetadata({ params }: LegalDocumentPageProps): Promise<Metadata> {
  const { document: documentSlug } = await params;
  const document = getLegalDocument(documentSlug);
  if (!document) return {};

  return {
    title: document.title,
    description: document.description,
    robots: { follow: true, index: true }
  };
}

export default async function LegalDocumentPage({ params }: LegalDocumentPageProps) {
  const { document: documentSlug } = await params;
  const document = getLegalDocument(documentSlug);
  if (!document) notFound();

  return <LegalPage document={document} />;
}

export function generateStaticParams() {
  return legalDocumentList.map((document) => ({ document: document.slug }));
}
