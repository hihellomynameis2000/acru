"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  PaintBrushFlatIcon,
  CreditCardIcon,
  FormsIcon,
  ArrowRightIcon,
  CodeIcon,
  NotificationIcon,
  SandboxIcon,
  ReplayIcon,
  ChartVerticalIcon
} from "@shopify/polaris-icons";
import { checkoutTabs } from "../data/checkout-story";
import styles from "./checkout-story.module.css";

const capabilityIcons = {
  "Brand controls": PaintBrushFlatIcon,
  "Payment presentation": CreditCardIcon,
  "Customer fields": FormsIcon,
  "Completion states": ArrowRightIcon,
  APIs: CodeIcon,
  Webhooks: NotificationIcon,
  "Test environment": SandboxIcon,
  Idempotency: ReplayIcon
};

const tabIcons = [PaintBrushFlatIcon, CodeIcon, ChartVerticalIcon];

// Three equal tabs share a continuous frame with a rounded raised shoulder.
function tabFramePath(active: number) {
  const left = active * (1000 / 3) + 24;
  const right = (active + 1) * (1000 / 3) - 24;
  return `M .5 88 V 44 Q .5 24 20 24 H ${left} C ${left + 28} 24 ${left + 28} 4 ${left + 60} 4 H ${right - 60} C ${right - 28} 4 ${right - 28} 24 ${right} 24 H 980 Q 999.5 24 999.5 44 V 88`;
}

function TabArtwork({ id }: { id: string }) {
  if (id === "design")
    return (
      <figure className={styles.designArt}>
        <Image
          src="/marketing/card-processing-directions/gradient-hero.webp"
          alt="Branded checkout with payment options"
          width={1752}
          height={1597}
          sizes="(max-width: 760px) 90vw, 40vw"
        />
        <figcaption>Your brand. Your checkout.</figcaption>
      </figure>
    );
  if (id === "build")
    return (
      <figure className={styles.buildArt}>
        <div className={styles.codeHeader}>
          <span>One integration. Your choice.</span>
          <small>Illustrative</small>
        </div>
        {[
          ["Hosted", "checkout.acru…"],
          ["Embedded", "<AcruCheckout />"],
          ["API", "POST /v1/payment_intents"]
        ].map(([label, code], i) => (
          <div className={styles.codeRow} key={label}>
            <span>0{i + 1}</span>
            <div>
              <strong>{label}</strong>
              <code>{code}</code>
            </div>
            <ArrowRightIcon className={styles.inlineArrow} aria-hidden="true" focusable="false" />
          </div>
        ))}
        <div className={styles.event}>
          <span aria-hidden="true">●</span>
          <code>payment.succeeded</code>
          <small>Same lifecycle</small>
        </div>
        <figcaption>Illustrative API and event names · Subject to technical review</figcaption>
      </figure>
    );
  return (
    <figure className={styles.journey}>
      <div className={styles.codeHeader}>
        <span>Checkout journey</span>
        <small>Illustrative data</small>
      </div>
      <ol>
        {[
          ["14,281", "Checkout opened"],
          ["13,904", "Payment submitted"],
          ["13,612", "Authentication completed"],
          ["13,427", "Authorized"],
          ["13,391", "Paid"]
        ].map(([value, label], index) => (
          <li key={label}>
            <span className={styles.journeyDot} data-complete={index === 4} />
            <span>{label}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </ol>
      <div className={styles.insight}>
        <strong>Authorization conversion ↓ 2.1%</strong>
        <p>Issuer declines increased for Mastercard debit.</p>
      </div>
      <figcaption>Illustrative values · Not production statistics</figcaption>
    </figure>
  );
}
export function CheckoutStoryTabs() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % checkoutTabs.length;
    else if (event.key === "ArrowLeft") next = (index + checkoutTabs.length - 1) % checkoutTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = checkoutTabs.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }
  return (
    <div className={styles.productStage}>
      <svg
        className={styles.tabFrame}
        viewBox="0 0 1000 88"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d={`${tabFramePath(active)} Z`} style={{ d: `path("${tabFramePath(active)} Z")` }} fill="#222323" />
        <path
          d={tabFramePath(active)}
          style={{ d: `path("${tabFramePath(active)}")` }}
          fill="none"
          stroke="#ffffff20"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className={styles.tabs} role="tablist" aria-label="Explore the checkout layer">
        {checkoutTabs.map((tab, index) => {
          const Icon = tabIcons[index];
          return (
            <button
              key={tab.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              role="tab"
              id={`checkout-tab-${tab.id}`}
              aria-controls={`checkout-panel-${tab.id}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <Icon aria-hidden="true" focusable="false" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className={styles.tabPanels}>
        {checkoutTabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            tabIndex={0}
            id={`checkout-panel-${tab.id}`}
            aria-labelledby={`checkout-tab-${tab.id}`}
            aria-hidden={active !== index}
            inert={active !== index}
            className={styles.tabPanel}
          >
            <div className={styles.tabCopy}>
              <h3>{tab.title}</h3>
              <p>{tab.body}</p>
              {tab.capabilities.length > 0 && (
                <ul className={styles.capabilities}>
                  {tab.capabilities.map(([title, body]) => {
                    const Icon = capabilityIcons[title];
                    return (
                      <li key={title} title={body}>
                        <Icon aria-hidden="true" focusable="false" />
                        {title}
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link href={tab.href}>
                {tab.cta} <ArrowRightIcon className={styles.inlineArrow} aria-hidden="true" focusable="false" />
              </Link>
            </div>
            <TabArtwork id={tab.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
