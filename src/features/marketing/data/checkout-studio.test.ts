import { describe, expect, it } from "vitest";
import {
  initialStudioState,
  studioColors,
  studioRails,
  studioReducer,
  studioScenes,
  studioShapes,
  studioSizes
} from "./checkout-studio";

describe("self-running checkout studio", () => {
  it("moves the cursor before applying a setting", () => {
    const cued = studioReducer(initialStudioState, { type: "cue" });
    expect(cued.activeField).toBe("color");
    expect(cued.config).toBe(initialStudioState.config);
    const advanced = studioReducer(cued, { type: "advance" });
    expect(advanced.config.color).toBe("indigo");
    expect(advanced.scene).toBe(1);
  });

  it("cycles all colors, shapes, sizes and the requested payment options", () => {
    let state = initialStudioState;
    const colors = new Set([state.config.color]);
    const shapes = new Set([state.config.shape]);
    const sizes = new Set([state.config.size]);
    const rails = new Set(state.config.rails);
    for (let scene = 0; scene < studioScenes.length; scene += 1) {
      state = studioReducer(state, { type: "advance" });
      colors.add(state.config.color);
      shapes.add(state.config.shape);
      sizes.add(state.config.size);
      state.config.rails.forEach((rail) => rails.add(rail));
      expect(state.config.rails.length).toBeGreaterThan(0);
      expect(state.config.rails.length).toBeLessThanOrEqual(3);
    }
    expect(state.scene).toBe(0);
    expect(state.config).toEqual(initialStudioState.config);
    expect([...colors].sort()).toEqual(studioColors.map((color) => color.id).sort());
    expect([...shapes].sort()).toEqual(studioShapes.map((shape) => shape.id).sort());
    expect([...sizes].sort()).toEqual(studioSizes.map((size) => size.id).sort());
    expect([...rails].sort()).toEqual(studioRails.map((rail) => rail.id).sort());
  });

  it("pauses without resetting and resumes from the same scene", () => {
    const advanced = studioReducer(initialStudioState, { type: "advance" });
    const paused = studioReducer(advanced, { type: "toggle-playback" });
    expect(paused.automatic).toBe(false);
    expect(studioReducer(paused, { type: "advance" })).toBe(paused);
    expect(studioReducer(paused, { type: "cue" })).toBe(paused);
    const resumed = studioReducer(paused, { type: "toggle-playback" });
    expect(resumed.scene).toBe(advanced.scene);
    expect(studioReducer(resumed, { type: "advance" }).config.shape).toBe("round");
  });

  it("groups actual providers under Crypto and Pay later instead of calling USDC a rail", () => {
    expect(studioRails.filter((rail) => rail.group === "Crypto").map((rail) => rail.label)).toEqual([
      "MetaMask",
      "Coinbase Pay",
      "Phantom"
    ]);
    expect(studioRails.filter((rail) => rail.group === "Pay later").map((rail) => rail.label)).toEqual([
      "Klarna",
      "Afterpay"
    ]);
    expect(studioRails.some((rail) => String(rail.id) === "usdc")).toBe(false);
  });

  it("clicks the exact changed control and toggles only one provider per click", () => {
    let state = initialStudioState;
    for (const scene of studioScenes) {
      const cued = studioReducer(state, { type: "cue" });
      expect(cued.activeTarget).toBe(scene.target);
      expect(cued.config).toEqual(state.config);
      const next = studioReducer(cued, { type: "advance" });
      if (scene.field === "rails") {
        const changed = studioRails.filter(
          ({ id }) => state.config.rails.includes(id) !== next.config.rails.includes(id)
        );
        expect(changed).toHaveLength(1);
        expect(scene.target).toBe(`rail-${changed[0].id}`);
      } else {
        expect(scene.target).toBe(`${scene.field}-${next.config[scene.field]}`);
      }
      state = next;
    }
  });
});
