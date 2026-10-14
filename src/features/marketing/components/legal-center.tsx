import Link from "next/link";

import { LegalHeader } from "@/features/marketing/components/legal-header";
import { LandingFooter } from "@/features/marketing/components/landing-editorial";
import { legalDocumentList } from "@/features/marketing/data/legal";

export function LegalCenter() {
  return (
    <div className="marketing-page cinematic-page legal-page">
      <LegalHeader />
      <main className="legal-center">
        <header className="legal-center-hero">
          <p>Trust and transparency</p>
          <h1>Legal center</h1>
          <span>
            The policies that govern Acru’s platform and explain how we handle personal information across our services.
          </span>
        </header>

        <section aria-labelledby="legal-policies-heading" className="legal-center-policies">
          <div className="legal-center-section-heading">
            <p>Current documents</p>
            <h2 id="legal-policies-heading">Acru policies</h2>
          </div>

          <div className="legal-center-grid">
            {legalDocumentList.map((document) => (
              <article key={document.slug}>
                <div>
                  <span>{document.sections.length} sections</span>
                  <span>Updated {document.updated}</span>
                </div>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <Link href={`/legal/${document.slug}`}>Read {document.title.toLowerCase()}</Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="legal-contact-heading" className="legal-center-contact">
          <div>
            <p>Policy questions</p>
            <h2 id="legal-contact-heading">Contact Acru Legal</h2>
            <span>For privacy requests, legal notices, or questions about these policies.</span>
          </div>
          <div>
            <a href="mailto:legal@acru.com">legal@acru.com</a>
            <address>
              Acru, Inc.
              <br />
              8 The Greene STE A
              <br />
              Dover, Delaware 19901
              <br />
              United States
            </address>
          </div>
        </section>
      </main>
      <LandingFooter onHomepage={false} />
    </div>
  );
}
