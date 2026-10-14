import type { Metadata } from "next";
import { ArticleIndex } from "@/features/marketing/components/article-template";

export const metadata: Metadata = {
  title: { absolute: "Articles | Acru" },
  description:
    "Practical thinking for teams designing payment experiences, moving money, and operating what happens next.",
  alternates: { canonical: "https://acru.com/articles" },
  openGraph: {
    type: "website",
    title: "Articles | Acru",
    description:
      "Practical thinking for teams designing payment experiences, moving money, and operating what happens next.",
    url: "https://acru.com/articles"
  },
  robots: { index: true, follow: true }
};

export default function ArticlesPage() {
  return <ArticleIndex />;
}
