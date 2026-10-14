"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "@shopify/polaris-icons";
import { checkoutIntegrations } from "../data/checkout-integrations";
import { LegalHeader } from "./legal-header";
import { LandingFooter } from "./landing-editorial";
import styles from "./integration-directory.module.css";

const categories = [
  "All",
  "Gateways & banking",
  "Commerce & checkout",
  "Subscriptions & billing",
  "Forms & operations",
  "Wallet infrastructure"
];

export function IntegrationDirectory({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const matches = checkoutIntegrations.filter(
    (integration) =>
      (category === "All" || integration.category === category) &&
      integration.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  return (
    <div className={`cinematic-page ${styles.page}`}>
      <LegalHeader />
      <main className={styles.main}>
        <Link className={styles.back} href="/features/checkout">
          <ArrowLeftIcon className={styles.arrow} aria-hidden="true" focusable="false" /> Checkout
        </Link>
        <header className={styles.hero}>
          <span>Integrations</span>
          <h1>Keep the tools you use.</h1>
          <p>
            Find your commerce, billing, and operations platforms.
            <br />
            Confirm the connection and payment methods for your account before launch.
          </p>
        </header>
        <div className={styles.gatewayNote}>
          <strong>Using NMI or Authorize.net?</strong>
          <p>
            Your gateway processes the payments. Acru brings the reporting into your merchant portal. Acru’s custom
            checkout is a separate integration path.
          </p>
          <Link href="/help/gateway-reporting-vs-custom-checkout">
            Understand the two paths <ArrowRightIcon className={styles.arrow} aria-hidden="true" focusable="false" />
          </Link>
        </div>
        <label className={styles.search}>
          <SearchIcon aria-hidden="true" />
          <span className={styles.srOnly}>Search integrations</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search integrations"
          />
        </label>
        <div className={styles.filters} role="group" aria-label="Integration category">
          {categories.map((name) => (
            <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>
              {name}
            </button>
          ))}
        </div>
        <p className={styles.count} role="status">
          {matches.length} {matches.length === 1 ? "integration" : "integrations"}
        </p>
        <div className={styles.grid}>
          {matches.map((integration) => (
            <article key={integration.name}>
              <div className={`${styles.logo} ${integration.darkLogo ? styles.darkLogo : ""}`}>
                {integration.image ? (
                  <Image
                    src={integration.image}
                    alt=""
                    width={integration.width ?? 1200}
                    height={integration.height ?? 500}
                    sizes="180px"
                  />
                ) : (
                  <span>{integration.name}</span>
                )}
              </div>
              <h2>{integration.name}</h2>
              <p>{integration.category}</p>
              <Link href={`/demo?integration=${encodeURIComponent(integration.name)}`}>
                Discuss this integration{" "}
                <ArrowRightIcon className={styles.arrow} aria-hidden="true" focusable="false" />
              </Link>
            </article>
          ))}
        </div>
        {matches.length === 0 && (
          <div className={styles.empty}>
            <p>No integrations match that search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <div className={styles.help}>
          <h2>Need help getting connected?</h2>
          <Link href="/help/choose-checkout-integration">
            Read the integration guide <ArrowRightIcon className={styles.arrow} aria-hidden="true" focusable="false" />
          </Link>
        </div>
      </main>
      <LandingFooter onHomepage={false} />
    </div>
  );
}
