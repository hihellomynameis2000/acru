import Image from "next/image";
import Link from "next/link";
import { ArrowDiagonalIcon } from "@shopify/polaris-icons";
import { LegalHeader } from "./legal-header";
import { LandingFooter } from "./landing-editorial";
import { LandingFaq } from "./landing-faq";
import { ClientCarousel } from "./client-carousel";
import { PaymentsReviews } from "./payments-reviews";
import { PaymentsMovement } from "./payments-movement";
import type { ProductPage } from "../data/product-pages";
import { getProductFaqs } from "../data/product-faqs";
import { landingFaqs, landingGuides } from "../data/editorial";

const artwork = {
  "card-gradient": [
    "/marketing/card-processing-directions/gradient-hero.webp",
    "/marketing/card-processing-directions/gradient-methods.webp",
    "/marketing/card-processing-directions/gradient-authorization.webp",
    "/marketing/card-processing-directions/gradient-intelligence.webp"
  ],
  accept: [
    "/marketing/payments-overview/checkout.webp",
    "/marketing/payments-overview/transactions.webp",
    "/marketing/payments-overview/authorization.webp",
    "/marketing/payments-overview/intelligence.webp"
  ],
  move: [
    "/marketing/guides/clarity-v1/payouts-sand.webp",
    "/marketing/payments-overview/transactions.webp",
    "/marketing/guides/clarity-v1/payouts-sand.webp",
    "/marketing/payments-overview/intelligence.webp"
  ],
  protect: [
    "/marketing/payments-overview/authorization.webp",
    "/marketing/payments-overview/transactions.webp",
    "/marketing/payments-overview/authorization.webp",
    "/marketing/payments-overview/intelligence.webp"
  ],
  platform: [
    "/marketing/guides/clarity-v1/platforms-lavender.webp",
    "/marketing/guides/clarity-v1/platforms-lavender.webp",
    "/marketing/payments-overview/transactions.webp",
    "/marketing/payments-overview/intelligence.webp"
  ]
};
const descriptions: Record<string, string> = {
  "checkout.webp": "Illustrative checkout with card, wallet, bank and crypto options",
  "transactions.webp": "Illustrative transaction list with payment methods and statuses",
  "authorization.webp": "Illustrative payment verification and authorization flow",
  "intelligence.webp": "Illustrative transaction status and intelligence cards",
  "payouts-sand.webp": "Sculpted payout channels connecting balances to a destination",
  "platforms-lavender.webp": "Connected channels distributing funds across a platform"
};
function Art({ src, hero = false }: { src: string; hero?: boolean }) {
  const filename = src.split("/").pop()!;
  const previewDescription = filename.endsWith("-hero.webp")
    ? descriptions["checkout.webp"]
    : filename.endsWith("-methods.webp")
      ? descriptions["transactions.webp"]
      : filename.endsWith("-authorization.webp")
        ? descriptions["authorization.webp"]
        : filename.endsWith("-intelligence.webp")
          ? descriptions["intelligence.webp"]
          : "";
  return (
    <div className={hero ? "pl-hero-frame po-art-frame" : "pl-feature-frame po-art-frame"}>
      <Image
        src={src}
        alt={descriptions[filename] || previewDescription}
        width={1300}
        height={1385}
        priority={hero}
        sizes="(max-width: 760px) 90vw, 40vw"
      />
    </div>
  );
}
export function MarketingFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`cinematic-page payments-overview product-landing ${className}`}>
      <LegalHeader />
      <main>{children}</main>
      <LandingFooter onHomepage={false} />
    </div>
  );
}
export function ProductLanding({
  page,
  artworkOverride,
  artworkElements
}: {
  page: ProductPage;
  artworkOverride?: readonly [string, string, string, string];
  artworkElements?: readonly [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode];
}) {
  const images = artworkOverride ?? artwork[page.theme];
  const faqs = getProductFaqs(page);
  return (
    <MarketingFrame
      className={page.theme === "card-gradient" && !artworkOverride && !artworkElements ? "pl-card-gradient" : ""}
    >
      <section className="po-hero po-container">
        <div className="po-copy">
          <h1>{page.headline}</h1>
          <p>{page.intro}</p>
          <div className="po-actions">
            <a className="po-button" href="#explore">
              Learn more
            </a>
            <Link className="po-button po-button-secondary" href="/demo">
              See a demo <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
        {artworkElements?.[0] ?? <Art src={images[0]} hero />}
      </section>
      <ClientCarousel showHeading={false} />
      <section className="po-features po-container" id="explore">
        <header className="po-section-heading">
          <h2>{page.section}</h2>
          <p>{page.summary}</p>
        </header>
        {page.features.map(([title, body], index) => (
          <div className={`po-feature ${index === 1 ? "po-feature-reverse" : ""}`} key={title}>
            {index === 1 && (artworkElements?.[index + 1] ?? <Art src={images[index + 1]} />)}
            <div className="po-copy">
              <h2>{title}</h2>
              <p>{body}</p>
              {index === 0 && (
                <Link className="po-button po-button-small po-button-secondary" href="/demo">
                  Explore the fit <span aria-hidden="true">›</span>
                </Link>
              )}
            </div>
            {index !== 1 && (artworkElements?.[index + 1] ?? <Art src={images[index + 1]} />)}
          </div>
        ))}
      </section>
      <PaymentsReviews />
      <PaymentsMovement />
      <section className="po-faq po-container">
        <h2>
          Frequently
          <br />
          asked questions
        </h2>
        <LandingFaq items={faqs} />
      </section>
      <section className="po-final">
        <h2>{page.closing}</h2>
        <p>{page.note}</p>
        <Link className="po-button" href="/demo">
          See a demo
        </Link>
      </section>
    </MarketingFrame>
  );
}

const guidePoints = [
  [
    [
      "Start with the customer",
      "Choose methods around the devices and markets your customers use. More options only help when the right ones are easy to find."
    ],
    [
      "Make the outcome clear",
      "Distinguish a payment in progress from a completed purchase. Tell customers what to do when a payment needs another step."
    ],
    [
      "Plan beyond checkout",
      "Keep transaction references connected to orders, refunds, and support. A good purchase experience continues after the button."
    ]
  ],
  [
    [
      "Check the destination",
      "Confirm recipient eligibility, country, currency, and supported rails before promising a delivery time."
    ],
    [
      "Compare the whole journey",
      "Consider funding cutoffs, availability, fees, and exception handling alongside network speed."
    ],
    [
      "Keep a traceable record",
      "Connect payout instructions to recipient records and available balances. Reconcile the final outcome, not just the send request."
    ]
  ],
  [
    [
      "Define the participants",
      "Map the buyer, seller, and platform before choosing the funds flow. Agree on ownership and responsibilities."
    ],
    [
      "Account for change",
      "Fees, refunds, and reversals should stay connected to the original sale and its allocations."
    ],
    [
      "Close with reconciliation",
      "Link seller balances to payout records. Give operations a way to explain where funds came from and where they went."
    ]
  ]
];
export function MarketingResources({ faq = false }: { faq?: boolean }) {
  return (
    <MarketingFrame>
      <header className="pl-resource-heading po-container">
        <h1>{faq ? "A little clarity.\nA better next step." : "A clearer view\nof your payment flow."}</h1>
        <p>{faq ? "The essentials, in plain language." : "Short guides for the decisions behind the payment."}</p>
      </header>
      {faq ? (
        <section className="po-container pl-faq-page">
          <LandingFaq items={landingFaqs} limit={null} />
        </section>
      ) : (
        <section className="po-container pl-guides">
          {landingGuides.map((guide, index) => (
            <article key={guide.slug} id={guide.slug}>
              <Image
                src={guide.image}
                alt={guide.alt}
                width={1200}
                height={800}
                sizes="(max-width: 760px) 90vw, 25vw"
              />
              <span>{guide.category}</span>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <details>
                <summary>
                  Read guide <ArrowDiagonalIcon aria-hidden="true" focusable="false" />
                </summary>
                {guidePoints[index].map(([title, text]) => (
                  <section key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </section>
                ))}
              </details>
            </article>
          ))}
        </section>
      )}
      <section className="po-final">
        <h2>Bring us the next question.</h2>
        <p>We’ll help connect the details to your business.</p>
        <Link className="po-button" href="/demo">
          See a demo
        </Link>
      </section>
    </MarketingFrame>
  );
}
