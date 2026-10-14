import { expect, test, type Page } from "@playwright/test";
import { handoffBounds, heroAssets, mobileHeroAssets } from "../../features/marketing/data/cinematic";

async function cameraProgress(page: Page, progress: number, slide = 0) {
  await page.evaluate(
    ({ progress, slide, cameraTravel, slideTravel, mobileTravel }) => {
      const track = document.querySelector(".cinematic-track")!;
      const top = track.getBoundingClientRect().top + scrollY;
      const mobile = innerWidth <= 820;
      const viewport = mobile ? document.querySelector<HTMLElement>(".cinematic-opening")!.clientHeight : innerHeight;
      window.scrollTo(
        0,
        top +
          viewport *
            ((mobile ? mobileTravel.camera : cameraTravel) * progress +
              (mobile ? mobileTravel.slide : slideTravel) * slide)
      );
    },
    {
      progress,
      slide,
      cameraTravel: heroAssets.cameraTravel,
      slideTravel: heroAssets.slideTravel,
      mobileTravel: { camera: mobileHeroAssets.cameraTravel, slide: mobileHeroAssets.slideTravel }
    }
  );
}

test("hero navigation stays pinned and fades from transparent to the page background", async ({ page }) => {
  await page.goto("/");
  const header = page.locator(".cinematic-header");
  await expect(header).toHaveCSS("position", "fixed");
  expect((await header.boundingBox())!.height).toBeLessThanOrEqual(64);
  expect((await header.locator(".cinematic-brand").boundingBox())!.width).toBeLessThanOrEqual(104);
  await expect(header).toHaveCSS("background-color", "rgba(29, 28, 28, 0)");
  await page.evaluate(() => window.scrollTo(0, Math.max(160, innerHeight * 0.25) / 2));
  await expect
    .poll(() => header.evaluate((element) => Number(element.style.getPropertyValue("--cinematic-header-opacity"))))
    .toBeCloseTo(0.5, 1);
  await page.evaluate(() => window.scrollTo(0, innerHeight));
  await expect(header).toHaveCSS("background-color", "rgb(29, 28, 28)");
  await expect(header.getByRole("link", { name: "Acru home" })).toBeVisible();
  expect((await header.boundingBox())?.y).toBe(0);
  expect(await header.evaluate((element) => Boolean(element.closest("[inert], [aria-hidden='true']")))).toBe(false);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveCSS("background-color", "rgba(29, 28, 28, 0)");
});

test("cinematic homepage matches the supplied composition and includes the payment flow film", async ({
  page
}, testInfo) => {
  const errors: string[] = [];
  const frames: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/frames/")) frames.push(request.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Payments infrastructure, built for scale." })).toBeVisible();
  await expect(page.locator("main .cinematic-hero-copy")).toHaveCount(1);
  await expect(page.locator("main .cinematic-flow")).toHaveCount(1);
  await expect(page.locator("main .cinematic-payment-story")).toHaveCount(1);
  await expect(page.locator(".landing-continuation section")).toHaveCount(5);
  await expect(page.locator(".landing-product")).toHaveCount(4);
  await expect(page.locator(".landing-business")).toHaveCount(4);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.locator(".cinematic-poster")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".cinematic-poster")
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === (innerWidth <= 820 ? 1280 : 2560))
    )
    .toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator(".cinematic-sign-in")).toHaveAttribute(
    "href",
    "https://merchants.acrudevelopment.com/sign-in"
  );
  await expect(page.locator(".cinematic-actions .cinematic-primary")).toHaveCSS("box-shadow", "none");

  if (testInfo.project.name.includes("desktop")) {
    await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion", "sequence");
    await cameraProgress(page, 0.5);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "50");
    await expect(page.locator(".cinematic-opening")).toHaveAttribute("inert", "");
    await cameraProgress(page, 0.92);
    await expect(page.locator(".cinematic-visual")).toHaveAttribute("data-endpoint", "true");
    await expect(page.locator(".cinematic-endpoint")).toHaveCSS("opacity", "1");
    await expect(page.locator(".cinematic-page")).toHaveCSS("background-color", "rgb(29, 28, 28)");
    const sameRect = await page.evaluate(() => {
      const a = document.querySelector("canvas")!.getBoundingClientRect();
      const b = document.querySelector(".cinematic-endpoint")!.getBoundingClientRect();
      return (
        a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height &&
        Math.abs(a.width / a.height - 16 / 9) < 0.001
      );
    });
    expect(sameRect).toBe(true);
    const endpointFits = await page.evaluate((bounds) => {
      const header = document.querySelector(".cinematic-header")!.getBoundingClientRect();
      const fullFrame = document.querySelector(".cinematic-endpoint")!.getBoundingClientRect();
      const top = fullFrame.top + fullFrame.height * bounds.top;
      const height = fullFrame.height * bounds.height;
      return top > header.bottom + 24 && top + height < innerHeight - 24 && height < innerHeight * 0.8;
    }, handoffBounds);
    expect(endpointFits).toBe(true);
    await cameraProgress(page, 0.34);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "30");
    await expect(page.locator(".cinematic-visual")).toHaveAttribute("data-endpoint", "false");
    await page.setViewportSize({ width: testInfo.project.use.viewport!.width, height: 780 });
    await expect
      .poll(() => page.evaluate((travel) => scrollY / (innerHeight * travel), heroAssets.cameraTravel))
      .toBeCloseTo(0.34, 2);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "30");
    await cameraProgress(page, 0.66);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "70");
    await cameraProgress(page, 0.15);
    await cameraProgress(page, 0.7);
    await cameraProgress(page, 0.5);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "50");
    await cameraProgress(page, 1);
    await expect(page.locator(".cinematic-endpoint")).toHaveCSS("opacity", "1");
    const handoffCard = await page.locator(".cinematic-artwork-layer img").boundingBox();
    await cameraProgress(page, 1, 0.2);
    await expect(page.locator(".cinematic-flow")).toHaveCSS("opacity", "0");
    await cameraProgress(page, 1, 0.6);
    await expect
      .poll(() => page.locator(".cinematic-flow").evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0);
    const dividerClearance = await page.evaluate(() => {
      const copy = document.querySelector(".cinematic-flow")!.getBoundingClientRect();
      const dashboard = document.querySelector(".cinematic-artwork-layer img")!.getBoundingClientRect();
      return dashboard.left - copy.right;
    });
    expect(dividerClearance).toBeGreaterThan(0);
    await cameraProgress(page, 1, 0.2);
    await expect(page.locator(".cinematic-flow")).toHaveCSS("opacity", "0");
    await cameraProgress(page, 1, 1);
    await expect(page.getByRole("heading", { name: "See the full payment flow" })).toBeVisible();
    await expect(page.locator(".cinematic-flow")).not.toHaveAttribute("inert", "");
    await expect(page.locator(".cinematic-visual")).toHaveAttribute("data-artwork", "true");
    const alignedArtwork = await page.evaluate((bounds) => {
      const endpoint = document.querySelector(".cinematic-endpoint")!.getBoundingClientRect();
      const artwork = document.querySelector(".cinematic-artwork-layer img")!.getBoundingClientRect();
      return (
        Math.abs((artwork.x - endpoint.x) / endpoint.width - bounds.left) < 0.001 &&
        Math.abs((artwork.y - endpoint.y) / endpoint.height - bounds.top) < 0.001 &&
        Math.abs(artwork.width / endpoint.width - bounds.width) < 0.001 &&
        Math.abs(artwork.width / artwork.height - 3561 / 2532) < 0.001
      );
    }, handoffBounds);
    expect(alignedArtwork).toBe(true);
    const cardOverlapsRightEdge = await page.evaluate(() => {
      const card = document.querySelector(".cinematic-artwork-layer img")!.getBoundingClientRect();
      const copy = document.querySelector(".cinematic-flow")!.getBoundingClientRect();
      return card.left > copy.right + 24 && card.right > innerWidth;
    });
    expect(cardOverlapsRightEdge).toBe(true);
    const sideCard = await page.locator(".cinematic-artwork-layer img").boundingBox();
    expect(sideCard!.width).toBeCloseTo(handoffCard!.width, 1);
    expect(sideCard!.height).toBeCloseTo(handoffCard!.height, 1);
    expect(sideCard!.y).toBeCloseTo(handoffCard!.y, 1);
    await page.screenshot({ path: testInfo.outputPath("payment-flow.png") });
    await cameraProgress(page, 0.5);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "50");
    await page.reload();
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "50");
    await cameraProgress(page, 1, 1);
    await expect(page.locator(".cinematic-flow")).not.toHaveAttribute("inert", "");
  } else {
    await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion", "sequence");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation" })).toBeFocused();
    await expect(page.locator(".cinematic-menu-trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".cinematic-menu-toggle")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".cinematic-menu-toggle .cinematic-menu-lines > span").nth(1)).toHaveCSS("opacity", "0");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
    await expect(page.locator(".cinematic-menu-trigger")).toHaveAttribute("aria-expanded", "false");
    await cameraProgress(page, 0.5);
    await expect(page.locator("canvas")).toHaveAttribute("data-frame", "50");
    await cameraProgress(page, 1, 1);
    await expect(page.locator(".cinematic-flow")).not.toHaveAttribute("inert", "");
    await expect(page.locator(".cinematic-feature-sequence > img")).toBeVisible();
    expect(frames.every((url) => url.includes("v6-mobile-v1"))).toBe(true);
  }
  await page.getByText("Customers & risk", { exact: true }).click();
  await expect(page.getByText("Connect customer activity with payment history.", { exact: false })).toBeVisible();
  await page.getByText("Analytics", { exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("See payment volume, acceptance, revenue, and performance together.", { exact: false })
  ).toBeVisible();
  expect(frames.some((url) => url.endsWith("0101.webp"))).toBe(false);
  expect(frames.every((url) => Number(url.match(/(\d{4})\.webp$/)?.[1]) <= 84)).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced motion, disabled JavaScript, and interrupted image loads preserve usable content", async ({
  page,
  browser
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion", "static");
  await expect(page.getByRole("heading", { name: "Payments infrastructure, built for scale." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "See the full payment flow" })).toBeVisible();
  await expect(page.locator(".cinematic-track")).not.toHaveAttribute("style", /height/);
  if (!testInfo.project.name.includes("desktop")) return;
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion", "sequence");
  await page.route("**/frames/0050.webp", (route) => route.abort());
  await cameraProgress(page, 0.5);
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion", "static");
  await expect(page.locator(".cinematic-opening")).not.toHaveAttribute("inert", "");
  await expect(page.locator(".cinematic-endpoint")).toHaveCSS("opacity", "0");
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const fallback = await noJs.newPage();
  await fallback.goto(new URL("/", page.url()).href);
  await expect(fallback.getByRole("heading", { name: "Payments infrastructure, built for scale." })).toBeVisible();
  await expect(fallback.getByRole("heading", { name: "See the full payment flow" })).toBeVisible();
  await expect(fallback.locator(".cinematic-poster")).toBeVisible();
  await noJs.close();
});
