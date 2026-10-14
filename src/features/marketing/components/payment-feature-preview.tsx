"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ProductAnimationPlayback } from "./product-animation-playback";
import { heroAssets, paymentFeatureAssetFor } from "../data/cinematic";

type Environment = { near: boolean; visible: boolean; hidden: boolean; reducedMotion: boolean; saveData: boolean };
const initialEnvironment: Environment = {
  near: false,
  visible: false,
  hidden: true,
  reducedMotion: false,
  saveData: false
};

function FeatureLayer({
  feature,
  selected,
  shown,
  environment,
  onReady
}: {
  feature: string;
  selected: boolean;
  shown: boolean;
  environment: Environment;
  onReady: (feature: string) => void;
}) {
  const asset = paymentFeatureAssetFor(feature);
  const id = useId();
  const video = useRef<HTMLVideoElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const controller = useRef<ProductAnimationPlayback | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const player = asset ? new ProductAnimationPlayback(video.current!, asset.src) : null;
    controller.current = player;
    return () => {
      player?.dispose();
      controller.current = null;
    };
  }, [asset]);

  useEffect(() => {
    controller.current?.update({
      ...environment,
      near: selected && environment.near,
      visible: selected && environment.visible
    });
  }, [selected, environment]);

  useEffect(() => {
    if (selected && poster.current?.complete && poster.current.naturalWidth > 0) onReady(feature);
  }, [selected, onReady, feature]);

  return (
    <div
      className="cinematic-feature-layer"
      data-shown={shown}
      data-ready={ready}
      aria-hidden={!shown}
      inert={!selected || !shown}
    >
      {/* Keep the outgoing video mounted and paused until this poster is decoded. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={poster}
        src={asset?.poster ?? `${heroAssets.base}/dashboard.png`}
        width={3561}
        height={2532}
        alt={asset?.description ?? "Acru payment dashboard"}
        loading="lazy"
        onLoad={() => onReady(feature)}
      />
      <video
        ref={video}
        id={id}
        poster={asset?.poster}
        width={asset?.width ?? 1780}
        height={asset?.height ?? 1266}
        preload="none"
        muted
        playsInline
        loop
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onPlaying={() => {
          setReady(true);
          setFailed(false);
          onReady(feature);
        }}
        onError={() => {
          controller.current?.fail();
          setFailed(true);
          setReady(false);
        }}
      />
      {asset && selected && shown && (
        <button
          type="button"
          className="cinematic-feature-control"
          aria-controls={id}
          aria-label={`${failed ? "Retry" : playing ? "Pause" : "Play"} ${asset.label} feature animation`}
          onClick={() => controller.current?.toggle()}
        >
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

export function PaymentFeaturePreview({ feature, mode }: { feature: string; mode: "sequence" | "static" }) {
  const frame = useRef<HTMLDivElement>(null);
  const [environment, setEnvironment] = useState(initialEnvironment);
  const [shown, setShown] = useState(feature);
  const [leaving, setLeaving] = useState<string | null>(null);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setLeaving(null), 280);
    return () => clearTimeout(timer);
  }, [leaving, shown]);

  useEffect(() => {
    const element = frame.current!;
    const page = element.closest<HTMLElement>(".cinematic-page")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let near = false;
    let visible = false;
    function sync() {
      const layoutActive = page.dataset.motion === mode;
      const enabled = layoutActive && (mode === "static" || page.dataset.paymentsReady === "true");
      const canPreload = layoutActive && (mode === "static" || page.dataset.paymentsPreload === "true");
      element.dataset.enabled = String(enabled);
      element.inert = !enabled;
      const next = {
        near: canPreload && near,
        visible: enabled && visible,
        hidden: document.hidden,
        reducedMotion: motion.matches,
        saveData: Boolean(connection?.saveData)
      };
      setEnvironment((previous) =>
        Object.keys(next).every((key) => previous[key as keyof Environment] === next[key as keyof Environment])
          ? previous
          : next
      );
    }
    const nearby = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px 0px" }
    );
    // A cropped desktop card or short landscape phone can still have a useful
    // visible area. Do not oscillate playback at a 20% intersection boundary.
    const onScreen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    const presentation = new MutationObserver(sync);
    nearby.observe(element);
    onScreen.observe(element);
    presentation.observe(page, {
      attributes: true,
      attributeFilter: ["data-motion", "data-payments-ready", "data-payments-preload"]
    });
    motion.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      nearby.disconnect();
      onScreen.disconnect();
      presentation.disconnect();
      motion.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [mode]);

  const ready = useCallback(
    (next: string) => {
      if (next !== feature || next === shown) return;
      setLeaving(shown);
      setShown(next);
    },
    [feature, shown]
  );

  const layers = [...new Set([leaving, shown, feature].filter((value): value is string => Boolean(value)))];
  return (
    <div className={`cinematic-feature-preview cinematic-feature-${mode}`} ref={frame} aria-busy={feature !== shown}>
      {layers.map((value) => (
        <FeatureLayer
          key={value}
          feature={value}
          selected={value === feature}
          shown={value === shown || value === leaving}
          environment={environment}
          onReady={ready}
        />
      ))}
    </div>
  );
}
