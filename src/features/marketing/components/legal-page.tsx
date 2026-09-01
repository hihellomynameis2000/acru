import Link from "next/link";

import { LegalContent } from "@/features/marketing/components/legal-content";
import { LegalPrintButton, LegalTableOfContents } from "@/features/marketing/components/legal-navigation";
import { MarketingFooter, MarketingHeader } from "@/features/marketing/components/marketing-shell";
import { legalDocumentList, type LegalDocument } from "@/features/marketing/data/legal";

export function LegalPage({ document }: { document: LegalDocument }) {
  const navigationItems = document.sections.map((section) => ({ id: section.id, label: section.heading }));
  const relatedDocument = legalDocumentList.find((candidate) => candidate.slug !== document.slug);

  return (
    <div className="marketing-page legal-page">
      <MarketingHeader />
      <main>
        <article className="legal-document">
          <header className="legal-hero">
            <nav aria-label="Breadcrumb" className="legal-breadcrumb">
              <Link href="/">Acru</Link>
              <span aria-hidden="true">/</span>
              <Link href="/legal">Legal</Link>
            </nav>

            <div className="legal-hero-grid">
              <div>
                <p className="legal-eyebrow">Official policy</p>
                <h1>{document.title}</h1>
                <p className="legal-description">{document.description}</p>
              </div>

              <dl className="legal-metadata">
                <div>
                  <dt>Effective</dt>
                  <dd>{document.effectiveDate}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>
                    <time dateTime="2026-08-26">{document.updated}</time>
                  </dd>
                </div>
                <div>
                  <dt>Published by</dt>
                  <dd>{document.company}</dd>
                </div>
              </dl>
            </div>

            <div className="legal-hero-actions">
              <LegalPrintButton />
              <a href="mailto:legal@acru.com">Contact legal</a>
            </div>
          </header>

          <div className="legal-document-layout">
            <LegalTableOfContents items={navigationItems} />
            <div className="legal-policy-body">
              <section aria-labelledby="legal-introduction" className="legal-introduction">
                <h2 className="legal-visually-hidden" id="legal-introduction">
                  Introduction
                </h2>
                <LegalContent blocks={document.introduction} tableLabel={`${document.title} introduction`} />
              </section>

              {document.sections.map((section) => (
                <section className="legal-section" id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  <LegalContent blocks={section.blocks} tableLabel={`${section.heading} details`} />
                </section>
              ))}

              <div className="legal-end-mark" aria-hidden="true">
                End of policy
              </div>
            </div>
          </div>

          {relatedDocument ? (
            <aside className="legal-related" aria-labelledby="related-policy-heading">
              <div>
                <p>Related policy</p>
                <h2 id="related-policy-heading">{relatedDocument.title}</h2>
                <span>{relatedDocument.description}</span>
              </div>
              <Link href={`/legal/${relatedDocument.slug}`}>Read {relatedDocument.title.toLowerCase()}</Link>
            </aside>
          ) : null}
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
