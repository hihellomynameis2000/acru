import { describe, expect, it } from "vitest";
import { landingLightProgress, landingThemeVariables } from "./landing-theme";

describe("the scroll-linked light section", () => {
  it("stays dark before the products enter the viewport", () => {
    expect(landingLightProgress({ top: 1100, bottom: 2300 }, 1000)).toBe(0);
    expect(landingLightProgress({ top: 1000, bottom: 2200 }, 1000)).toBe(0);
  });

  it("fades smoothly in, holds light, and fades back to dark", () => {
    expect(landingLightProgress({ top: 700, bottom: 1900 }, 1000)).toBeCloseTo(0.5);
    expect(landingLightProgress({ top: 400, bottom: 1600 }, 1000)).toBe(1);
    expect(landingLightProgress({ top: 0, bottom: 1200 }, 1000)).toBe(1);
    expect(landingLightProgress({ top: -625, bottom: 575 }, 1000)).toBeCloseTo(0.5);
    expect(landingLightProgress({ top: -900, bottom: 300 }, 1000)).toBe(0);
  });

  it("is reversible and independent of scroll velocity", () => {
    const down = Array.from({ length: 101 }, (_, step) =>
      landingLightProgress({ top: 1000 - step * 6, bottom: 2200 - step * 6 }, 1000)
    );
    const up = Array.from({ length: 101 }, (_, step) =>
      landingLightProgress({ top: 400 + step * 6, bottom: 1600 + step * 6 }, 1000)
    );
    expect(down).toEqual(up.reverse());
    expect(down.every((value, index) => !index || value >= down[index - 1])).toBe(true);
  });

  it("keeps the page, header, navigation, and logo on the same theme", () => {
    expect(landingThemeVariables(0)).toMatchObject({
      "--cinematic-surface": "rgb(29 28 28)",
      "--cinematic-header-rgb": "29 28 28",
      "--cinematic-nav-color": "rgb(255 255 255)",
      "--cinematic-brand-brightness": "0",
      "--cinematic-brand-invert": "1"
    });
    expect(landingThemeVariables(1)).toMatchObject({
      "--cinematic-surface": "rgb(255 255 255)",
      "--landing-theme-surface": "rgb(255 255 255)",
      "--cinematic-header-rgb": "255 255 255",
      "--cinematic-nav-color": "rgb(52 78 92)",
      "--cinematic-brand-brightness": "1",
      "--cinematic-brand-invert": "0"
    });
    expect(landingThemeVariables(0.5)["--cinematic-header-rgb"]).toBe("142 142 142");
  });

  it("does not blend client marks into the surface during the light transition", () => {
    expect(landingThemeVariables(0.3)["--landing-client-logo-invert"]).toBe("1");
    expect(landingThemeVariables(0.5)["--landing-client-logo-invert"]).toBe("0");
  });
});
