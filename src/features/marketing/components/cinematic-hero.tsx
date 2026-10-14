"use client";

import { ChevronRightIcon } from "@shopify/polaris-icons";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { CinematicFrameCache } from "@/features/marketing/components/cinematic-frame-cache";
import { PaymentFlowFilm } from "@/features/marketing/components/payment-flow-film";
import { PaymentFeaturePreview } from "@/features/marketing/components/payment-feature-preview";
import { HeaderNavigation } from "@/features/marketing/components/header-navigation";
import { landingLightProgress, landingThemeVariables } from "@/features/marketing/data/landing-theme";
import {
  cameraState,
  clamp01,
  frameUrl,
  handoffBounds,
  heroAssets,
  heroScrollTravel,
  heroPlaybackState,
  completedHeroScrollTop,
  mobileFrameUrl,
  mobileHandoffLayout,
  mobileHeroAssets,
  openingSceneState,
  paymentFlowItems,
  paymentFeatureHandoffState,
  presentationState,
  slideState,
  compactHeroFramesFor,
  reservedAccordionHeight
} from "@/features/marketing/data/cinematic";

function HeroHeader() {
  const header = useRef<HTMLElement>(null);
  const [navigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    let previousLight = -1;
    const page = header.current?.closest<HTMLElement>(".cinematic-page");
    const products = page?.querySelector<HTMLElement>(".landing-products");
    const paymentFlow = page?.querySelector<HTMLElement>(".cinematic-flow");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      raf = 0;
      // Read geometry before writing any styles, and only update changed colors.
      let light = products ? landingLightProgress(products.getBoundingClientRect(), innerHeight) : 0;
      if (reducedMotion.matches) light = light >= 0.5 ? 1 : 0;
      light = Math.round(light * 1000) / 1000;
      // Reveal the divider with the dark payment-flow scene, not during the camera animation.
      const divider = paymentFlow
        ? clamp01(((header.current?.offsetHeight ?? 64) - paymentFlow.getBoundingClientRect().top) / 64)
        : 0;
      const progress = clamp01(scrollY / Math.max(160, innerHeight * 0.25));
      const opacity = progress * progress * (3 - 2 * progress);
      header.current?.style.setProperty("--cinematic-header-opacity", String(opacity));
      // The animated hero owns this value so mobile and desktop use their own
      // scroll distances. Static layouts follow the section's normal position.
      if (page?.dataset.motion !== "sequence" || page?.dataset.introComplete === "true") {
        header.current?.style.setProperty(
          "--cinematic-header-divider-opacity",
          String(reducedMotion.matches ? Number(divider > 0) : divider)
        );
      }
      if (page && light !== previousLight) {
        previousLight = light;
        for (const [property, value] of Object.entries(landingThemeVariables(light))) {
          page.style.setProperty(property, value);
        }
      }
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <header className="cinematic-header" data-menu-open={navigationOpen} ref={header}>
      <div className="cinematic-header-inner">
        <Link className="cinematic-brand" href="/" aria-label="Acru home">
          {/* The supplied wordmark includes transparent padding. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marketing/acru-wordmark.png" width="660" height="323" alt="Acru" />
        </Link>
        <HeaderNavigation onExpandedChange={setNavigationOpen} />
      </div>
    </header>
  );
}

function PaymentFlowItem({
  item,
  expanded,
  onSelect
}: {
  item: (typeof paymentFlowItems)[number];
  expanded: boolean;
  onSelect: () => void;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const [initiallyExpanded] = useState(expanded);
  const previousExpanded = useRef(expanded);

  useLayoutEffect(() => {
    const element = details.current!;
    element.dataset.enhanced = "true";
    if (previousExpanded.current === expanded) return;
    previousExpanded.current = expanded;

    // Start at the current rendered height, including an interrupted transition.
    const from = element.getBoundingClientRect().height;
    element.style.height = "";
    element.open = true;
    const to = expanded
      ? element.getBoundingClientRect().height
      : element.querySelector("summary")!.getBoundingClientRect().height + element.clientTop;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !element.animate) {
      element.open = expanded;
      return;
    }

    element.style.overflow = "hidden";
    const animation = element.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: 360,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    });
    let settled = false;
    animation.onfinish = () => {
      settled = true;
      element.open = expanded;
      element.style.height = "";
      element.style.overflow = "";
      animation.cancel();
    };

    return () => {
      if (!settled) {
        element.style.height = `${element.getBoundingClientRect().height}px`;
        animation.cancel();
        element.style.overflow = "";
      }
    };
  }, [expanded]);

  return (
    <details ref={details} open={initiallyExpanded} data-expanded={expanded}>
      <summary
        onClick={(event) => {
          event.preventDefault();
          onSelect();
        }}
      >
        {item.title}
      </summary>
      <p>{item.description}</p>
    </details>
  );
}

function PaymentFlow({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div className="cinematic-flow-copy">
      <h2 id="payment-flow-heading">
        See the full
        <br />
        payment flow
      </h2>
      <div className="cinematic-flow-items">
        {paymentFlowItems.map((item) => (
          <PaymentFlowItem key={item.id} item={item} expanded={active === item.id} onSelect={() => onSelect(item.id)} />
        ))}
      </div>
      <a className="cinematic-flow-link" href={paymentFlowItems.find((item) => item.id === active)?.href}>
        Learn more
      </a>
    </div>
  );
}

function HeroCopy({ headingId }: { headingId: string }) {
  return (
    <section className="cinematic-hero-copy" aria-labelledby={headingId}>
      <h1 id={headingId}>Payments infrastructure, built for scale.</h1>
      <p>
        Sell products. Build communities. Accept payments. Manage your
        <br className="cinematic-desktop-break" /> business—from one platform.
      </p>
      <div className="cinematic-actions">
        <a className="cinematic-primary" href="#payment-flow">
          Learn more
        </a>
        <Link className="cinematic-secondary" href="/demo">
          See a demo <ChevronRightIcon aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function CinematicHero({ children, footer }: { children?: ReactNode; footer?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const endpoint = useRef<HTMLImageElement>(null);
  const artwork = useRef<HTMLImageElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const returnHero = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLElement>(null);
  const [activeFeature, setActiveFeature] = useState<string>(paymentFlowItems[0].id);

  useEffect(() => {
    const page = root.current!;
    const scrollTrack = track.current!;
    const sticky = stage.current!;
    const mediaBox = media.current!;
    const visualBox = visual.current!;
    const sceneBox = scene.current!;
    const frameCanvas = canvas.current!;
    const finalImage = endpoint.current!;
    const finalArtwork = artwork.current!;
    const openingContent = opening.current!;
    const staticHero = returnHero.current!;
    const flowContent = flow.current!;
    const featureLayer = page.querySelector<HTMLDivElement>(".cinematic-feature-sequence")!;
    const mobile = matchMedia(`(max-width: ${mobileHeroAssets.breakpoint}px)`);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean };
      deviceMemory?: number;
    };
    const headerElement = page.querySelector<HTMLElement>(".cinematic-header")!;
    let cache: CinematicFrameCache | undefined;
    let compactFrames = false;
    let active = false;
    let failed = false;
    let destroyed = false;
    let raf = 0;
    let scrollStart = 0;
    let cameraDistance = 1;
    let slideDistance = 1;
    let lastY = scrollY;
    let direction = 1;
    let wanted = cameraState(0);
    let lastDrawn = -1;
    let endpointReady = false;
    let artworkReady = false;
    let slide = 0;
    let focusFlow = false;
    let measured = false;
    let measuredFlowWidth = 0;
    let introCompleted = false;
    let presentationBox = {
      width: 1,
      height: 1,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      headerHeight: 64
    };
    const context = frameCanvas.getContext("2d", { alpha: false });

    function setInteractive(element: HTMLElement, enabled: boolean) {
      element.inert = !enabled;
      if (enabled) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", "true");
    }

    function updateLayers() {
      const hasEndpoint =
        endpointReady && (wanted.endpoint || (lastDrawn !== wanted.frame && visualBox.dataset.endpoint === "true"));
      visualBox.dataset.endpoint = String(hasEndpoint);
      finalImage.style.opacity = String(
        wanted.endpoint ? wanted.endpointOpacity : hasEndpoint ? Number(finalImage.style.opacity || 1) : 0
      );
      const readySlide = wanted.endpoint && endpointReady ? slide : 0;
      const transition = slideState(readySlide);
      // Slide the frame sideways without changing its handoff size or height.
      const displayedFrame = hasEndpoint ? heroAssets.handoffFrame : Math.max(0, lastDrawn);
      const presentation = presentationState(displayedFrame, presentationBox);
      const openingScene = openingSceneState(displayedFrame, presentationBox);
      sceneBox.style.width = `${openingScene.width}px`;
      sceneBox.style.height = `${openingScene.height}px`;
      sceneBox.style.left = `${openingScene.left}px`;
      sceneBox.style.top = `${openingScene.top}px`;
      const horizontalOffset = mobile.matches ? 0 : transition.offset * presentation.slideDistance;
      visualBox.style.transform = `translate(${horizontalOffset}px, ${presentation.y}px)`;
      visualBox.dataset.artwork = String(readySlide > 0 && artworkReady);
      const reveal = transition.copyOpacity;
      featureLayer.style.left = `${handoffBounds.left * presentationBox.width + horizontalOffset}px`;
      featureLayer.style.top = `${presentation.dashboardTop}px`;
      featureLayer.style.width = `${handoffBounds.width * presentationBox.width}px`;
      const featureHandoff = paymentFeatureHandoffState(wanted.endpoint && endpointReady, readySlide);
      const paymentsPreload = String(featureHandoff.preload);
      if (page.dataset.paymentsPreload !== paymentsPreload) page.dataset.paymentsPreload = paymentsPreload;
      const paymentsReady = String(featureHandoff.enabled);
      if (page.dataset.paymentsReady !== paymentsReady) page.dataset.paymentsReady = paymentsReady;
      flowContent.style.top = `${
        mobile.matches
          ? mobileHandoffLayout(
              presentationBox.viewportWidth,
              presentationBox.viewportHeight,
              presentationBox.headerHeight,
              0
            ).copyTop
          : presentation.dashboardTop + 20
      }px`;
      flowContent.style.opacity = String(reveal);
      flowContent.style.transform = `translateY(${(1 - reveal) * 18}px)`;
      if (!introCompleted) headerElement.style.setProperty("--cinematic-header-divider-opacity", String(reveal));
      setInteractive(flowContent, reveal > 0.98);
      if (focusFlow && reveal > 0.98) {
        focusFlow = false;
        flowContent.focus({ preventScroll: true });
      }
    }

    function draw(index: number, image: CanvasImageSource) {
      if (!active || !context) return;
      context.drawImage(image, 0, 0, frameCanvas.width, frameCanvas.height);
      lastDrawn = index;
      visualBox.dataset.drawn = "true";
      frameCanvas.dataset.frame = String(index);
      if (!wanted.endpoint && index === wanted.frame) visualBox.dataset.endpoint = "false";
      updateLayers();
    }

    function staticLayout() {
      active = false;
      measured = false;
      cache?.dispose();
      cache = undefined;
      page.dataset.motion = "static";
      page.dataset.paymentsReady = "false";
      page.dataset.paymentsPreload = "false";
      scrollTrack.style.removeProperty("height");
      sticky.style.removeProperty("height");
      mediaBox.style.removeProperty("width");
      flowContent.style.removeProperty("width");
      flowContent.style.removeProperty("left");
      openingContent.style.removeProperty("opacity");
      flowContent.style.removeProperty("opacity");
      flowContent.style.removeProperty("transform");
      flowContent.style.removeProperty("top");
      visualBox.style.removeProperty("transform");
      for (const property of ["width", "height", "left", "top"]) sceneBox.style.removeProperty(property);
      finalImage.style.removeProperty("opacity");
      headerElement.style.setProperty("--cinematic-header-divider-opacity", "0");
      setInteractive(openingContent, true);
      setInteractive(flowContent, true);
    }

    function measure() {
      if (!active) return;
      const previousDistance = scrollY - scrollStart;
      const previousCameraDistance = cameraDistance;
      const previousSlideDistance = slideDistance;
      const previousCameraProgress = clamp01(previousDistance / cameraDistance);
      const previousSlideProgress = clamp01((previousDistance - cameraDistance) / slideDistance);
      scrollStart = scrollTrack.getBoundingClientRect().top + scrollY;
      // 100svh remains steady while a phone's browser toolbar collapses. A
      // changing innerHeight must not rewrite scroll position on every swipe.
      const viewportHeight = mobile.matches ? openingContent.clientHeight : innerHeight;
      const travel = heroScrollTravel(mobile.matches);
      cameraDistance = viewportHeight * travel.camera;
      slideDistance = viewportHeight * travel.slide;
      if (mobile.matches) flowContent.style.width = `${sticky.clientWidth - 48}px`;
      else flowContent.style.removeProperty("width");
      const copy = flowContent.querySelector<HTMLElement>(".cinematic-flow-copy")!;
      if (copy.offsetWidth !== measuredFlowWidth) {
        measuredFlowWidth = copy.offsetWidth;
        // Reserve the tallest tab once per width/font change. Measuring and
        // resizing the sticky track during each accordion frame causes jumps.
        const probe = copy.cloneNode(true) as HTMLElement;
        probe.inert = true;
        probe.setAttribute("aria-hidden", "true");
        probe.style.cssText = `position:absolute;width:${measuredFlowWidth}px;visibility:hidden;pointer-events:none;`;
        probe.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
        probe.querySelectorAll("details").forEach((element) => {
          element.open = true;
          element.style.height = "";
        });
        const items = probe.querySelector<HTMLElement>(".cinematic-flow-items")!;
        items.style.minHeight = "0";
        flowContent.append(probe);
        const height = reservedAccordionHeight(
          items.getBoundingClientRect().height,
          [...items.querySelectorAll("details > p")].map((element) => element.getBoundingClientRect().height)
        );
        probe.remove();
        copy.querySelector<HTMLElement>(".cinematic-flow-items")!.style.minHeight = `${height}px`;
      }
      if (mobile.matches) {
        flowContent.style.width = `${sticky.clientWidth - 48}px`;
        const layout = mobileHandoffLayout(
          sticky.clientWidth,
          viewportHeight,
          headerElement.offsetHeight,
          flowContent.offsetHeight
        );
        mediaBox.style.width = `${layout.frameWidth}px`;
        flowContent.style.left = `${layout.copyLeft}px`;
        sticky.style.height = `${layout.stageHeight}px`;
      } else {
        sticky.style.removeProperty("height");
        mediaBox.style.removeProperty("width");
        flowContent.style.removeProperty("width");
        flowContent.style.removeProperty("left");
      }
      scrollTrack.style.height = `${Math.max(sticky.offsetHeight, viewportHeight) + (introCompleted ? staticHero.offsetHeight : cameraDistance + slideDistance)}px`;
      if (
        measured &&
        !introCompleted &&
        (previousCameraDistance !== cameraDistance || previousSlideDistance !== slideDistance) &&
        previousDistance >= 0 &&
        previousDistance <= previousCameraDistance + previousSlideDistance
      ) {
        const preservedDistance = previousCameraProgress * cameraDistance + previousSlideProgress * slideDistance;
        window.scrollTo({ top: scrollStart + preservedDistance, behavior: "instant" });
      }
      measured = true;
      const bounds = mediaBox.getBoundingClientRect();
      presentationBox = {
        width: bounds.width,
        height: bounds.height,
        viewportWidth: sticky.clientWidth,
        viewportHeight,
        headerHeight: headerElement.getBoundingClientRect().height
      };
      const openingScene = openingSceneState(0, presentationBox);
      const ratio = Math.min(
        devicePixelRatio || 1,
        2,
        (compactFrames ? mobileHeroAssets.width : heroAssets.width) / openingScene.width,
        (compactFrames ? mobileHeroAssets.height : heroAssets.height) / openingScene.height
      );
      const width = Math.max(1, Math.round(openingScene.width * ratio));
      const height = Math.max(1, Math.round(openingScene.height * ratio));
      if (frameCanvas.width !== width || frameCanvas.height !== height) {
        frameCanvas.width = width;
        frameCanvas.height = height;
        // Resizing clears pixels; redraw synchronously before the next paint.
        cache?.redraw();
      }
      schedule();
    }

    function render() {
      raf = 0;
      if (!active) return;
      const y = scrollY;
      if (y !== lastY) direction = y < lastY ? -1 : 1;
      lastY = y;
      const distance = y - scrollStart;
      const playback = heroPlaybackState(distance, cameraDistance, slideDistance, introCompleted, endpointReady);
      const justCompleted = !introCompleted && playback.completed;
      introCompleted = playback.completed;
      page.dataset.introComplete = String(introCompleted);
      wanted = playback.camera;
      slide = playback.slide;
      openingContent.style.opacity = String(wanted.copyOpacity);
      setInteractive(openingContent, wanted.copyOpacity > 0.05);
      const offscreen = distance < -innerHeight || distance > cameraDistance + slideDistance + sticky.offsetHeight;
      cache?.setPaused(introCompleted || document.hidden || offscreen);
      if (!introCompleted && !document.hidden && !offscreen) cache?.request(wanted.frame, direction);
      updateLayers();
      if (justCompleted) {
        // Keep the visible dashboard in exactly the same place, but replace
        // the pinned scroll runway with the original, non-animated hero.
        setInteractive(staticHero, true);
        cache?.dispose();
        cache = undefined;
        scrollTrack.style.height = `${staticHero.offsetHeight + sticky.offsetHeight}px`;
        window.scrollTo({
          top: completedHeroScrollTop(y, staticHero.offsetHeight, cameraDistance, slideDistance),
          behavior: "instant"
        });
      }
    }

    function schedule() {
      if (!raf && !destroyed) raf = requestAnimationFrame(render);
    }

    function configure() {
      if (failed || !context || reducedMotion.matches || connection.connection?.saveData) {
        staticLayout();
        return;
      }
      const nextCompact = compactHeroFramesFor(mobile.matches, connection.deviceMemory);
      if (!active || compactFrames !== nextCompact) {
        cache?.dispose();
        compactFrames = nextCompact;
        active = true;
        page.dataset.motion = "sequence";
        lastDrawn = -1;
        visualBox.dataset.drawn = "false";
        cache = introCompleted
          ? undefined
          : new CinematicFrameCache(
              draw,
              () => {
                failed = true;
                staticLayout();
              },
              compactFrames ? mobileFrameUrl : frameUrl
            );
      }
      measure();
    }

    async function prepareEndpoint() {
      try {
        await finalImage.decode();
        if (!destroyed) {
          endpointReady = true;
          schedule();
        }
      } catch {
        if (!destroyed) {
          failed = true;
          staticLayout();
        }
      }
    }

    async function prepareArtwork() {
      try {
        await finalArtwork.decode();
        if (!destroyed) {
          artworkReady = true;
          schedule();
        }
      } catch {
        /* The exact endpoint remains the product visual if this fails. */
      }
    }

    function goToFlow(event: MouseEvent) {
      const target = (event.target as Element).closest<HTMLAnchorElement>('a[href="#payment-flow"]');
      if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!active) return;
      event.preventDefault();
      history.replaceState(history.state, "", "#payment-flow");
      focusFlow = true;
      window.scrollTo({
        top: scrollStart + (introCompleted ? staticHero.offsetHeight : cameraDistance + slideDistance),
        behavior: "smooth"
      });
    }

    function rememberPosition() {
      if (!active) return;
      const distance = scrollY - scrollStart;
      try {
        sessionStorage.setItem(
          "acru-cinematic-position",
          JSON.stringify({
            camera: clamp01(distance / cameraDistance),
            slide: clamp01((distance - cameraDistance) / slideDistance),
            after: Math.max(0, distance - cameraDistance - slideDistance) / innerHeight
          })
        );
      } catch {
        /* Native restoration still works when browser storage is unavailable. */
      }
    }

    function restorePosition() {
      measure();
      let saved: { camera: number; slide: number; after?: number } | undefined;
      try {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (navigation?.type === "reload" || navigation?.type === "back_forward") {
          saved = JSON.parse(sessionStorage.getItem("acru-cinematic-position") ?? "null");
        }
        sessionStorage.removeItem("acru-cinematic-position");
      } catch {
        /* Storage can be disabled; keep the browser's current scroll position. */
      }
      if (active && saved && Number.isFinite(saved.camera) && Number.isFinite(saved.slide)) {
        window.scrollTo({
          top:
            scrollStart +
            clamp01(saved.camera) * cameraDistance +
            clamp01(saved.slide) * slideDistance +
            (Number.isFinite(saved.after) ? Math.max(0, saved.after!) * innerHeight : 0),
          behavior: "instant"
        });
        schedule();
      }
    }

    configure();
    restorePosition();
    void prepareEndpoint();
    void prepareArtwork();
    void document.fonts.ready.then(() => {
      if (destroyed) return;
      measuredFlowWidth = 0;
      measure();
    });
    const observer = new ResizeObserver(measure);
    observer.observe(mediaBox);
    observer.observe(flowContent);
    mobile.addEventListener("change", configure);
    connection.connection?.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pagehide", rememberPosition);
    window.addEventListener("pageshow", restorePosition);
    document.addEventListener("visibilitychange", schedule);
    page.addEventListener("click", goToFlow);
    if (location.hash === "#payment-flow" && active) window.scrollTo(0, scrollStart + cameraDistance + slideDistance);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      cache?.dispose();
      observer.disconnect();
      mobile.removeEventListener("change", configure);
      connection.connection?.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pagehide", rememberPosition);
      window.removeEventListener("pageshow", restorePosition);
      document.removeEventListener("visibilitychange", schedule);
      page.removeEventListener("click", goToFlow);
    };
  }, []);

  return (
    <div className="cinematic-page" data-motion="static" ref={root}>
      <HeroHeader />
      <main>
        <div className="cinematic-track" ref={track}>
          <div className="cinematic-return-hero" ref={returnHero} inert aria-hidden="true">
            <picture>
              <source media="(max-width: 820px)" srcSet={mobileFrameUrl(0)} />
              <img src={frameUrl(0)} width={2560} height={1440} alt="" />
            </picture>
            <HeroCopy headingId="cinematic-return-heading" />
          </div>
          <div className="cinematic-stage" ref={stage}>
            <div className="cinematic-media" ref={media}>
              <div className="cinematic-visual" ref={visual} aria-hidden="true">
                <div className="cinematic-scene" ref={scene}>
                  <picture>
                    <source media="(max-width: 820px)" srcSet={mobileFrameUrl(0)} />
                    {/* Raw images preserve the approved colors and frame geometry. */}
                    <img
                      className="cinematic-poster"
                      alt=""
                      src={frameUrl(0)}
                      width={2560}
                      height={1440}
                      fetchPriority="high"
                    />
                  </picture>
                  <canvas className="cinematic-canvas" ref={canvas} width={2560} height={1440} />
                </div>
                <picture>
                  <source media="(max-width: 820px)" srcSet={`${mobileHeroAssets.base}/handoff.webp`} />
                  <img
                    className="cinematic-endpoint"
                    ref={endpoint}
                    alt=""
                    src={`${heroAssets.base}/handoff_exact_2560x1440.png`}
                    width={2560}
                    height={1440}
                    decoding="async"
                    style={{
                      paddingInline: `${((1 - heroAssets.handoffFit) / 2) * 100}%`,
                      paddingBlock: `${((1 - heroAssets.handoffFit) / 2) * (9 / 16) * 100}%`
                    }}
                  />
                </picture>
                <div className="cinematic-artwork-layer">
                  <picture>
                    <source media="(max-width: 820px)" srcSet={`${mobileHeroAssets.base}/dashboard.webp`} />
                    <img
                      ref={artwork}
                      src={`${heroAssets.base}/dashboard.png`}
                      alt=""
                      width={3561}
                      height={2532}
                      decoding="async"
                      style={{
                        left: `${handoffBounds.left * 100}%`,
                        top: `${handoffBounds.top * 100}%`,
                        width: `${handoffBounds.width * 100}%`
                      }}
                    />
                  </picture>
                </div>
              </div>
              <PaymentFeaturePreview feature={activeFeature} mode="sequence" />
              <div className="cinematic-opening" ref={opening}>
                <HeroCopy headingId="cinematic-heading" />
              </div>
              <section
                className="cinematic-flow"
                id="payment-flow"
                aria-labelledby="payment-flow-heading"
                ref={flow}
                tabIndex={-1}
              >
                <PaymentFlow active={activeFeature} onSelect={setActiveFeature} />
                <PaymentFeaturePreview feature={activeFeature} mode="static" />
              </section>
            </div>
          </div>
        </div>
        <PaymentFlowFilm />
        {children}
      </main>
      {footer}
    </div>
  );
}
