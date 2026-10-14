"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { checkoutIntegrationIcons } from "../data/checkout-integration-icons";
import styles from "./checkout-closing.module.css";

export function CheckoutIntegrationCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let inView = false;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className={styles.carousel} ref={root}>
      <div
        className={styles.carouselViewport}
        id="checkout-integration-carousel"
        role="region"
        aria-label="Featured integration logos"
        tabIndex={0}
      >
        <div className={styles.carouselTrack} data-running={visible}>
          {[0, 1].map((copy) => (
            <ul className={styles.logoRow} key={copy} aria-hidden={copy === 1 || undefined}>
              {checkoutIntegrationIcons.map((integration) => (
                <li
                  className={styles.logoTile}
                  style={
                    { background: integration.background, "--app-icon-size": `${integration.size}px` } as CSSProperties
                  }
                  data-full-bleed={"fullBleed" in integration && integration.fullBleed}
                  key={integration.name}
                  title={integration.name}
                >
                  <Image
                    src={`/marketing/checkout/integrations/icons/${integration.file}`}
                    alt={copy ? "" : integration.name}
                    width={integration.size}
                    height={integration.size}
                    sizes="96px"
                    loading={visible ? "eager" : "lazy"}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
