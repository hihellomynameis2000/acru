"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { platformCapabilities } from "@/features/marketing/data/marketing";

type Capability = (typeof platformCapabilities)[number];

function CapabilityVisual({ visual }: { visual: Capability["visual"] }) {
  if (visual === "accept") {
    return (
      <Image
        alt="Cards, bank payments, and USDC connected through Acru"
        className="marketing-showcase-payment-image"
        height={1048}
        sizes="(max-width: 760px) 90vw, 52vw"
        src="/marketing/payments.png"
        width={1837}
      />
    );
  }

  if (visual === "protect") {
    return (
      <div className="marketing-risk-console" aria-label="Acru payment risk decision">
        <div className="marketing-risk-score">
          <span>Decision</span>
          <strong>Approved</strong>
          <small>Low risk · 42 ms</small>
        </div>
        <div className="marketing-risk-signals">
          <p>
            <span>Identity match</span>
            <strong>Verified</strong>
          </p>
          <p>
            <span>Authentication</span>
            <strong>3DS complete</strong>
          </p>
          <p>
            <span>Velocity</span>
            <strong>Normal</strong>
          </p>
        </div>
        <div className="marketing-risk-meter" aria-hidden="true">
          <i />
          <span>More protection only when the payment needs it</span>
        </div>
      </div>
    );
  }

  if (visual === "settle") {
    return (
      <div className="marketing-settlement-map" aria-label="Acru settlement routes">
        <div className="marketing-settlement-source">
          <span>Available to settle</span>
          <strong>$284,913.20</strong>
          <small>USD balance</small>
        </div>
        <div className="marketing-settlement-path" aria-hidden="true">
          <i />
          <b>A</b>
          <i />
        </div>
        <div className="marketing-settlement-destinations">
          <p>
            <span>Bank account</span>
            <strong>Tomorrow · 5:00 PM ET</strong>
          </p>
          <p>
            <span>USDC wallet</span>
            <strong>Available 24/7</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketing-operations-preview">
      <Image
        alt="Acru operations console showing balances and reporting"
        height={982}
        sizes="(max-width: 760px) 90vw, 52vw"
        src="/marketing/merchant-dashboard.png"
        width={1124}
      />
      <div>
        <span>Reconciled</span>
        <strong>12,481 transactions</strong>
        <small>Payments, fees, refunds, and payouts matched</small>
      </div>
    </div>
  );
}

export function PlatformCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const activeCapability = platformCapabilities[activeIndex];

  function selectRelativeCapability(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + platformCapabilities.length) % platformCapabilities.length;
    setActiveIndex(nextIndex);
    tabsRef.current[nextIndex]?.focus();
  }

  return (
    <section className="marketing-platform-section" id="platform" aria-labelledby="platform-heading">
      <div className="marketing-section-heading marketing-platform-heading">
        <p>One connected platform</p>
        <h2 id="platform-heading">Payments work better when the whole lifecycle works together.</h2>
      </div>

      <div className="marketing-showcase">
        <div
          aria-label="Acru platform capabilities"
          className="marketing-showcase-tabs"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              selectRelativeCapability(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              selectRelativeCapability(1);
            }
          }}
          role="tablist"
        >
          {platformCapabilities.map((capability, index) => (
            <button
              aria-controls={`${id}-panel`}
              aria-selected={activeIndex === index}
              id={`${id}-tab-${index}`}
              key={capability.eyebrow}
              onClick={() => setActiveIndex(index)}
              ref={(element) => {
                tabsRef.current[index] = element;
              }}
              role="tab"
              tabIndex={activeIndex === index ? 0 : -1}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {capability.eyebrow}
            </button>
          ))}
        </div>

        <div
          aria-labelledby={`${id}-tab-${activeIndex}`}
          className="marketing-showcase-panel"
          id={`${id}-panel`}
          role="tabpanel"
        >
          <div className="marketing-showcase-copy">
            <p>{activeCapability.eyebrow}</p>
            <h3>{activeCapability.title}</h3>
            <div>{activeCapability.description}</div>
            <ul>
              {activeCapability.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className={`marketing-showcase-visual marketing-showcase-visual--${activeCapability.visual}`}>
            <CapabilityVisual visual={activeCapability.visual} />
          </div>
        </div>
      </div>
    </section>
  );
}
