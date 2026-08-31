import Link from "next/link";

import { MarketingFooter, MarketingHeader } from "@/features/marketing/components/marketing-shell";
import type { LegalDocument } from "@/features/marketing/data/legal";

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className="marketing-page legal-page">
      <MarketingHeader />
      <main>
        <article className="legal-document">
          <header>
            <Link href="/">Acru</Link>
            <span aria-hidden="true">/</span>
            <span>Legal</span>
            <h1>{document.title}</h1>
            <p>{document.description}</p>
            <time>Last updated {document.updated}</time>
          </header>

          <div className="legal-document-body">
            <aside>
              <p>In this policy</p>
              {document.sections.map((section) => (
                <a href={`#${section.heading.toLowerCase().replaceAll(" ", "-")}`} key={section.heading}>
                  {section.heading}
                </a>
              ))}
            </aside>
            <div>
              {document.sections.map((section) => (
                <section id={section.heading.toLowerCase().replaceAll(" ", "-")} key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
