import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  analyticsFeatureAsset,
  balancesSettlementsFeatureAsset,
  cameraState,
  customersRiskFeatureAsset,
  frameUrl,
  handoffBounds,
  heroAssets,
  heroScrollTravel,
  heroPlaybackState,
  completedHeroScrollTop,
  compactHeroFramesFor,
  mobileFrameUrl,
  mobileHandoffLayout,
  mobileHeroAssets,
  openingSceneState,
  paymentsFeatureAsset,
  paymentFeatureAssetFor,
  paymentFeatureHandoffState,
  presentationState,
  slideState,
  reservedAccordionHeight
} from "@/features/marketing/data/cinematic";

describe("mobile hero", () => {
  it("reserves the longest tab instead of moving the sticky track during expansion", () => {
    expect(reservedAccordionHeight(590, [80, 110, 100, 90])).toBe(320);
    expect(reservedAccordionHeight(591.2, [80, 110, 100, 90])).toBe(322);
    expect(reservedAccordionHeight(210, [])).toBe(210);
  });
  it.each([
    [320, 568],
    [375, 667],
    [390, 844],
    [430, 932],
    [768, 1024],
    [812, 375]
  ])("fits the dashboard and keeps the full tabs reachable at %i × %i", (viewportWidth, viewportHeight) => {
    for (const copyHeight of [420, 650, 1200]) {
      const layout = mobileHandoffLayout(viewportWidth, viewportHeight, 56, copyHeight);
      const box = {
        width: layout.frameWidth,
        height: layout.frameHeight,
        viewportWidth,
        viewportHeight,
        headerHeight: 56
      };
      const presentation = presentationState(84, box);
      const frameLeft = (viewportWidth - layout.frameWidth) / 2;
      const cardLeft = frameLeft + layout.frameWidth * handoffBounds.left;
      expect(cardLeft).toBeCloseTo(24, 0);
      expect(cardLeft + layout.cardWidth).toBeLessThan(viewportWidth - 23);
      expect(presentation.dashboardTop).toBeCloseTo(Math.max(84, layout.frameHeight * handoffBounds.top));
      expect(layout.copyTop - (presentation.dashboardTop + layout.frameHeight * handoffBounds.height)).toBeCloseTo(36);
      expect(frameLeft + layout.copyLeft).toBeCloseTo(24);
      expect(layout.stageHeight).toBeGreaterThanOrEqual(viewportHeight);
      expect(layout.stageHeight - layout.copyTop - copyHeight).toBeGreaterThanOrEqual(48 - 0.001);
      const start = openingSceneState(0, box);
      expect(start.width).toBeGreaterThanOrEqual(viewportWidth);
      expect(start.height + 0.001).toBeGreaterThanOrEqual(viewportHeight);
      expect(openingSceneState(84, box)).toMatchObject({ width: layout.frameWidth, height: layout.frameHeight });
      let previousWidth = start.width;
      for (let frame = 1; frame <= 84; frame++) {
        const scene = openingSceneState(frame, box);
        // Portrait framing settles progressively, without a late resize jump.
        expect(Math.abs(scene.width - previousWidth)).toBeLessThan(
          Math.abs(start.width - layout.frameWidth) * 0.02 + 0.01
        );
        expect(scene.width / scene.height).toBeCloseTo(16 / 9);
        previousWidth = scene.width;
      }
    }
  });
  it("uses compact frames instead of disabling phones and 4GB devices", () => {
    expect(compactHeroFramesFor(true)).toBe(true);
    expect(compactHeroFramesFor(true, 4)).toBe(true);
    expect(compactHeroFramesFor(false, 4)).toBe(true);
    expect(compactHeroFramesFor(false, 8)).toBe(false);
    expect(compactHeroFramesFor(false)).toBe(false);
    expect(heroScrollTravel(true)).toEqual({ camera: 1.45, slide: 0.28 });
    expect(heroScrollTravel(false)).toEqual({ camera: 2.1, slide: 0.45 });
    expect(mobileFrameUrl(-1)).toMatch(/0000.webp$/);
    expect(mobileFrameUrl(100)).toMatch(/0084.webp$/);
  });
  it("ships every mobile frame with a bounded download and decode size", () => {
    let total = 0;
    for (let index = 0; index <= 84; index++) {
      const asset = readFileSync(resolve(process.cwd(), "public", mobileFrameUrl(index).slice(1)));
      expect(asset.subarray(8, 12).toString()).toBe("WEBP");
      expect(asset.length).toBeLessThan(85 * 1024);
      total += asset.length;
    }
    expect(total).toBeLessThan(4 * 1024 * 1024);
    expect(mobileHeroAssets.width * mobileHeroAssets.height * 4 * 5).toBeLessThan(18 * 1024 * 1024);
    for (const name of ["handoff.webp", "dashboard.webp"]) {
      const asset = readFileSync(resolve(process.cwd(), "public", mobileHeroAssets.base.slice(1), name));
      expect(asset.subarray(8, 12).toString()).toBe("WEBP");
      expect(asset.length).toBeLessThan(85 * 1024);
    }
  });
});

describe("approved V6 scroll mapping", () => {
  it("buffers the feature at the camera endpoint and starts when the copy begins to appear", () => {
    expect(paymentFeatureHandoffState(false, 0)).toEqual({ preload: false, enabled: false });
    expect(paymentFeatureHandoffState(false, 1)).toEqual({ preload: false, enabled: false });
    expect(paymentFeatureHandoffState(true, 0)).toEqual({ preload: true, enabled: false });
    expect(slideState(0.5).copyOpacity).toBeGreaterThan(0);
    expect(slideState(0.5).copyOpacity).toBeLessThan(0.98);
    expect(paymentFeatureHandoffState(true, 0.5)).toEqual({ preload: true, enabled: true });
    expect(paymentFeatureHandoffState(true, 1)).toEqual({ preload: true, enabled: true });
  });
  it.each([false, true])("returns to a static top hero without moving the handoff (mobile: %s)", (mobile) => {
    const travel = heroScrollTravel(mobile);
    const heroHeight = 800;
    const camera = travel.camera * heroHeight;
    const slide = travel.slide * heroHeight;
    const trackStart = 24;
    for (const overshoot of [0, 30, 900, 2000]) {
      const before = trackStart + camera + slide + overshoot;
      const after = completedHeroScrollTop(before, heroHeight, camera, slide);
      expect(after).toBeCloseTo(trackStart + heroHeight + overshoot);
      expect(trackStart + heroHeight - after).toBeCloseTo(-overshoot);
    }
  });
  it.each([false, true])("plays the intro once without rewinding after the handoff (mobile: %s)", (mobile) => {
    const travel = heroScrollTravel(mobile);
    const camera = travel.camera * 800;
    const slide = travel.slide * 800;
    let completed = false;
    for (const distance of [0, camera / 2, 0, camera, camera + slide - 1]) {
      const state = heroPlaybackState(distance, camera, slide, completed, true);
      expect(state.completed).toBe(false);
      completed = state.completed;
    }
    expect(heroPlaybackState(camera + slide, camera, slide, false, false).completed).toBe(false);
    for (const distance of [camera + slide, camera, camera / 2, 0, -100, camera + slide * 3]) {
      const state = heroPlaybackState(distance, camera, slide, completed, true);
      expect(state).toEqual({ completed: true, camera: cameraState(1), slide: 1 });
      completed = state.completed;
    }
    // Responsive remeasurement cannot reset the completed scene.
    expect(heroPlaybackState(0, camera * 0.6, slide * 0.6, completed, true).completed).toBe(true);
  });
  it.each([
    [3000, 1644],
    [2560, 1080],
    [3440, 1440],
    [1920, 1080],
    [1440, 1000],
    [1024, 900]
  ])("covers the opening at %i × %i without changing the handoff card", (viewportWidth, viewportHeight) => {
    const width = Math.min(viewportWidth, viewportHeight * (16 / 9));
    const box = { width, height: width * (9 / 16), viewportWidth, viewportHeight };
    const opening = openingSceneState(0, box);
    const margin = (viewportWidth - box.width) / 2;
    expect(opening.width).toBeGreaterThanOrEqual(viewportWidth);
    expect(opening.height + 0.001).toBeGreaterThanOrEqual(viewportHeight);
    expect(margin + opening.left).toBeLessThanOrEqual(0.001);
    expect(margin + opening.left + opening.width).toBeGreaterThanOrEqual(viewportWidth - 0.001);
    expect(opening.top).toBeLessThanOrEqual(0.001);
    expect(opening.top + opening.height).toBeGreaterThanOrEqual(viewportHeight - 0.001);
    expect(openingSceneState(60, box)).toEqual(opening);
    expect(openingSceneState(heroAssets.handoffFrame, box)).toEqual({
      width: box.width,
      height: box.height,
      left: 0,
      top: expect.closeTo(0, 10)
    });
    let previousWidth = opening.width;
    for (let frame = 61; frame <= heroAssets.handoffFrame; frame++) {
      const current = openingSceneState(frame, box);
      expect(current.width).toBeLessThanOrEqual(previousWidth);
      expect(current.width).toBeGreaterThanOrEqual(box.width);
      expect(current.width / current.height).toBeCloseTo(16 / 9);
      previousWidth = current.width;
    }
  });
  it("holds the opening and stops the camera at the user-selected frame 84", () => {
    expect(cameraState(-1).frame).toBe(0);
    expect(cameraState(0.1).frame).toBe(0);
    expect(cameraState(0.5).frame).toBe(50);
    expect(cameraState(0.9)).toMatchObject({ frame: 84, endpoint: true });
    expect(cameraState(2).frame).toBe(84);
    for (let frame = 0; frame <= 84; frame++) {
      expect(cameraState(0.1 + (frame / 100) * 0.8).frame).toBe(frame);
    }
    expect(frameUrl(101)).toMatch(/0100.webp$/);
    expect(frameUrl(-1)).toMatch(/0000.webp$/);
  });

  it("fades the room out only after the camera reaches the selected handoff", () => {
    expect(cameraState(0.775)).toMatchObject({ frame: 84, endpoint: false });
    expect(cameraState(0.84)).toMatchObject({ frame: 84, endpoint: true });
    expect(cameraState(0.84).endpointOpacity).toBeCloseTo(0.5);
    expect(cameraState(0.9).endpointOpacity).toBe(1);
    expect(cameraState(0.2).copyOpacity).toBe(0);
  });

  it("snaps sideways quickly and never reveals dividers underneath the dashboard", () => {
    expect(heroAssets.slideTravel).toBe(0.45);
    expect(slideState(0)).toEqual({ offset: 0, copyOpacity: 0 });
    expect(slideState(0.5).offset).toBe(0.875);
    expect(slideState(1).offset).toBe(1);
    expect(slideState(1).copyOpacity).toBeCloseTo(1);
    for (let step = 100; step >= 0; step--) {
      const state = slideState(step / 100);
      if (state.copyOpacity > 0) {
        const dashboardLeft = handoffBounds.left + state.offset * (0.48 - handoffBounds.left);
        const dividerRight = 0.085 + 0.285;
        expect(dashboardLeft - dividerRight).toBeGreaterThan(0.05);
      }
    }
  });

  it("holds the handoff size below the nav and slides the right edge off-screen", () => {
    for (const [width, height, viewportHeight] of [
      [1440, 810, 1000],
      [1386, 780, 780],
      [1024, 576, 900]
    ]) {
      const box = { width, height, viewportHeight, headerHeight: 64 };
      expect(presentationState(0, box).y).toBe(0);
      const end = presentationState(84, box);
      const dashboardHeight = height * handoffBounds.height;
      expect(end.dashboardTop).toBeGreaterThan(88);
      expect(end.dashboardTop + dashboardHeight).toBeLessThan(viewportHeight - 24);
      const dashboardLeft = width * handoffBounds.left;
      const dashboardRight = dashboardLeft + end.slideDistance + width * handoffBounds.width;
      expect(dashboardLeft + end.slideDistance).toBeCloseTo(width * 0.48);
      expect(dashboardRight).toBeGreaterThan(width);
      for (let step = 0; step <= 100; step++) {
        const slide = slideState(step / 100);
        if (slide.copyOpacity > 0) {
          expect(dashboardLeft + slide.offset * end.slideDistance).toBeGreaterThan(width * 0.37 + 24);
        }
      }
    }
  });
});

describe("payment feature selection", () => {
  it("retains Payments' opening transition but starts Customers directly on its feature", () => {
    expect(paymentsFeatureAsset.src).toContain("/acru-payments-feature/v3/");
    expect(paymentsFeatureAsset.poster).toContain("/acru-payments-feature/v3/");
    expect(customersRiskFeatureAsset.src).toContain("/acru-customers-risk-feature/v2/");
  });
  it("selects each tab's own film without loading one for unknown tabs", () => {
    expect(paymentFeatureAssetFor("payments")).toBe(paymentsFeatureAsset);
    expect(paymentFeatureAssetFor("customers-risk")).toBe(customersRiskFeatureAsset);
    expect(customersRiskFeatureAsset.src).not.toBe(paymentsFeatureAsset.src);
    expect(customersRiskFeatureAsset.poster).not.toBe(paymentsFeatureAsset.poster);
    expect(paymentFeatureAssetFor("balances-settlements")).toBe(balancesSettlementsFeatureAsset);
    const films = [
      paymentsFeatureAsset,
      customersRiskFeatureAsset,
      balancesSettlementsFeatureAsset,
      analyticsFeatureAsset
    ];
    expect(new Set(films.map((film) => film.src)).size).toBe(4);
    expect(new Set(films.map((film) => film.poster)).size).toBe(4);
    expect(paymentFeatureAssetFor("analytics")).toBe(analyticsFeatureAsset);
    expect(analyticsFeatureAsset.src).toContain("/acru-analytics-feature/v2/");
    expect(analyticsFeatureAsset.poster).toContain("/acru-analytics-feature/v2/");
    expect(paymentFeatureAssetFor("unknown")).toBeUndefined();
  });
});

describe.each([
  paymentsFeatureAsset,
  customersRiskFeatureAsset,
  balancesSettlementsFeatureAsset,
  analyticsFeatureAsset
])("$label feature film", (asset) => {
  it("uses a lightweight matching first-frame still while loading", () => {
    expect(asset.poster).not.toContain("dashboard");
    expect(asset.poster).toBe(asset.src.replace(/[^/]+$/, "poster.webp"));
    const poster = readFileSync(resolve(process.cwd(), "public", asset.poster.slice(1)));
    expect(poster.subarray(8, 12).toString()).toBe("WEBP");
    expect(poster.length).toBeLessThan(150 * 1024);
  });
  it("fits the existing dashboard without changing the hero camera size", () => {
    expect(asset.width / asset.height).toBeCloseTo(3561 / 2532, 3);
    expect(heroAssets.handoffFrame).toBe(84);
  });
  it("keeps the supplied film small and streamable", () => {
    const mp4 = readFileSync(resolve(process.cwd(), "public", asset.src.slice(1)));
    expect(mp4.length).toBeLessThan(600 * 1024);
    const boxes: string[] = [];
    for (let offset = 0; offset + 8 <= mp4.length;) {
      const size = mp4.readUInt32BE(offset);
      if (size < 8) break;
      boxes.push(mp4.subarray(offset + 4, offset + 8).toString());
      offset += size;
    }
    expect(boxes).toContain("moov");
    expect(boxes).toContain("mdat");
    expect(boxes.indexOf("moov")).toBeLessThan(boxes.indexOf("mdat"));
  });
});
