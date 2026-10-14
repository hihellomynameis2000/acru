import { describe, expect, it } from "vitest";
import { legalTocScrollTop } from "./legal-toc-scroll";

const viewport = { viewportTop: 100, viewportHeight: 300, scrollTop: 200, scrollHeight: 1200 };

describe("active policy sidebar item visibility", () => {
  it("leaves a fully visible link and the reader’s position alone", () => {
    expect(legalTocScrollTop({ ...viewport, itemTop: 180, itemHeight: 60 })).toBeNull();
  });

  it("moves down only enough to reveal a clipped or offscreen link", () => {
    expect(legalTocScrollTop({ ...viewport, itemTop: 380, itemHeight: 52 })).toBe(244);
    expect(legalTocScrollTop({ ...viewport, itemTop: 800, itemHeight: 52 })).toBe(664);
  });

  it("moves back up when an earlier section becomes active", () => {
    expect(legalTocScrollTop({ ...viewport, itemTop: 70, itemHeight: 52 })).toBe(158);
  });

  it("clamps the first and last links to the list’s scroll range", () => {
    expect(legalTocScrollTop({ ...viewport, scrollTop: 5, itemTop: 95, itemHeight: 52 })).toBe(0);
    expect(legalTocScrollTop({ ...viewport, scrollTop: 890, itemTop: 370, itemHeight: 52 })).toBe(900);
    expect(legalTocScrollTop({ ...viewport, scrollTop: 900, itemTop: 348, itemHeight: 52 })).toBeNull();
  });

  it("ignores hidden mobile/desktop lists and lists that do not overflow", () => {
    expect(legalTocScrollTop({ ...viewport, viewportHeight: 0, itemTop: 0, itemHeight: 0 })).toBeNull();
    expect(legalTocScrollTop({ ...viewport, scrollHeight: 300, itemTop: 380, itemHeight: 52 })).toBeNull();
  });

  it("reveals the beginning of a label taller than the available viewport without oscillating", () => {
    expect(legalTocScrollTop({ ...viewport, itemTop: 250, itemHeight: 320 })).toBe(338);
    expect(legalTocScrollTop({ ...viewport, scrollTop: 338, itemTop: 112, itemHeight: 320 })).toBeNull();
  });
});
