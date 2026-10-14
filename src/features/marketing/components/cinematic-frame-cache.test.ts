import { afterEach, describe, expect, it, vi } from "vitest";

import { CinematicFrameCache } from "@/features/marketing/components/cinematic-frame-cache";

afterEach(() => vi.unstubAllGlobals());

describe("cinematic frame scheduler", () => {
  it("requests only the mobile variant when given the mobile resolver", async () => {
    const fetchFrame = vi.fn(async () => ({ ok: true, blob: async () => new Blob(["frame"]) }));
    vi.stubGlobal("fetch", fetchFrame);
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({ close: vi.fn() }))
    );
    const ready = vi.fn();
    const cache = new CinematicFrameCache(ready, vi.fn(), (index) => `/mobile/${index}.webp`);
    cache.request(50, 1);
    await vi.waitFor(() => expect(ready).toHaveBeenCalledWith(50, expect.anything()));
    expect(fetchFrame.mock.calls.length).toBeGreaterThan(0);
    for (const call of vi.mocked(fetch).mock.calls) expect(call[0]).toMatch(/^\/mobile\//);
    cache.dispose();
  });
  it("ignores late decodes after a fast jump and closes every bitmap on disposal", async () => {
    const decodes: Array<{ close: ReturnType<typeof vi.fn>; resolve: () => void }> = [];
    const ready = vi.fn();
    const failure = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, blob: async () => new Blob(["frame"]) }))
    );
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(
        () =>
          new Promise((resolve) => {
            const close = vi.fn();
            decodes.push({ close, resolve: () => resolve({ close }) });
          })
      )
    );
    const cache = new CinematicFrameCache(ready, failure);
    cache.request(0, 1);
    await vi.waitFor(() => expect(decodes).toHaveLength(1));
    cache.request(80, 1);
    decodes[0].resolve();
    await vi.waitFor(() => expect(decodes).toHaveLength(2));
    expect(ready).not.toHaveBeenCalled();
    expect(decodes[0].close).toHaveBeenCalledOnce();
    decodes[1].resolve();
    await vi.waitFor(() => expect(ready).toHaveBeenCalledWith(80, expect.anything()));
    cache.dispose();
    for (const decode of decodes.slice(2)) decode.resolve();
    await vi.waitFor(() => expect(decodes.every((decode) => decode.close.mock.calls.length === 1)).toBe(true));
    expect(failure).not.toHaveBeenCalled();
  });

  it("stops decoding when the small working set is warm", async () => {
    const resources: Array<{ close: ReturnType<typeof vi.fn> }> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, blob: async () => new Blob(["frame"]) }))
    );
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => {
        const bitmap = { close: vi.fn() };
        resources.push(bitmap);
        return bitmap;
      })
    );
    const ready = vi.fn();
    const cache = new CinematicFrameCache(ready, vi.fn());
    cache.request(50, 1);
    await vi.waitFor(() => expect(resources).toHaveLength(4));
    cache.request(50, 1);
    await Promise.resolve();
    expect(resources).toHaveLength(4);
    expect(ready).toHaveBeenCalledTimes(1);
    cache.request(80, 1);
    // One already-downloaded intermediate frame advances the camera while the
    // new window arrives. The retained decode budget remains four frames.
    await vi.waitFor(() => expect(resources).toHaveLength(9));
    expect(resources.filter((bitmap) => bitmap.close.mock.calls.length === 0)).toHaveLength(4);
    cache.request(80, 1);
    await Promise.resolve();
    expect(resources).toHaveLength(9);
    cache.dispose();
    expect(resources.every((bitmap) => bitmap.close.mock.calls.length === 1)).toBe(true);
  });

  it("keeps useful requests alive and advances monotonically under real network latency", async () => {
    const pending = new Map<number, { signal: AbortSignal; finish: () => void }>();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (url: string, options: { signal: AbortSignal }) =>
          new Promise((resolve, reject) => {
            const index = Number(url.match(/(\d+)\.webp$/)![1]);
            pending.set(index, {
              signal: options.signal,
              finish: () => resolve({ ok: true, blob: async () => new Blob([String(index)]) })
            });
            options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
          })
      )
    );
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({ close: vi.fn() }))
    );
    const ready = vi.fn();
    const failure = vi.fn();
    const cache = new CinematicFrameCache(ready, failure);
    cache.request(0, 1);
    pending.get(0)!.finish();
    await vi.waitFor(() => expect(ready).toHaveBeenCalledWith(0, expect.anything()));
    cache.request(10, 1);
    cache.request(11, 1);
    cache.request(12, 1);
    expect([...pending.values()].every(({ signal }) => !signal.aborted)).toBe(true);
    pending.get(3)!.finish();
    await vi.waitFor(() => expect(ready).toHaveBeenCalledWith(3, expect.anything()));
    pending.get(10)!.finish();
    await vi.waitFor(() => expect(ready).toHaveBeenCalledWith(10, expect.anything()));
    pending.get(12)!.finish();
    await vi.waitFor(() => expect(ready).toHaveBeenCalledWith(12, expect.anything()));
    // A much older download must never flash the scene backward.
    pending.get(1)!.finish();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(ready.mock.calls.map(([index]) => index)).toEqual([0, 3, 10, 12]);
    cache.request(8, -1);
    // The network pool remains bounded during reversal; the oldest download
    // finishes before the newly wanted reverse frame takes its slot.
    pending.get(2)!.finish();
    await vi.waitFor(() => expect(pending.has(8)).toBe(true));
    pending.get(8)!.finish();
    await vi.waitFor(() => expect(ready).toHaveBeenLastCalledWith(8, expect.anything()));
    expect(failure).not.toHaveBeenCalled();
    cache.dispose();
  });
});
