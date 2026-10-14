export const heroAssets = {
  base: "/media/acru-hero/v6-1440p",
  width: 2560,
  height: 1440,
  lastFrame: 100,
  handoffFrame: 84,
  // The original lossless end still, uniformly fitted to frame 84's UI bounds.
  handoffFit: 0.8425,
  cameraTravel: 2.1,
  slideTravel: 0.45
} as const;

export const mobileHeroAssets = {
  base: "/media/acru-hero/v6-mobile-v1",
  width: 1280,
  height: 720,
  cameraTravel: 1.45,
  slideTravel: 0.28,
  breakpoint: 820
} as const;

export function heroScrollTravel(mobile: boolean) {
  const assets = mobile ? mobileHeroAssets : heroAssets;
  return { camera: assets.cameraTravel, slide: assets.slideTravel };
}

export function compactHeroFramesFor(mobile: boolean, deviceMemory?: number) {
  return mobile || (deviceMemory !== undefined && deviceMemory <= 4);
}

export function reservedAccordionHeight(allExpandedHeight: number, panelHeights: readonly number[]) {
  return Math.ceil(
    allExpandedHeight - panelHeights.reduce((sum, height) => sum + height, 0) + Math.max(0, ...panelHeights)
  );
}

// The card stays entirely in view on phones, with the tabs below it. The stage
// includes the full copy height so large text and short screens never trap it.
export function mobileHandoffLayout(
  viewportWidth: number,
  viewportHeight: number,
  headerHeight: number,
  copyHeight: number
) {
  const cardWidth = Math.max(1, viewportWidth - 48);
  const frameWidth = cardWidth / handoffBounds.width;
  const frameHeight = frameWidth * (9 / 16);
  const dashboardTop = Math.max(headerHeight + 28, frameHeight * handoffBounds.top);
  const copyTop = dashboardTop + frameHeight * handoffBounds.height + 36;
  return {
    frameWidth,
    frameHeight,
    copyTop,
    copyLeft: (frameWidth - viewportWidth) / 2 + 24,
    cardWidth,
    stageHeight: Math.max(viewportHeight, copyTop + copyHeight + 48)
  };
}

export const paymentsFeatureAsset = {
  src: "/media/acru-payments-feature/v3/payments-feature.mp4",
  poster: "/media/acru-payments-feature/v3/poster.webp",
  width: 1780,
  height: 1266,
  label: "payments",
  description: "Acru payments preview, from the dashboard to transactions and payment details"
} as const;

export const customersRiskFeatureAsset = {
  src: "/media/acru-customers-risk-feature/v2/customers-risk-feature.mp4",
  poster: "/media/acru-customers-risk-feature/v2/poster.webp",
  width: 1780,
  height: 1266,
  label: "customers and risk",
  description: "Acru customers and risk preview, from customer activity to individual risk profiles"
} as const;

export const balancesSettlementsFeatureAsset = {
  src: "/media/acru-balances-settlements-feature/v1/balances-settlements-feature.mp4",
  poster: "/media/acru-balances-settlements-feature/v1/poster.webp",
  width: 1780,
  height: 1266,
  label: "balances and settlements",
  description: "Acru balances and settlements preview showing bank accounts, payout schedules, and settlement details"
} as const;

export const analyticsFeatureAsset = {
  src: "/media/acru-analytics-feature/v2/analytics-feature.mp4",
  poster: "/media/acru-analytics-feature/v2/poster.webp",
  width: 1780,
  height: 1266,
  label: "analytics",
  description: "Acru analytics preview showing acceptance rates, approval trends, and decline reasons"
} as const;

export function paymentFeatureAssetFor(feature: string) {
  if (feature === "payments") return paymentsFeatureAsset;
  if (feature === "customers-risk") return customersRiskFeatureAsset;
  if (feature === "balances-settlements") return balancesSettlementsFeatureAsset;
  if (feature === "analytics") return analyticsFeatureAsset;
  return undefined;
}

export const handoffBounds = {
  left: (1 - heroAssets.handoffFit) / 2 + 0.141970921 * heroAssets.handoffFit,
  top: (1 - heroAssets.handoffFit) / 2 + 0.047421499 * heroAssets.handoffFit,
  width: 0.716058204 * heroAssets.handoffFit,
  height: 0.9051562 * heroAssets.handoffFit
} as const;

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

export function frameUrl(index: number) {
  const frame = Math.round(clamp01(index / heroAssets.lastFrame) * heroAssets.lastFrame);
  return `${heroAssets.base}/frames/${String(frame).padStart(4, "0")}.webp`;
}

export function mobileFrameUrl(index: number) {
  const frame = Math.min(
    heroAssets.handoffFrame,
    Math.round(clamp01(index / heroAssets.lastFrame) * heroAssets.lastFrame)
  );
  return `${mobileHeroAssets.base}/frames/${String(frame).padStart(4, "0")}.webp`;
}

export function cameraState(progress: number) {
  const p = clamp01(progress);
  return {
    frame: Math.min(heroAssets.handoffFrame, Math.round(clamp01((p - 0.1) / 0.8) * heroAssets.lastFrame)),
    endpoint: p >= 0.78,
    endpointOpacity: clamp01((p - 0.78) / 0.12),
    copyOpacity: 1 - clamp01((p - 0.07) / 0.12)
  };
}

export function heroPlaybackState(
  distance: number,
  cameraDistance: number,
  slideDistance: number,
  completed: boolean,
  endpointReady: boolean
) {
  // Once the full handoff has finished, returning up the page must not scrub
  // the camera or slide the dashboard back over the payment-flow copy.
  const finished = completed || (endpointReady && distance >= cameraDistance + slideDistance);
  return {
    completed: finished,
    camera: cameraState(finished ? 1 : distance / cameraDistance),
    slide: finished ? 1 : clamp01((distance - cameraDistance) / slideDistance)
  };
}

export function completedHeroScrollTop(
  scrollTop: number,
  heroHeight: number,
  cameraDistance: number,
  slideDistance: number
) {
  // Replace the consumed pinned travel with a normal static hero above the
  // finished section, preserving the section's exact position on screen.
  return Math.max(0, scrollTop + heroHeight - cameraDistance - slideDistance);
}

export function slideState(progress: number) {
  // Only the web-owned sideways move eases; the authored camera stays linear.
  const offset = 1 - (1 - clamp01(progress)) ** 3;
  return {
    offset,
    // Wait until the dashboard clears the full copy column and its dividers.
    copyOpacity: clamp01((offset - 0.82) / 0.18)
  };
}

export function paymentFeatureHandoffState(endpointReady: boolean, slideProgress: number) {
  return {
    // Buffer during the final camera hold; don't compete with the opening frames.
    preload: endpointReady,
    // Start alongside the first visible copy, not after its fade has finished.
    enabled: endpointReady && slideState(slideProgress).copyOpacity > 0
  };
}

export function openingSceneState(
  frame: number,
  box: { width: number; height: number; viewportWidth: number; viewportHeight: number }
) {
  // Cover the opening viewport, then settle back into the approved handoff box.
  // Phones use a gradual fit throughout the camera move instead of zooming
  // beyond their narrow viewport and shrinking abruptly at the endpoint.
  const start = box.viewportWidth <= mobileHeroAssets.breakpoint ? 0 : 60;
  const progress = clamp01((frame - start) / (heroAssets.handoffFrame - start));
  const cover = 1 - progress * progress * (3 - 2 * progress);
  const coverWidth = Math.max(box.viewportWidth, box.viewportHeight * (16 / 9));
  const coverHeight = coverWidth * (9 / 16);
  const width = box.width + (coverWidth - box.width) * cover;
  return {
    width,
    height: box.height + (coverHeight - box.height) * cover,
    left: (box.width - width) / 2,
    top: ((box.viewportHeight - coverHeight) / 2) * cover
  };
}

export function presentationState(
  frame: number,
  box: { width: number; height: number; viewportHeight: number; headerHeight: number }
) {
  // Hold the selected camera size and vertical position through the sideways
  // handoff. The dashboard intentionally continues beyond the right edge.
  const y = Math.max(0, box.headerHeight + 28 - box.height * handoffBounds.top) * clamp01((frame - 70) / 14);
  return {
    y,
    slideDistance: box.width * (0.48 - handoffBounds.left),
    dashboardTop: box.height * handoffBounds.top + y
  };
}

export const cinematicNavigation = [
  { label: "Products", href: "#products" },
  { label: "Solutions", href: "#businesses" },
  { label: "Developers", href: "/developers/documentation" },
  { label: "Pricing", href: "mailto:sales@acru.com?subject=Acru%20pricing" }
] as const;

export const paymentFlowItems = [
  {
    id: "payments",
    title: "Payments",
    description:
      "See every transaction from authorization through settlement. Manage refunds, disputes, subscriptions, and payment activity from one place.",
    href: "https://merchants.acrudevelopment.com/payments/transactions"
  },
  {
    id: "customers-risk",
    title: "Customers & risk",
    description:
      "Connect customer activity with payment history. Review authentication, monitor risk, and keep disputes and customer information in view.",
    href: "https://merchants.acrudevelopment.com/payments/customers"
  },
  {
    id: "balances-settlements",
    title: "Balances & settlements",
    description:
      "Know what is available, pending, and in reserve. Follow funds from the customer payment to your balance and final settlement.",
    href: "https://merchants.acrudevelopment.com/balances"
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "See payment volume, acceptance, revenue, and performance together. Understand what changed and explore the activity behind the numbers.",
    href: "https://merchants.acrudevelopment.com/reports/analytics"
  }
] as const;
