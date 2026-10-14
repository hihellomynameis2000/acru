import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import { MarketingFrame } from "./product-landing";
import { ClientCarousel } from "./client-carousel";
import { PaymentsReviews } from "./payments-reviews";
import { PaymentsMovement } from "./payments-movement";
import { LandingFaq } from "./landing-faq";
import { CheckoutStoryTabs } from "./checkout-story-tabs";
import { CheckoutClosing, CheckoutIntegrations } from "./checkout-closing";
import { checkoutDeployment, checkoutFaqs, checkoutFeatures, checkoutIntro } from "../data/checkout-story";
import styles from "./checkout-story.module.css";

function DeploymentVisual({ mode }: { mode: "Hosted" | "Embedded" | "API" }) {
  const paymentForm = (
    <div className={styles.miniPayment}>
      <div className={styles.miniAmount}>
        <span>Order total</span>
        <strong>$128.00</strong>
      </div>
      <div className={styles.miniMethods}>
        <span>Card</span>
        <span>Wallet</span>
      </div>
      <div className={styles.miniField}>
        Card details <span>••••</span>
      </div>
      <div className={styles.miniPay}>
        Pay $128.00 <ArrowRightIcon className={styles.miniArrow} />
      </div>
    </div>
  );
  return (
    <div className={styles.integrationVisual} data-mode={mode} aria-hidden="true">
      {mode === "API" ? (
        <div className={styles.apiWindow}>
          <div className={styles.windowBar}>
            <i />
            <i />
            <i />
            <span>Your application</span>
          </div>
          <div className={styles.apiCode}>
            <span className={styles.codeComment}>{"// Your interface. Acru underneath."}</span>
            <span>
              <b>checkout</b> {"{"}
            </span>
            <span>
              &nbsp; interface: <em>{'"yours"'}</em>,
            </span>
            <span>
              &nbsp; payments: <em>{'"Acru"'}</em>
            </span>
            <span>{"}"}</span>
          </div>
          <div className={styles.apiEvent}>
            <ArrowRightIcon className={styles.miniArrow} /> Payment events{" "}
            <span>
              <ArrowRightIcon className={styles.miniArrow} /> Your app
            </span>
          </div>
        </div>
      ) : (
        <div className={`${styles.checkoutWindow} ${mode === "Embedded" ? styles.embeddedWindow : ""}`}>
          <div className={styles.windowBar}>
            <i />
            <i />
            <i />
            <span>{mode === "Hosted" ? "Acru Checkout" : "Your storefront"}</span>
          </div>
          <div className={styles.windowContent}>
            {mode === "Embedded" && (
              <div className={styles.miniStore}>
                <div className={styles.productShape} />
                <span>Your order</span>
                <i />
                <i />
              </div>
            )}
            {paymentForm}
          </div>
        </div>
      )}
    </div>
  );
}

function GradientArt({ name, hero = false }: { name: string; hero?: boolean }) {
  const descriptions: Record<string, string> = {
    hero: "Checkout with card, bank account, Apple Pay and Google Pay options",
    methods: "Card transactions and supported payment methods",
    authorization: "Identity, device, authentication and authorization flow",
    intelligence: "Payment states and transaction analysis"
  };
  return (
    <div className={`${hero ? "pl-hero-frame" : "pl-feature-frame"} po-art-frame`}>
      <Image
        src={`/marketing/card-processing-directions/gradient-${name}.webp`}
        alt={descriptions[name]}
        width={hero ? 1752 : 1770}
        height={hero ? 1597 : 1560}
        priority={hero}
        sizes="(max-width: 760px) 90vw, 40vw"
      />
    </div>
  );
}
export function CheckoutLanding() {
  return (
    <MarketingFrame className={`pl-card-gradient ${styles.page}`}>
      <section className="po-hero po-container">
        <div className="po-copy">
          <h1>{"Checkouts built around\nhow you sell."}</h1>
          <p>{checkoutIntro}</p>
          <div className="po-actions">
            <a className="po-button" href="#checkout-deployment">
              Learn more
            </a>
            <Link className="po-button po-button-secondary" href="/demo">
              See a demo <ArrowRightIcon className={styles.inlineArrow} aria-hidden="true" focusable="false" />
            </Link>
          </div>
        </div>
        <GradientArt name="hero" hero />
      </section>
      <ClientCarousel showHeading={false} />
      <section className={`${styles.integrationSection} po-container`} id="checkout-deployment">
        <header className={styles.centerHeading}>
          <h2>{"One checkout layer.\nThree ways to deploy."}</h2>
          <p>
            Start with a complete checkout, embed it in your product,
            <br className="po-desktop-break" /> or build the interface yourself.
          </p>
        </header>
        <div className={styles.integrationGrid}>
          {checkoutDeployment.map((mode) => (
            <article className={styles.integration} key={mode.label}>
              <Link
                href={mode.href}
                className={styles.integrationCard}
                aria-label={`${mode.label} checkout — ${mode.cta}`}
              >
                <DeploymentVisual mode={mode.label} />
                <div className={styles.integrationCopy}>
                  <div className={styles.integrationHeading}>
                    <h3>{mode.label === "API" ? "Custom API" : `${mode.label} checkout`}</h3>
                    <span className={styles.integrationArrow} aria-hidden="true">
                      <ArrowRightIcon focusable="false" />
                    </span>
                  </div>
                  <p className={styles.integrationBody}>{mode.body}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="po-features po-container" aria-label="Checkout features">
        {checkoutFeatures.map((feature, index) => (
          <div className={`po-feature ${index === 1 ? "po-feature-reverse" : ""}`} key={feature.id}>
            {index === 1 && <GradientArt name={feature.artwork} />}
            <div className="po-copy">
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
              {feature.id === "payment-methods" && (
                <Link className="po-button po-button-small po-button-secondary" href={feature.href}>
                  {feature.cta} <ArrowRightIcon className={styles.inlineArrow} aria-hidden="true" focusable="false" />
                </Link>
              )}
            </div>
            {index !== 1 && <GradientArt name={feature.artwork} />}
          </div>
        ))}
      </section>
      <CheckoutIntegrations />
      <section id="checkout-layer" className={`${styles.section} po-container`}>
        <header className={styles.centerHeading}>
          <h2>One checkout layer.</h2>
          <p>
            Your experience. Your integration.
            <br />
            Every payment, connected.
          </p>
        </header>
        <CheckoutStoryTabs />
      </section>
      <PaymentsReviews />
      <PaymentsMovement />
      <section className="po-faq po-container">
        <div>
          <h2>{"Frequently\nasked questions"}</h2>
        </div>
        <LandingFaq items={checkoutFaqs} />
      </section>
      <CheckoutClosing />
    </MarketingFrame>
  );
}
