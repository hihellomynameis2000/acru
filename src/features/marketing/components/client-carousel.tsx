"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { acruClientLogos } from "@/features/marketing/data/clients";

export function ClientCarousel({ showHeading = true }: { showHeading?: boolean }) {
  const container = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const element = container.current!;
    const viewport = element.querySelector<HTMLElement>(".landing-clients-viewport")!;
    const group = element.querySelector<HTMLElement>(".landing-clients-group")!;
    const measure = () => {
      const cycleWidth = group.getBoundingClientRect().width;
      if (cycleWidth <= 0) return;
      // Keep a whole extra cycle beyond the viewport, even on ultrawide screens.
      // Animate exactly one group, independent of how many copies are needed.
      element.style.setProperty("--client-loop-distance", `${cycleWidth}px`);
      setCopies(Math.max(2, Math.ceil(viewport.clientWidth / cycleWidth) + 1));
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(group);
    let inView = false;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <section className="landing-clients" aria-label="Acru clients" data-running={visible} ref={container}>
      {showHeading && (
        <div className="landing-clients-heading">
          <p>Trusted by businesses building what’s next.</p>
        </div>
      )}
      <div className="landing-clients-band">
        <div className="landing-clients-viewport" id="acru-client-carousel">
          <div className="landing-clients-track">
            {Array.from({ length: copies }, (_, index) => (
              <ul
                className="landing-clients-group"
                aria-hidden={index > 0 || undefined}
                data-duplicate={index > 0}
                key={index}
              >
                {acruClientLogos.map(({ name, src, width, height, wordmark, badge }) => (
                  <li
                    key={name}
                    className={badge ? "landing-client-badge" : wordmark ? "landing-client-packdraw" : undefined}
                  >
                    <Image
                      src={src}
                      alt={index > 0 ? "" : name}
                      width={width}
                      height={height}
                      unoptimized
                      loading={visible ? "eager" : "lazy"}
                    />
                    {wordmark && <span aria-hidden="true">{wordmark}</span>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
