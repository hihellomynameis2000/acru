"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@shopify/polaris-icons";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { platformCapabilities } from "@/features/marketing/data/marketing";

function CapabilityVisual({ visual }: { visual: (typeof platformCapabilities)[number]["visual"] }) {
  if (visual === "payments") {
    return (
      <Image
        alt="Payment methods connected to an approved Acru payment"
        className="marketing-capability-image"
        height={1048}
        sizes="(max-width: 600px) 84vw, 470px"
        src="/marketing/payments.png"
        width={1837}
      />
    );
  }

  if (visual === "checkout") {
    return (
      <div className="marketing-checkout-visual" aria-hidden="true">
        <div>
          <span>Order total</span>
          <strong>$149.00</strong>
          <i />
          <i />
          <span className="marketing-checkout-action">Pay securely</span>
        </div>
        <div>
          <span>Payment complete</span>
          <strong>Approved</strong>
          <small>Receipt sent instantly</small>
        </div>
      </div>
    );
  }

  if (visual === "risk") {
    return (
      <div className="marketing-risk-visual" aria-hidden="true">
        <div className="marketing-risk-rings">
          <i />
          <i />
          <i />
        </div>
        <div>
          <span>Approval rate</span>
          <strong>98.7%</strong>
        </div>
        <div>
          <span>Fraud blocked</span>
          <strong>Real time</strong>
        </div>
      </div>
    );
  }

  if (visual === "payouts") {
    return (
      <div className="marketing-payout-visual" aria-hidden="true">
        <p>
          <span>Available balance</span>
          <strong>$284,913.20</strong>
        </p>
        <div>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <small>Next automatic payout · Tomorrow</small>
      </div>
    );
  }

  return (
    <div className="marketing-reporting-visual" aria-hidden="true">
      <p>
        <span>Net revenue</span>
        <strong>$6.21M</strong>
        <small>+15.3%</small>
      </p>
      <div>
        {[38, 55, 47, 72, 61, 84, 76, 96].map((height) => (
          <i key={height} style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}

export function PlatformCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const normalizedIndex = Math.max(0, Math.min(platformCapabilities.length - 1, index));
    const card = track.children.item(normalizedIndex) as HTMLElement | null;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(normalizedIndex);
  }, []);

  const updateActiveCard = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const closestIndex = cards.reduce((closest, card, index) => {
      const currentDistance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      const closestDistance = Math.abs(cards[closest].offsetLeft - track.offsetLeft - track.scrollLeft);
      return currentDistance < closestDistance ? index : closest;
    }, 0);
    setActiveIndex(closestIndex);
  }, []);

  return (
    <section className="marketing-platform-section" id="products" aria-labelledby="platform-heading">
      <div className="marketing-platform-heading">
        <h2 id="platform-heading">
          Payments fueling growth,
          <br />
          built for scale.
        </h2>
        <div className="marketing-carousel-controls" aria-label="Product carousel controls">
          <button
            aria-label="Previous product"
            disabled={activeIndex === 0}
            onClick={() => goTo(activeIndex - 1)}
            type="button"
          >
            <ArrowLeftIcon aria-hidden="true" />
          </button>
          <button
            aria-label="Next product"
            disabled={activeIndex === platformCapabilities.length - 1}
            onClick={() => goTo(activeIndex + 1)}
            type="button"
          >
            <ArrowRightIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="marketing-capability-track" onScroll={updateActiveCard} ref={trackRef}>
        {platformCapabilities.map((capability) => (
          <article key={capability.title}>
            <div className={`marketing-capability-visual marketing-capability-visual--${capability.visual}`}>
              <CapabilityVisual visual={capability.visual} />
            </div>
            <h3>{capability.title}</h3>
            <p>{capability.description}</p>
          </article>
        ))}
      </div>

      <div className="marketing-carousel-dots" aria-label="Choose product">
        {platformCapabilities.map((capability, index) => (
          <button
            aria-label={`Show ${capability.title}`}
            aria-pressed={activeIndex === index}
            key={capability.title}
            onClick={() => goTo(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
