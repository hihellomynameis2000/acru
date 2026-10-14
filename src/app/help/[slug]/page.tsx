import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticlePage } from "@/features/marketing/components/help-center";
import { helpArticles } from "@/features/marketing/data/help-articles";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return helpArticles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = helpArticles.find((item) => item.slug === slug);
  return { title: article?.title ?? "Help", description: article?.summary };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = helpArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <HelpArticlePage article={article} />;
}
