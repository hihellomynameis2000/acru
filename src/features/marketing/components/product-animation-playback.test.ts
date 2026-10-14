import { describe, expect, it, vi } from "vitest";

import { ProductAnimationPlayback } from "./product-animation-playback";

function setup() {
  const element = {
    src: "",
    paused: true,
    preload: "none",
    load: vi.fn(),
    play: vi.fn(async () => {
      element.paused = false;
    }),
    pause: vi.fn(() => {
      element.paused = true;
    }),
    removeAttribute: vi.fn(() => {
      element.src = "";
    })
  };
  const playback = new ProductAnimationPlayback(element as unknown as HTMLVideoElement, "/animation.mp4");
  return { element, playback };
}

describe("on-demand product animation playback", () => {
  it("does not request the video during the initial page load", () => {
    const { element, playback } = setup();
    playback.update({ hidden: false });
    expect(element.src).toBe("");
    expect(element.load).not.toHaveBeenCalled();
    expect(element.play).not.toHaveBeenCalled();
  });

  it("loads a nearby card once, and plays only when visible", () => {
    const { element, playback } = setup();
    playback.update({ near: true });
    expect(element.src).toBe("/animation.mp4");
    expect(element.load).toHaveBeenCalledOnce();
    expect(element.play).not.toHaveBeenCalled();
    playback.update({ visible: true });
    expect(element.play).toHaveBeenCalledOnce();
    playback.update({ near: true });
    expect(element.load).toHaveBeenCalledOnce();
    playback.update({ visible: false });
    expect(element.paused).toBe(true);
  });

  it.each(["reducedMotion", "saveData"] as const)("does not load automatically with %s enabled", (preference) => {
    const { element, playback } = setup();
    playback.update({ [preference]: true, near: true, visible: true });
    expect(element.src).toBe("");
    expect(element.load).not.toHaveBeenCalled();
    playback.toggle();
    expect(element.load).toHaveBeenCalledOnce();
    expect(element.play).toHaveBeenCalledOnce();
  });

  it("pauses in hidden tabs and resumes when the card becomes visible again", () => {
    const { element, playback } = setup();
    playback.update({ visible: true, hidden: true });
    expect(element.load).not.toHaveBeenCalled();
    playback.update({ hidden: false });
    expect(element.paused).toBe(false);
    playback.update({ hidden: true });
    expect(element.paused).toBe(true);
    playback.update({ hidden: false });
    expect(element.play).toHaveBeenCalledTimes(2);
  });

  it("remembers manual pauses across scrolling and tab visibility changes", () => {
    const { element, playback } = setup();
    playback.update({ visible: true });
    playback.toggle();
    expect(element.paused).toBe(true);
    playback.update({ visible: false, hidden: true });
    playback.update({ visible: true, hidden: false });
    expect(element.play).toHaveBeenCalledOnce();
    playback.toggle();
    expect(element.play).toHaveBeenCalledTimes(2);
  });

  it("stops a pending play request if the card has left the viewport", async () => {
    const { element, playback } = setup();
    let finish!: () => void;
    element.play.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    playback.update({ visible: true });
    playback.update({ visible: false });
    element.paused = false;
    finish();
    await vi.waitFor(() => expect(element.paused).toBe(true));
  });

  it("retains manual playback after autoplay rejection", async () => {
    const { element, playback } = setup();
    element.play.mockRejectedValueOnce(new Error("Autoplay blocked"));
    playback.update({ visible: true });
    await new Promise((resolve) => setTimeout(resolve, 0));
    playback.toggle();
    expect(element.play).toHaveBeenCalledTimes(2);
    expect(element.paused).toBe(false);
  });

  it("waits for a deliberate retry after a media error", () => {
    const { element, playback } = setup();
    playback.update({ visible: true });
    playback.fail();
    playback.update({ visible: false });
    playback.update({ visible: true });
    expect(element.play).toHaveBeenCalledOnce();
    playback.toggle();
    expect(element.load).toHaveBeenCalledTimes(2);
    expect(element.play).toHaveBeenCalledTimes(2);
  });

  it("releases playback and media buffers when unmounted", () => {
    const { element, playback } = setup();
    playback.update({ visible: true });
    playback.dispose();
    expect(element.paused).toBe(true);
    expect(element.src).toBe("");
    playback.update({ visible: true });
    expect(element.play).toHaveBeenCalledOnce();
  });
});
