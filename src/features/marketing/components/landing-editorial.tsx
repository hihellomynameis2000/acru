import { ChevronRightIcon } from "@shopify/polaris-icons";
import Image from "next/image";
import Link from "next/link";

import { LandingFaq } from "@/features/marketing/components/landing-faq";
import {
  editorialHref,
  footerDirectory,
  homepageFaqs,
  homepageHref,
  landingGuides
} from "@/features/marketing/data/editorial";
import { socialLinks } from "@/features/marketing/data/social";
import { articles } from "@/features/marketing/data/articles";

export function LandingEditorial() {
  return (
    <>
      <section
        className="landing-resources landing-container"
        id="resources"
        aria-labelledby="landing-resources-heading"
      >
        <div className="landing-editorial-topline">
          <div>
            <h2 id="landing-resources-heading">A little clarity goes a long way.</h2>
          </div>
        </div>
        <div className="landing-guide-grid">
          {landingGuides.map((guide) => {
            const article = articles.find((article) => article.slug === guide.articleSlug)!;
            return (
              <article className="landing-guide" key={guide.slug}>
                <Link
                  className="landing-guide-content"
                  href={`/articles/${guide.articleSlug}`}
                  aria-labelledby={`guide-${guide.slug}`}
                >
                  <div className="landing-guide-cover">
                    <Image
                      src={guide.image}
                      alt={guide.alt}
                      width={1200}
                      height={800}
                      sizes="(max-width: 700px) 90vw, (max-width: 1600px) 27vw, 410px"
                    />
                  </div>
                  <div className="landing-guide-meta">
                    <span>{guide.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 id={`guide-${guide.slug}`}>{article.title}</h3>
                  <p>{article.summary}</p>
                  <span className="landing-guide-read">
                    Read article <ChevronRightIcon aria-hidden="true" />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-faq landing-container" id="faq" aria-labelledby="landing-faq-heading">
        <div className="landing-faq-intro">
          <h2 id="landing-faq-heading">Frequently asked questions</h2>
        </div>
        <LandingFaq items={homepageFaqs} />
      </section>

      <section className="landing-next-chapter" aria-labelledby="landing-next-heading">
        <div className="landing-container">
          <h2 id="landing-next-heading">
            Your ambition.
            <br /> Our infrastructure.
          </h2>
          <p className="landing-next-copy">
            Bring us the payment flow you want to build. We’ll help connect the methods, markets, and moving parts.
          </p>
          <div className="cinematic-actions landing-next-actions">
            <Link href="/payments/overview" className="cinematic-primary landing-next-primary">
              Learn more
            </Link>
            <Link href="/demo" className="cinematic-secondary landing-next-secondary">
              See demo <ChevronRightIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function LandingFooter({ onHomepage = true }: { onHomepage?: boolean }) {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="landing-footer-topline">
          <Link href="/" aria-label="Acru home" className="landing-footer-brand">
            <Image src="/marketing/acru-wordmark.png" width={660} height={323} alt="Acru" sizes="110px" />
          </Link>
          <p>
            More possibility.
            <br />
            Less between you and it.
          </p>
          <nav className="landing-footer-socials" aria-label="Acru social media">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={`Acru on ${social.label}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </nav>
        </div>
        <nav className="landing-footer-directory" aria-label="Footer">
          {footerDirectory.map(({ title, links }) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>
                {links.map(([label, path]) => (
                  <li key={path}>
                    <a href={homepageHref(editorialHref(path), onHomepage)}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <ul className="landing-footer-compliance" aria-label="Compliance">
          <li aria-label="PCI DSS validated Level 1 service provider">
            <Image
              src="/marketing/compliance/v1/pci-dss-level-1.webp"
              alt="PCI DSS Validated Level 1 Service Provider"
              width={315}
              height={320}
              unoptimized
              loading="lazy"
            />
          </li>
          <li aria-label="SOC 2 Type II">
            <Image
              src="/marketing/compliance/v1/aicpa-soc.webp"
              alt="AICPA SOC for Service Organizations"
              width={320}
              height={320}
              unoptimized
              loading="lazy"
            />
          </li>
        </ul>
        <div className="landing-footer-fine">
          <p>© {new Date().getFullYear()} Acru, Inc.</p>
          <nav aria-label="Legal">
            <Link href="/legal/terms" prefetch={false}>
              Terms
            </Link>
            <Link href="/legal/privacy" prefetch={false}>
              Privacy
            </Link>
            <a href={homepageHref(editorialHref("/security"), onHomepage)}>Security</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
