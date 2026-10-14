import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTemplate } from "@/features/marketing/components/article-template";
import { articles, getArticle } from "@/features/marketing/data/articles";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};

  return {
    title: { absolute: `${article.title} | Acru` },
    description: article.summary,
    alternates: { canonical: `https://acru.com/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      publishedTime: article.publishedAt,
      images: [{ url: `https://acru.com${article.hero.src}`, alt: article.hero.alt }]
    },
    robots: { index: true, follow: true }
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return <ArticleTemplate article={article} />;
}
