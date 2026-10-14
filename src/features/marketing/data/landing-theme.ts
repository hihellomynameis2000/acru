function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/** Fade the whole scene as the light section enters and leaves the viewport. */
export function landingLightProgress(section: { top: number; bottom: number }, viewportHeight: number) {
  if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) return 0;
  const enter = smoothstep((viewportHeight - section.top) / (viewportHeight * 0.6));
  const leave = smoothstep((section.bottom - viewportHeight * 0.3) / (viewportHeight * 0.55));
  return Math.min(enter, leave);
}

function mix(from: readonly number[], to: readonly number[], progress: number) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * progress)).join(" ");
}

export function landingThemeVariables(progress: number) {
  const light = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const surface = mix([29, 28, 28], [255, 255, 255], light);
  const ink = mix([255, 255, 255], [52, 78, 92], light);
  const muted = mix([206, 204, 204], [92, 118, 133], light);
  return {
    "--cinematic-surface": `rgb(${surface})`,
    "--landing-theme-surface": `rgb(${surface})`,
    "--landing-theme-ink": `rgb(${ink})`,
    "--landing-theme-muted": `rgb(${muted})`,
    // Keep client artwork legible instead of fading through mid-gray on gray.
    "--landing-client-ink": light >= 0.39 ? "#000" : "#fff",
    "--landing-client-logo-invert": light >= 0.39 ? "0" : "1",
    "--cinematic-header-rgb": surface,
    "--cinematic-nav-color": `rgb(${ink})`,
    "--cinematic-nav-hover-rgb": ink,
    "--cinematic-brand-brightness": String(light),
    "--cinematic-brand-invert": String(1 - light)
  };
}
