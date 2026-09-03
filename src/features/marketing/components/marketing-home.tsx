import Image from "next/image";
import Link from "next/link";

import { MarketingFooter, MarketingHeader } from "@/features/marketing/components/marketing-shell";
import { PlatformCarousel } from "@/features/marketing/components/platform-carousel";
import { ScrollRevealCopy } from "@/features/marketing/components/scroll-reveal-copy";
import { controlFeatures, paymentLifecycle, platformRails } from "@/features/marketing/data/marketing";

export function MarketingHome() {
  return (
    <div className="marketing-page marketing-home-v2">
      <MarketingHeader />

      <main>
        <section className="marketing-hero" aria-labelledby="marketing-hero-title">
          <div className="marketing-hero-copy">
            <p className="marketing-hero-kicker">Payments and money movement, unified</p>
            <h1 id="marketing-hero-title">One system for every way money moves.</h1>
            <p className="marketing-hero-description">
              Accept payments, protect revenue, and settle globally across cards, bank rails, and digital dollars—all
              through Acru.
            </p>
            <div className="marketing-hero-actions">
              <Link className="marketing-primary-action" href="/sign-up">
                Apply now
              </Link>
              <a className="marketing-secondary-action" href="mailto:sales@acru.com?subject=Acru%20platform%20demo">
                Talk to sales
              </a>
            </div>
          </div>

          <div className="marketing-product-stage" aria-label="Acru merchant operations console preview">
            <div className="marketing-product-window">
              <div className="marketing-product-window-bar" aria-hidden="true">
                <span>
                  <i /> Acru Console
                </span>
                <small>Live operations</small>
              </div>
              <Image
                alt="Acru merchant console showing payment performance and balances"
                className="marketing-product-image"
                height={982}
                priority
                sizes="(max-width: 760px) 94vw, (max-width: 1100px) 86vw, 940px"
                src="/marketing/merchant-dashboard.png"
                width={1124}
              />
            </div>
            <div className="marketing-hero-event marketing-hero-event--payment">
              <span>Payment approved</span>
              <strong>$8,384.34</strong>
              <small>Card · authenticated</small>
            </div>
            <div className="marketing-hero-event marketing-hero-event--settlement">
              <span>Settlement ready</span>
              <strong>$284,913.20</strong>
              <small>Bank or USDC</small>
            </div>
          </div>
        </section>

        <section className="marketing-rail-section" aria-labelledby="marketing-rail-heading">
          <p id="marketing-rail-heading">
            Connect the payment methods customers use with the rails your business needs.
          </p>
          <div>
            {platformRails.map((rail) => (
              <span key={rail.alt}>
                <Image alt={rail.alt} height={32} src={rail.src} width={72} />
              </span>
            ))}
          </div>
        </section>

        <section className="marketing-intro" id="about">
          <ScrollRevealCopy>
            Acru connects checkout, risk, ledgering, settlement, and financial operations so revenue can move through
            one dependable system.
          </ScrollRevealCopy>
        </section>

        <PlatformCarousel />

        <section className="marketing-money-section" id="money-movement" aria-labelledby="money-movement-heading">
          <div className="marketing-section-heading marketing-money-heading">
            <p>Money movement</p>
            <h2 id="money-movement-heading">Global settlement without a patchwork of providers.</h2>
            <div>
              Route payouts and merchant settlements across bank accounts and USDC while keeping the operational record
              in one place.
            </div>
          </div>

          <div className="marketing-money-visual" aria-label="Acru routes funds between payment and settlement rails">
            <div className="marketing-money-sources">
              <span>Cards</span>
              <span>Bank payments</span>
              <span>Digital dollars</span>
            </div>
            <div className="marketing-money-core">
              <Image alt="" height={186} src="/acru-logo.png" width={220} />
              <strong>Acru ledger</strong>
              <small>Policy · routing · reconciliation</small>
            </div>
            <div className="marketing-money-destinations">
              <span>Merchant balance</span>
              <span>Bank settlement</span>
              <span>USDC wallet</span>
            </div>
          </div>

          <div className="marketing-money-points">
            <article>
              <span>01</span>
              <h3>One integration</h3>
              <p>Model each payment once instead of rebuilding business logic for every rail and provider.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Configurable settlement</h3>
              <p>Control destinations, schedules, reserves, and payout rules from the same operating layer.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Continuous visibility</h3>
              <p>Track where funds are, what changed, and what needs attention before close.</p>
            </article>
          </div>
        </section>

        <section className="marketing-developer-section" id="developers" aria-labelledby="developer-heading">
          <div className="marketing-developer-copy">
            <p>Built for your product</p>
            <h2 id="developer-heading">Shape the customer experience. Keep the hard parts connected.</h2>
            <div>
              Use hosted components when speed matters or build a custom flow with APIs. Acru keeps the same lifecycle
              across both.
            </div>
            <a href="mailto:developers@acru.com?subject=Acru%20developer%20access">Request developer access</a>
          </div>

          <div className="marketing-code-card" aria-label="Acru payment API request and lifecycle">
            <div className="marketing-code-card-bar">
              <span>payment_intent.json</span>
              <small>API</small>
            </div>
            <pre>
              <code>{`POST /v1/payment_intents
{
  "amount": 12545,
  "currency": "usd",
  "settlement": {
    "destination": "merchant_balance"
  }
}`}</code>
            </pre>
            <ol>
              {paymentLifecycle.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="marketing-trust-section" id="security" aria-labelledby="security-heading">
          <div className="marketing-section-heading marketing-trust-copy">
            <p>Operational control</p>
            <h2 id="security-heading">Give every action the right level of access and review.</h2>
            <div>
              Permissions, approvals, authentication, and activity history are part of the operating model—not an
              afterthought.
            </div>
          </div>
          <div className="marketing-control-grid">
            {controlFeatures.map((feature, index) => (
              <article key={feature.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-final-cta">
          <div>
            <p>Build on Acru</p>
            <h2>Make payment infrastructure a product advantage.</h2>
          </div>
          <div className="marketing-final-cta-actions">
            <Link className="marketing-final-cta-action" href="/sign-up">
              Apply now
            </Link>
            <a href="mailto:sales@acru.com?subject=Acru%20platform%20demo">Talk to sales</a>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
