"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const reviews = [
  {
    quote:
      "We needed more than payment processing. We needed a team that understood fraud prevention, chargeback management, and how those decisions affect the customer experience. Acru helped us bring those pieces together and stayed involved through implementation. That depth of support was missing from our previous provider.",
    name: "Wellington",
    role: "Founder, MundPay",
    // Official portrait: https://blog.mundpay.com/en/author/wellington-vicente/
    logo: "/marketing/payments-overview/wellington-vicente.webp",
    company: "Wellington Vicente",
    wordmark: false
  },
  {
    quote:
      "With our previous provider, every question started with a support ticket. With Acru, we have direct access to people who know our business and take ownership of the next steps.",
    name: "Gil",
    role: "Founder, Fulfillment Pros",
    logo: "/marketing/clients/v1/fulfillment-pros.svg",
    company: "Fulfillment Pros",
    wordmark: true
  },
  {
    quote:
      "Acru offered more competitive processing rates without compromising on service. Their team walked us through the pricing clearly, giving us a better understanding of our costs as we grow.",
    name: "Dan",
    role: "CPO, LeveledUp Traders",
    logo: "/marketing/clients/v1/leveled-up-traders.jpg",
    company: "LeveledUp Traders",
    wordmark: false
  },
  {
    quote:
      "We needed room to scale without processing caps holding us back. Acru helped us establish a setup that supports our volume and gave us confidence to plan for continued growth.",
    name: "Mikael",
    role: "CFO, Solstice",
    logo: null,
    company: "Solstice",
    wordmark: false
  },
  {
    quote:
      "Adding alternative payment methods through Acru helped us serve customers who prefer options beyond traditional cards. We could offer more choice through a consistent checkout experience, without managing a separate integration for every method.",
    name: "Robin",
    role: "Head of Payment Acquisition, Bitunix",
    logo: "/marketing/payments-overview/bitunix.webp",
    company: "Bitunix",
    wordmark: false
  }
];

export function PaymentsReviews() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const section = useRef<HTMLElement>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    let inView = false;
    const visibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        visibility();
      },
      { threshold: 0.25 }
    );
    observer.observe(section.current!);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!visible || paused || reducedMotion) return;
    const duration = 6000;
    let previous = performance.now();
    let frame: number;
    const tick = (now: number) => {
      elapsed.current += Math.min(now - previous, 100);
      previous = now;
      section.current?.style.setProperty("--review-progress", String(Math.min(1, elapsed.current / duration)));
      if (elapsed.current >= duration) {
        elapsed.current = 0;
        section.current?.style.setProperty("--review-progress", "0");
        setActive((index) => (index + 1) % reviews.length);
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, visible, paused, reducedMotion]);

  function select(index: number) {
    elapsed.current = 0;
    section.current?.style.setProperty("--review-progress", "0");
    setActive(index);
  }

  return (
    <section
      ref={section}
      className="po-testimonial po-container"
      aria-label="Customer reviews"
      aria-roledescription="carousel"
    >
      <div className="po-review-slides">
        {reviews.map((review, index) => (
          <div
            key={review.name}
            id={`payment-review-${index}`}
            className="po-review-slide"
            data-active={index === active}
            aria-hidden={index !== active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${reviews.length}`}
          >
            <blockquote>“{review.quote}”</blockquote>
            <div className="po-attribution">
              <div className="po-review-avatar" data-wordmark={review.wordmark}>
                {review.logo && (
                  <Image
                    className="po-review-logo"
                    src={review.logo}
                    width={48}
                    height={57}
                    alt={review.company}
                    unoptimized
                  />
                )}
              </div>
              <p>
                {review.name}
                <span>{review.role}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="po-review-controls" aria-label="Choose a customer review">
        {reviews.map((review, index) => (
          <button
            type="button"
            key={review.name}
            className="po-review-pill"
            data-active={index === active}
            aria-current={index === active ? "true" : undefined}
            aria-label={`Read ${review.name}’s review — ${review.role}`}
            aria-controls={`payment-review-${index}`}
            onClick={() => select(index)}
          >
            <span className="po-review-track">
              <span className="po-review-fill" />
            </span>
          </button>
        ))}
        {!reducedMotion && (
          <button
            type="button"
            className="po-review-pause"
            aria-label={paused ? "Play reviews" : "Pause reviews"}
            title={paused ? "Play reviews" : "Pause reviews"}
            onClick={() => setPaused((value) => !value)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {paused ? (
                <path d="M9 5.5 18 12l-9 6.5Z" />
              ) : (
                <>
                  <rect x="7" y="5.5" width="3" height="13" rx="1.2" />
                  <rect x="14" y="5.5" width="3" height="13" rx="1.2" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
