"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function PaymentsMovement() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = section.current!;
    const media = video.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let near = false;
    let target = 0;
    const seek = () => {
      if (!media.seeking && media.readyState >= 2 && Math.abs(media.currentTime - target) > 1 / 30)
        media.currentTime = target;
    };
    const update = () => {
      frame = 0;
      if (!near || reduced.matches || !Number.isFinite(media.duration)) return;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * 0.85 - rect.top) / (rect.height + innerHeight * 0.45)));
      target = progress * Math.max(0, media.duration - 1 / 30);
      seek();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const load = () => {
      if (reduced.matches) return;
      if (!media.getAttribute("src")) {
        media.src =
          innerWidth <= 760
            ? "/marketing/payments-overview/movement-scroll-mobile.mp4"
            : "/marketing/payments-overview/movement-scroll.mp4";
        media.load();
      }
      schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) load();
      },
      { rootMargin: "500px" }
    );
    observer.observe(element);
    media.addEventListener("loadeddata", schedule);
    media.addEventListener("seeked", seek);
    reduced.addEventListener("change", load);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("loadeddata", schedule);
      media.removeEventListener("seeked", seek);
      reduced.removeEventListener("change", load);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      ref={section}
      className="po-movement po-movement-animated po-container"
      aria-label="Connected money movement"
    >
      <video
        ref={video}
        className="po-movement-video"
        poster="/marketing/payments-overview/movement-poster.webp"
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
      />
      <div className="po-movement-copy">
        <h2>
          From payment complete
          <br /> to money in motion.
        </h2>
        <p>
          Follow into balances, settlement, payouts, and supported
          <br className="po-desktop-break" /> money movement. All connected to the transaction that started it.
        </p>
        <Link className="po-button" href="/payouts">
          Learn more
        </Link>
      </div>
    </section>
  );
}
