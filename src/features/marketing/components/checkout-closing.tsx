import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import { checkoutIntegrations } from "../data/checkout-integrations";
import { CheckoutIntegrationCarousel } from "./checkout-integration-carousel";
import styles from "./checkout-closing.module.css";

export function CheckoutIntegrations() {
  return (
    <section id="checkout-integrations" className={styles.integrations} aria-labelledby="checkout-integrations-heading">
      <Link href="/integrations" className={styles.pill}>
        Featured integrations{" "}
        <span aria-hidden="true">
          <ArrowRightIcon className={styles.inlineArrow} focusable="false" />
        </span>
      </Link>
      <h2 id="checkout-integrations-heading">Checkout that fits your stack.</h2>
      <p>Connect Acru to the platforms behind your business.</p>
      <CheckoutIntegrationCarousel />
      <details className={styles.allIntegrations}>
        <summary>See the full list</summary>
        <ul>
          {checkoutIntegrations.map(({ name }) => (
            <li key={name}>
              <Link href={`/integrations?q=${encodeURIComponent(name)}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export function CheckoutClosing() {
  return (
    <section className={styles.closing} aria-labelledby="checkout-closing-heading">
      <div className={styles.closingCard}>
        {/* Credentials, rank, and 4.9 rating supplied by the user; no award year or review count inferred. */}
        <div className={styles.badges} aria-label="Business recognition">
          <div className={styles.bbb}>
            <Image
              src="/marketing/checkout/badges/bbb-accredited.png"
              alt="BBB Accredited Business, A+ rated"
              width={820}
              height={1096}
              sizes="64px"
            />
          </div>
          <div className={styles.trustpilot}>
            <div className={styles.trustpilotLogo}>
              <Image
                src="/marketing/checkout/badges/trustpilot.png"
                alt="Trustpilot"
                width={600}
                height={600}
                sizes="150px"
              />
            </div>
            <p className={styles.trustpilotRating} aria-label="Trustpilot rating: 4.9 out of 5">
              <strong>4.9</strong>
              <span> / 5</span>
            </p>
          </div>
          <div className={styles.inc}>
            <Image
              src="/marketing/checkout/badges/inc-5000.png"
              alt="Inc. 5000"
              width={600}
              height={600}
              sizes="84px"
            />
            <span>#2,150</span>
          </div>
        </div>
        <h2 id="checkout-closing-heading">Build a better way to get paid.</h2>
        <p>Your checkout. Your brand. Acru underneath.</p>
        <div className={styles.actions}>
          <Link href="#checkout-deployment" className={styles.primary}>
            Learn more
          </Link>
          <Link href="/demo" className={styles.secondary}>
            See a demo <ArrowRightIcon className={styles.inlineArrow} aria-hidden="true" focusable="false" />
          </Link>
        </div>
      </div>
    </section>
  );
}
