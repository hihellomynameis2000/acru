import Image from "next/image";
import Link from "next/link";
import { ArrowDiagonalIcon } from "@shopify/polaris-icons";
import { articles, type Article } from "../data/articles";
import { LegalHeader } from "./legal-header";
import { LandingFooter } from "./landing-editorial";
import styles from "./article.module.css";

function Arrow() {
  return <ArrowDiagonalIcon aria-hidden="true" />;
}

function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  return (
    <article className={styles.card}>
      <Link href={`/articles/${article.slug}`} className={styles.cardImage} tabIndex={-1} aria-hidden="true">
        <Image
          src={article.hero.src}
          alt=""
          width={1200}
          height={900}
          priority={priority}
          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 31vw"
        />
      </Link>
      <div className={styles.cardMeta}>
        <span>{article.category}</span>
        <span>{article.readTime}</span>
      </div>
      <h2>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      <p>{article.summary}</p>
      <Link className={styles.textLink} href={`/articles/${article.slug}`}>
        Read article <Arrow />
      </Link>
    </article>
  );
}

function ArticleFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={`cinematic-page ${styles.shell}`}>
      <LegalHeader />
      {children}
      <LandingFooter onHomepage={false} />
    </div>
  );
}

export function ArticleIndex() {
  const [featured, ...more] = articles;

  return (
    <ArticleFrame>
      <main className={styles.indexMain}>
        <header className={styles.indexHero}>
          <p className={`${styles.eyebrow} ${styles.indexEyebrow}`}>Acru articles</p>
          <h1>Clarity for the systems behind every payment.</h1>
          <p className={styles.indexIntro}>
            Practical thinking for teams designing payment experiences, moving money, and operating what happens next.
          </p>
        </header>

        <section className={styles.featured} aria-labelledby="featured-article-heading">
          <Link href={`/articles/${featured.slug}`} className={styles.featuredImage} tabIndex={-1} aria-hidden="true">
            <Image
              src={featured.hero.src}
              alt=""
              width={1400}
              height={1050}
              priority
              sizes="(max-width: 760px) 92vw, 55vw"
            />
          </Link>
          <div className={styles.featuredCopy}>
            <div className={styles.cardMeta}>
              <span>{featured.category}</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 id="featured-article-heading">
              <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p>{featured.summary}</p>
            <Link className={styles.primaryLink} href={`/articles/${featured.slug}`}>
              Read the featured article <Arrow />
            </Link>
          </div>
        </section>

        <section className={styles.latest} aria-labelledby="latest-heading">
          <div className={styles.sectionTopline}>
            <div>
              <p className={styles.eyebrow}>From the field</p>
              <h2 id="latest-heading">More to explore</h2>
            </div>
            <p>Original guidance for product, engineering, finance, and operations teams.</p>
          </div>
          <div className={styles.cardGrid}>
            {more.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section className={styles.indexCta}>
          <p className={styles.eyebrow}>Have a payment question?</p>
          <h2>Bring us the flow you want to make clearer.</h2>
          <Link href="/demo">
            Talk to Acru <Arrow />
          </Link>
        </section>
      </main>
    </ArticleFrame>
  );
}

function TableOfContents({ article, mobile = false }: { article: Article; mobile?: boolean }) {
  const links = (
    <ol>
      {article.sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  if (mobile) {
    return (
      <details className={styles.mobileToc}>
        <summary>In this article</summary>
        {links}
      </details>
    );
  }

  return (
    <nav className={styles.desktopToc} aria-label="In this article">
      <p>In this article</p>
      {links}
    </nav>
  );
}

function RelatedRail({ article }: { article: Article }) {
  const related = articles.filter((candidate) => candidate.slug !== article.slug).slice(0, 2);

  return (
    <aside className={styles.resourceRail} aria-labelledby="related-rail-heading">
      <p id="related-rail-heading">Related articles</p>
      <div>
        {related.map((candidate) => (
          <Link key={candidate.slug} href={`/articles/${candidate.slug}`}>
            <Image
              src={candidate.hero.src}
              alt={candidate.hero.alt}
              width={480}
              height={252}
              sizes="(max-width: 760px) 92vw, (max-width: 1040px) 30vw, 240px"
            />
            <span>{candidate.category}</span>
            <strong>{candidate.title}</strong>
            <Arrow />
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function ArticleTemplate({ article }: { article: Article }) {
  const related = articles.filter((candidate) => candidate.slug !== article.slug).slice(0, 2);

  return (
    <ArticleFrame>
      <main className={styles.articleMain}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/articles">Articles</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{article.category}</span>
        </nav>

        <header className={styles.articleHero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{article.category}</p>
            <h1>{article.title}</h1>
            <p className={styles.heroSummary}>{article.summary}</p>
            <div className={styles.author}>
              <span className={styles.avatar} aria-hidden="true">
                {article.author.portrait ? (
                  <Image src={article.author.portrait} alt="" width={64} height={80} sizes="64px" />
                ) : (
                  article.author.initials
                )}
              </span>
              <span>
                <strong>{article.author.name}</strong>
                <small>{article.author.role}</small>
              </span>
            </div>
          </div>
          <figure className={styles.heroMedia}>
            <Image
              src={article.hero.src}
              alt={article.hero.alt}
              width={1400}
              height={1120}
              priority
              sizes="(max-width: 760px) 92vw, 47vw"
            />
            <figcaption>{article.hero.caption}</figcaption>
          </figure>
        </header>

        <TableOfContents article={article} mobile />

        <div className={styles.articleGrid}>
          <TableOfContents article={article} />

          <article className={styles.articleBody}>
            <div className={styles.articleDate}>
              <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
              <span>{article.readTime}</span>
            </div>

            {article.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.intro ? <p className={styles.lede}>{section.intro}</p> : null}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.image ? (
                  <figure className={styles.inlineMedia}>
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={1200}
                      height={900}
                      sizes="(max-width: 760px) 92vw, 680px"
                    />
                    <figcaption>{section.image.caption}</figcaption>
                  </figure>
                ) : null}
                {section.callout ? (
                  <aside className={styles.callout} aria-label={section.callout.label}>
                    <span>{section.callout.label}</span>
                    <h3>{section.callout.title}</h3>
                    <p>{section.callout.body}</p>
                  </aside>
                ) : null}
                {section.quote ? <blockquote>{section.quote}</blockquote> : null}
              </section>
            ))}
          </article>

          <RelatedRail article={article} />
        </div>

        <section className={styles.related} aria-labelledby="related-heading">
          <div className={styles.sectionTopline}>
            <div>
              <p className={styles.eyebrow}>Keep reading</p>
              <h2 id="related-heading">Related articles</h2>
            </div>
            <Link className={styles.textLink} href="/articles">
              View all articles <Arrow />
            </Link>
          </div>
          <div className={styles.cardGrid}>
            {related.map((candidate) => (
              <ArticleCard key={candidate.slug} article={candidate} />
            ))}
          </div>
        </section>
      </main>
    </ArticleFrame>
  );
}
