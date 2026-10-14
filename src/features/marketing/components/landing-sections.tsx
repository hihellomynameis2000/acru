import { ArrowUpRight, ChevronRight, CreditCard, Expand, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProductAnimation } from "@/features/marketing/components/product-animation";
import { CheckoutStudio } from "@/features/marketing/components/checkout-studio";
import { LandingEditorial } from "@/features/marketing/components/landing-editorial";
import {
  businessContactHref,
  landingArtwork,
  landingBusinesses,
  landingChartAnimation,
  landingProductAnimations,
  landingProducts
} from "@/features/marketing/data/landing";

const checkoutFeatures = [
  {
    title: "Flexible experiences",
    description: "Use hosted or embedded payment experiences built around your product.",
    Icon: Expand
  },
  {
    title: "Payment choice",
    description: "Bring wallets, local payments, and buy now, pay later into one checkout.",
    Icon: CreditCard
  },
  {
    title: "Built in authentication",
    description: "Apply supported authentication flows without adding unnecessary friction.",
    Icon: LockKeyhole
  }
];

export function LandingSections() {
  return (
    <div className="landing-continuation">
      <section className="landing-products" id="products" aria-labelledby="landing-products-heading">
        <div className="landing-container">
          <h2 id="landing-products-heading">
            Everything required to accept,
            <br className="landing-wide-break" /> protect, and move money.
          </h2>
          <div className="landing-product-grid">
            {landingProducts.map((product) => {
              const animation = landingProductAnimations[product.id];
              return (
                <article className="landing-product" id={product.id} key={product.id}>
                  {animation ? (
                    <ProductAnimation {...animation} label={product.title} alt={product.artwork.alt} />
                  ) : (
                    <div className="landing-product-artwork">
                      <Image
                        {...product.artwork}
                        alt={product.artwork.alt}
                        sizes="(max-width: 640px) 85vw, (max-width: 1600px) 37vw, 590px"
                      />
                    </div>
                  )}
                  <div className="landing-product-copy">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="landing-dark">
        <section className="landing-experiences landing-container" aria-labelledby="landing-experiences-heading">
          <div className="landing-centered-heading">
            <h2 id="landing-experiences-heading">
              Built to make paying feel
              <br /> effortless.
            </h2>
            <p>
              Offer familiar wallets, local payment methods, and flexible installments in a checkout built around your
              brand.
            </p>
          </div>
          <CheckoutStudio />
          <div className="landing-experience-features">
            {checkoutFeatures.map(({ title, description, Icon }) => (
              <article key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="landing-insights landing-container"
          id="insights"
          aria-labelledby="landing-insights-heading"
        >
          <ProductAnimation
            {...landingChartAnimation}
            label="Payment chart"
            alt={landingArtwork.chart.alt}
            variant="chart"
          />
          <div className="landing-insights-copy">
            <h2 id="landing-insights-heading">
              Know what’s moving.
              <br /> Know what changed.
            </h2>
            <p>
              Keep money movement, payment performance, and the activity that needs attention connected in one view.
            </p>
            <Link className="landing-outline-link" href="/features/reporting">
              Learn more <ChevronRight aria-hidden="true" />
              <span className="landing-sr-only"> about payment analytics</span>
            </Link>
          </div>
        </section>

        <section
          className="landing-developers landing-container"
          id="developers"
          aria-labelledby="landing-developers-heading"
        >
          <div className="landing-developers-banner">
            <h2 id="landing-developers-heading">Integrate fast using the new Acru CLI</h2>
            <p>Build your payment integration, test requests, and follow events as you develop.</p>
            <Link className="landing-text-link" href="/developers/documentation">
              Learn more<span className="landing-sr-only"> about developer tools</span>
            </Link>
          </div>
        </section>

        <section className="landing-businesses" id="businesses" aria-labelledby="landing-businesses-heading">
          <div className="landing-business-surface landing-container">
            <div className="landing-centered-heading">
              <h2 id="landing-businesses-heading">For people building what comes next.</h2>
            </div>
            <div className="landing-business-grid">
              {landingBusinesses.map((business) => (
                <a
                  className="landing-business"
                  id={`business-${business.id}`}
                  href={businessContactHref(business.title)}
                  aria-label={`Explore payments for ${business.title.toLowerCase()}`}
                  key={business.id}
                >
                  <h3>{business.title}</h3>
                  <p className="landing-business-headline">{business.headline}</p>
                  <p>{business.description}</p>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
        <LandingEditorial />
      </div>
    </div>
  );
}
