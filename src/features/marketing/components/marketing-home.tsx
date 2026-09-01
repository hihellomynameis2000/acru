import Image from "next/image";
import Link from "next/link";

import { MarketingFooter, MarketingHeader } from "@/features/marketing/components/marketing-shell";
import { PlatformCarousel } from "@/features/marketing/components/platform-carousel";
import { ScrollRevealCopy } from "@/features/marketing/components/scroll-reveal-copy";
import { operatingPrinciples } from "@/features/marketing/data/marketing";

export function MarketingHome() {
  return (
    <div className="marketing-page">
      <MarketingHeader />

      <main>
        <section className="marketing-hero" aria-labelledby="marketing-hero-title">
          <div className="marketing-hero-copy">
            <h1 id="marketing-hero-title">
              Payments infrastructure,
              <span>built for scale.</span>
            </h1>
            <p className="marketing-hero-description">
              Sell products. Build communities. Accept payments.
              <br /> Manage your business—from one platform.
            </p>
            <div className="marketing-hero-actions">
              <Link className="marketing-primary-action" href="#products">
                Learn more
              </Link>
              <a className="marketing-secondary-action" href="mailto:sales@acru.com?subject=Acru%20platform%20demo">
                See a demo
              </a>
            </div>
          </div>

          <div className="marketing-product-stage" aria-label="Acru merchant console preview">
            <Image
              alt="Acru merchant dashboard showing revenue, wallet balance, and business controls"
              className="marketing-product-image"
              height={982}
              priority
              sizes="(max-width: 760px) 88vw, (max-width: 1100px) 46vw, 480px"
              src="/marketing/merchant-dashboard.png"
              width={1124}
            />
          </div>
        </section>

        <section className="marketing-intro" id="about">
          <ScrollRevealCopy>
            Acru combines payment infrastructure into one unified operating system built for creators, software
            companies, agencies, and growing businesses around the world.
          </ScrollRevealCopy>
        </section>

        <PlatformCarousel />

        <section className="marketing-developer-section" id="developers">
          <div>
            <h2>Powerful enough for developers. Clear enough for everyone else.</h2>
            <p>
              One API and one operating console connect payments, customers, subscriptions, payouts, reporting, and
              financial operations.
            </p>
            <Link href="/sign-up">
              Start building <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="marketing-code-card" aria-label="Acru API request example">
            <div>
              <i />
              <i />
              <i />
            </div>
            <pre>
              <code>{`POST /v1/payment_intents
{
  "amount": 12545,
  "currency": "usd",
  "capture_method": "automatic"
}`}</code>
            </pre>
            <p>
              <span>201</span> Payment intent created
            </p>
          </div>
        </section>

        <section className="marketing-trust-section" id="solutions">
          <div className="marketing-trust-copy" id="security">
            <h2>Enterprise controls without enterprise complexity.</h2>
            <p>
              Keep sensitive work deliberate with granular access, configurable approvals, complete activity history,
              and security-first defaults.
            </p>
          </div>
          <dl>
            {operatingPrinciples.map((principle, index) => (
              <div key={principle.title}>
                <dt>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {principle.title}
                </dt>
                <dd>{principle.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="marketing-final-cta" id="pricing">
          <h2>Make your financial infrastructure an advantage.</h2>
          <Link className="marketing-final-cta-action" href="/sign-up">
            Apply now
          </Link>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
