"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { ProductAnimationPlayback } from "@/features/marketing/components/product-animation-playback";
import type { LandingProductAnimation } from "@/features/marketing/data/landing";

export function ProductAnimation({
  src,
  poster,
  width,
  height,
  label,
  alt,
  variant = "product"
}: LandingProductAnimation & {
  label: string;
  alt: string;
  variant?: "product" | "chart";
}) {
  const id = useId();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const playback = useRef<ProductAnimationPlayback | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current!;
    const container = frame.current!;
    const controller = new ProductAnimationPlayback(element, src);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & { saveData?: boolean };
      }
    ).connection;
    playback.current = controller;
    container.dataset.enhanced = "true";

    function preferences() {
      controller.update({
        hidden: document.hidden,
        reducedMotion: motion.matches,
        saveData: Boolean(connection?.saveData)
      });
    }
    preferences();

    // Warm only a nearby card, and decode frames only while it is on screen.
    const nearby =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => controller.update({ near: entry.isIntersecting }), {
            rootMargin: "200px 0px"
          })
        : null;
    const visible =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => controller.update({ visible: entry.isIntersecting && entry.intersectionRatio >= 0.25 }),
            { threshold: [0, 0.25] }
          )
        : null;
    nearby?.observe(container);
    visible?.observe(container);
    motion.addEventListener("change", preferences);
    connection?.addEventListener("change", preferences);
    document.addEventListener("visibilitychange", preferences);
    return () => {
      nearby?.disconnect();
      visible?.disconnect();
      motion.removeEventListener("change", preferences);
      connection?.removeEventListener("change", preferences);
      document.removeEventListener("visibilitychange", preferences);
      controller.dispose();
      playback.current = null;
    };
  }, [src]);

  return (
    <div
      className={`${variant === "chart" ? "landing-chart-artwork" : "landing-product-artwork"} landing-product-animation`}
      style={variant === "chart" ? { aspectRatio: `${width} / ${height}` } : undefined}
      ref={frame}
      data-ready={ready}
    >
      <Image src={poster} alt={alt} width={width} height={height} loading="lazy" unoptimized />
      <video
        id={id}
        ref={video}
        width={width}
        height={height}
        preload="none"
        muted
        playsInline
        loop
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPlaying={() => setReady(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          playback.current?.fail();
          setReady(false);
          setPlaying(false);
          setFailed(true);
        }}
      />
      <button
        className="landing-animation-control"
        type="button"
        aria-label={`${failed ? "Retry" : playing ? "Pause" : "Play"} ${label.toLowerCase()} animation`}
        aria-controls={id}
        onClick={() => {
          setFailed(false);
          playback.current?.toggle();
        }}
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
      {failed && (
        <span className="landing-sr-only" role="status">
          Animation unavailable. Select play to retry.
        </span>
      )}
    </div>
  );
}
