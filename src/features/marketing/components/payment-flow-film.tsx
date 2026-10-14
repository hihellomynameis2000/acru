"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ScrollRevealCopy } from "@/features/marketing/components/scroll-reveal-copy";
import { ClientCarousel } from "@/features/marketing/components/client-carousel";

const assetBase = "/media/acru-payment-flow/v1";

export function PaymentFlowFilm() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const preference = useRef<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current!;
    const container = frame.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let inView = false;
    let disposed = false;

    container.dataset.enhanced = "true";
    element.controls = false;

    function syncPlayback() {
      const mayPlay = preference.current === "play" || (!motion.matches && !connection?.saveData);
      if (inView && !document.hidden && preference.current !== "pause" && mayPlay) {
        void element
          .play()
          .then(() => {
            if (disposed || !inView || document.hidden || preference.current === "pause") element.pause();
          })
          .catch(() => {
            // If autoplay is blocked, the glass control remains available to play.
          });
      } else {
        element.pause();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        syncPlayback();
      },
      { threshold: [0, 0.25] }
    );
    observer.observe(element);
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      element.pause();
    };
  }, []);

  function togglePlayback() {
    const element = video.current!;
    if (!element.paused) {
      preference.current = "pause";
      element.pause();
      return;
    }
    preference.current = "play";
    if (failed) {
      setFailed(false);
      element.load();
    }
    void element.play().catch(() => {
      preference.current = "pause";
    });
  }

  return (
    <section className="cinematic-payment-story" id="about" aria-label="One connected payment platform">
      <ClientCarousel />
      <div className="cinematic-payment-story-content">
        <ScrollRevealCopy>
          Acru combines payment infrastructure into one unified operating system built for creators, software companies,
          agencies, and growing businesses around the world.
        </ScrollRevealCopy>
        <div className="cinematic-payment-film" ref={frame}>
          <video
            ref={video}
            id="payment-flow-animation"
            width={1588}
            height={658}
            src={`${assetBase}/payment-flow.mp4`}
            poster={`${assetBase}/poster.png`}
            preload="none"
            muted
            playsInline
            loop
            controls
            aria-label="Payment flow from customers through authorization, capture, settlement, and available balance"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
          {failed && (
            <p className="cinematic-film-error" role="status">
              Animation unavailable. Select play to retry.
            </p>
          )}
          <button
            className="cinematic-film-control"
            type="button"
            aria-label={playing ? "Pause payment flow animation" : "Play payment flow animation"}
            aria-controls="payment-flow-animation"
            onClick={togglePlayback}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
