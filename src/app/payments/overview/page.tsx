import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LegalHeader } from "@/features/marketing/components/legal-header";
import { ClientCarousel } from "@/features/marketing/components/client-carousel";
import { LandingFaq } from "@/features/marketing/components/landing-faq";
import { LandingFooter } from "@/features/marketing/components/landing-editorial";
import { PaymentsReviews } from "@/features/marketing/components/payments-reviews";
import { PaymentsMovement } from "@/features/marketing/components/payments-movement";

export const metadata: Metadata = {
  title: "Payments overview | Acru",
  description:
    "Accept payments and control what happens next. Connect payment methods, authentication, and transaction visibility with Acru.",
  robots: { index: true, follow: true }
};

const assets = "/marketing/card-processing-directions/";
function TransactionsArtwork() {
  return (
    <div className="po-art-frame">
      <Image
        src={`${assets}gradient-methods.webp`}
        width={1770}
        height={1560}
        alt="Card transactions alongside Apple Pay, Bitcoin, Google Pay, Mastercard, USDC and Visa payment options"
        loading="lazy"
        sizes="(max-width: 760px) 90vw, 40vw"
      />
    </div>
  );
}

export default function PaymentsOverviewPage() {
  return (
    <div className="cinematic-page payments-overview po-gradient-overview">
      <LegalHeader />
      <main>
        <section className="po-hero po-container">
          <div className="po-copy">
            <h1>
              Accept payments, control
              <br className="po-desktop-break" /> what happens next
            </h1>
            <p>Bring the ways your customers pay into one connected payment experience.</p>
            <div className="po-actions">
              <a className="po-button" href="#payment-methods">
                Learn more
              </a>
              <Link className="po-button po-button-secondary" href="/demo">
                See a demo <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
          <Image
            className="po-hero-art"
            src={`${assets}gradient-hero.webp`}
            width={1752}
            height={1597}
            alt="Acru checkout with card, bank account, Apple Pay and Google Pay options"
            priority
            sizes="(max-width: 760px) 90vw, 40vw"
          />
        </section>
        <ClientCarousel showHeading={false} />
        <section className="po-features po-container" id="payment-methods">
          <header className="po-section-heading">
            <h2>More ways to pay, less to operate</h2>
            <p>
              One payment layer for the methods your customers expect and the
              <br className="po-desktop-break" /> operation behind them.
            </p>
          </header>
          <div className="po-feature">
            <div className="po-copy">
              <h2>
                Cards, wallets and
                <br /> bank payments.
              </h2>
              <p>
                Accept supported card, wallet, bank and alternative payment methods while keeping transactions connected
                through Acru.
              </p>
              <Link className="po-button po-button-small po-button-secondary" href="/features/card-processing">
                Explore Payments <span aria-hidden="true">›</span>
              </Link>
            </div>
            <TransactionsArtwork />
          </div>
          <div className="po-feature po-feature-reverse">
            <div className="po-art-frame">
              <Image
                src={`${assets}gradient-authorization.webp`}
                width={1770}
                height={1560}
                alt="A payment passes identity verification, device analysis, 3DS, risk checks and authorization"
                loading="lazy"
                sizes="(max-width: 760px) 90vw, 40vw"
              />
            </div>
            <div className="po-copy">
              <h2>
                See every decision
                <br /> behind a payment.
              </h2>
              <p>
                Follow a transaction through authentication, authorization, capture, and completion with the status and
                context your team needs at every stage.
              </p>
            </div>
          </div>
          <div className="po-feature">
            <div className="po-copy">
              <h2>
                Every transaction tells
                <br /> you what happens next.
              </h2>
              <p>
                Search payment activity, inspect authorization outcomes, issue refunds, review disputes, and surface
                transactions that need attention.
              </p>
            </div>
            <div className="po-art-frame">
              <Image
                src={`${assets}gradient-intelligence.webp`}
                width={1770}
                height={1560}
                alt="An $18,420 Northstar transaction with its payment status and an Acru Intelligence analysis"
                loading="lazy"
                sizes="(max-width: 760px) 90vw, 40vw"
              />
            </div>
          </div>
        </section>
        <PaymentsReviews />
        <PaymentsMovement />
        <section className="po-faq po-container">
          <h2>
            Frequently
            <br /> asked questions
          </h2>
          <LandingFaq />
        </section>
        <section className="po-final">
          <h2>
            Build a better way
            <br />
            to get paid.
          </h2>
          <p>
            More control at every stage, without more
            <br className="po-desktop-break" /> systems to operate.
          </p>
          <div className="po-actions">
            <Link className="po-button" href="/demo">
              See a demo
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter onHomepage={false} />
    </div>
  );
}
