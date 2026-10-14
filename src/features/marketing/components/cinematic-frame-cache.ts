import { frameUrl, heroAssets } from "@/features/marketing/data/cinematic";

type DecodedFrame = { source: CanvasImageSource; release: () => void };

// Four retained decodes plus one temporary decode bound the working set.
// Compressed blobs have a separate, small cache; HTTP caching handles revisits.
export class CinematicFrameCache {
  private blobs = new Map<number, Blob>();
  private frames = new Map<number, DecodedFrame>();
  private requests = new Map<number, AbortController>();
  private decoding = new Set<number>();
  private failed = new Set<number>();
  private priority: number[] = [];
  private stopped = false;
  private paused = false;
  private displayed = -1;
  private wanted = 0;

  constructor(
    private onReady: (index: number, image: CanvasImageSource, resizing?: boolean) => void,
    private onFailure: () => void,
    private resolveUrl: (index: number) => string = frameUrl
  ) {}

  request(index: number, direction: number) {
    this.wanted = index;
    const ahead = direction < 0 ? -1 : 1;
    this.priority = [
      ...new Set([index, index + ahead, index + ahead * 2, index - ahead, index + ahead * 3, index - ahead * 2])
    ].filter((frame) => frame >= 0 && frame <= heroAssets.handoffFrame);
    // Let the bounded in-flight requests finish. Cancelling the whole window
    // on every scroll event starves real networks, even though localhost works.
    const closest = [...this.frames.keys()]
      .filter((frame) => this.canAdvance(frame))
      .sort((a, b) => Math.abs(a - index) - Math.abs(b - index))[0];
    if (closest !== undefined) this.deliver(closest, this.frames.get(closest)!);
    this.pump();
  }

  setPaused(paused: boolean) {
    if (this.paused === paused) return;
    this.paused = paused;
    if (paused) {
      for (const controller of this.requests.values()) controller.abort();
    } else this.pump();
  }

  redraw() {
    const frame = this.frames.get(this.displayed);
    if (frame) this.onReady(this.displayed, frame.source, true);
  }

  dispose() {
    this.stopped = true;
    for (const controller of this.requests.values()) controller.abort();
    for (const frame of this.frames.values()) frame.release();
    this.frames.clear();
    this.blobs.clear();
  }

  private canAdvance(index: number) {
    if (index === this.displayed) return false;
    if (index === this.wanted) return true;
    if (this.displayed < 0) return index <= this.wanted && this.wanted - index <= 6;
    return this.wanted > this.displayed
      ? index > this.displayed && index <= this.wanted
      : index < this.displayed && index >= this.wanted;
  }

  private deliver(index: number, frame: DecodedFrame) {
    if (!this.canAdvance(index) || this.stopped || this.paused) return;
    this.displayed = index;
    this.frames.delete(index);
    this.frames.set(index, frame);
    this.onReady(index, frame.source);
  }

  private trim() {
    while (this.frames.size > 4) {
      const candidates = [...this.frames.keys()].filter((index) => index !== this.displayed && index !== this.wanted);
      const victim = candidates.find((index) => !this.priority.slice(0, 4).includes(index)) ?? candidates[0];
      if (victim === undefined) break;
      this.frames.get(victim)?.release();
      this.frames.delete(victim);
    }
    while (this.blobs.size > 24) {
      const victim = [...this.blobs.keys()].find((index) => !this.priority.includes(index));
      if (victim === undefined) break;
      this.blobs.delete(victim);
    }
  }

  private pump() {
    if (this.stopped || this.paused) return;
    const progress = [...this.blobs.keys()]
      .filter((index) => this.canAdvance(index) && !this.priority.includes(index))
      .sort((a, b) => Math.abs(a - this.wanted) - Math.abs(b - this.wanted));
    const work = [...new Set([this.wanted, ...progress, ...this.priority])];
    for (const index of work) {
      if (this.frames.has(index) || this.decoding.has(index) || this.failed.has(index)) continue;
      const blob = this.blobs.get(index);
      if (blob) {
        const decodeLimit = this.displayed === this.wanted ? 4 : 3;
        if (
          this.decoding.size < 1 &&
          (this.canAdvance(index) || (this.priority.includes(index) && this.priority.indexOf(index) < decodeLimit))
        )
          void this.decode(index, blob);
      } else if (this.requests.size < 4 && !this.requests.has(index)) {
        void this.fetch(index);
      }
    }
  }

  private async fetch(index: number) {
    const controller = new AbortController();
    this.requests.set(index, controller);
    try {
      const response = await fetch(this.resolveUrl(index), { signal: controller.signal, cache: "force-cache" });
      if (!response.ok) throw new Error(`Hero frame ${index} unavailable`);
      const blob = await response.blob();
      if (!this.stopped) this.blobs.set(index, blob);
    } catch {
      if (!controller.signal.aborted && !this.stopped) {
        this.failed.add(index);
        if (index === 0 && this.wanted === 0 && this.displayed < 0) this.onFailure();
      }
    } finally {
      this.requests.delete(index);
      this.trim();
      this.pump();
    }
  }

  private async decode(index: number, blob: Blob) {
    this.decoding.add(index);
    let frame: DecodedFrame | undefined;
    try {
      if (typeof createImageBitmap === "function") {
        const bitmap = await createImageBitmap(blob);
        frame = { source: bitmap, release: () => bitmap.close() };
      } else {
        const url = URL.createObjectURL(blob);
        const image = new Image();
        try {
          image.src = url;
          await image.decode();
          frame = {
            source: image,
            release: () => {
              image.src = "";
            }
          };
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      if (this.stopped || this.paused || (!this.priority.includes(index) && !this.canAdvance(index))) frame.release();
      else {
        this.frames.set(index, frame);
        this.deliver(index, frame);
        this.trim();
      }
    } catch {
      if (!this.stopped) {
        this.failed.add(index);
        if (index === 0 && this.wanted === 0 && this.displayed < 0) this.onFailure();
      }
    } finally {
      this.decoding.delete(index);
      this.pump();
    }
  }
}
