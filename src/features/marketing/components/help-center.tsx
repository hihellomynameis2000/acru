import Link from "next/link";
import { ArrowDiagonalIcon, ArrowLeftIcon } from "@shopify/polaris-icons";
import { LegalHeader } from "./legal-header";
import { LandingFooter } from "./landing-editorial";
import { HelpSearch } from "./help-search";
import { helpArticles, type HelpArticle } from "../data/help-articles";
import styles from "./help-center.module.css";

function HelpFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={`cinematic-page ${styles.shell}`}>
      <LegalHeader />
      <main>{children}</main>
      <LandingFooter onHomepage={false} />
    </div>
  );
}

export function HelpIndex() {
  return (
    <HelpFrame>
      <div className={styles.index}>
        <header className={styles.hero}>
          <span>Acru Help</span>
          <h1>What can we help you with?</h1>
          <p>Practical answers for checkout and payment operations.</p>
        </header>
        <HelpSearch />
        <div className={styles.contact}>
          <h2>Planning an integration?</h2>
          <p>Start with the integration options and developer documentation.</p>
          <Link href="/features/checkout">
            Explore Checkout <ArrowDiagonalIcon className={styles.arrow} aria-hidden="true" focusable="false" />
          </Link>
          <Link href="/developers/documentation">
            Developer docs <ArrowDiagonalIcon className={styles.arrow} aria-hidden="true" focusable="false" />
          </Link>
        </div>
      </div>
    </HelpFrame>
  );
}

export function HelpArticlePage({ article }: { article: HelpArticle }) {
  return (
    <HelpFrame>
      <div className={styles.articleWrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/help">Acru Help</Link>
          <span aria-hidden="true">/</span>
          <span>{article.category}</span>
        </nav>
        <div className={styles.articleLayout}>
          <article className={styles.article}>
            <header>
              <span className={styles.category}>{article.category}</span>
              <h1>{article.title}</h1>
              <p className={styles.summary}>{article.summary}</p>
              <div className={styles.metadata}>
                <span>Article {article.number}</span>
                <span>Acru product guide</span>
              </div>
            </header>
            {article.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.steps && (
                  <ol>
                    {section.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <footer className={styles.articleFooter}>
              <Link href="/help">
                <ArrowLeftIcon className={styles.arrow} aria-hidden="true" focusable="false" /> All help articles
              </Link>
              <Link href="/developers/documentation">
                Developer documentation{" "}
                <ArrowDiagonalIcon className={styles.arrow} aria-hidden="true" focusable="false" />
              </Link>
            </footer>
          </article>
          <aside className={styles.sidebar}>
            <Link className={styles.searchLink} href="/help">
              Search help articles <ArrowDiagonalIcon className={styles.arrow} aria-hidden="true" focusable="false" />
            </Link>
            <nav aria-label="On this page">
              <h2>On this page</h2>
              {article.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.title}
                </a>
              ))}
            </nav>
            <nav aria-label="Related articles">
              <h2>Related articles</h2>
              {helpArticles
                .filter((item) => item.slug !== article.slug)
                .map((item) => (
                  <Link key={item.slug} href={`/help/${item.slug}`}>
                    {item.title}
                  </Link>
                ))}
            </nav>
          </aside>
        </div>
      </div>
    </HelpFrame>
  );
}
