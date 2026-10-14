type PlaybackEnvironment = {
  near: boolean;
  visible: boolean;
  hidden: boolean;
  reducedMotion: boolean;
  saveData: boolean;
};

/** No source is attached until the card is nearby or playback is requested. */
export class ProductAnimationPlayback {
  private environment: PlaybackEnvironment = {
    near: false,
    visible: false,
    hidden: false,
    reducedMotion: false,
    saveData: false
  };
  private preference: "play" | "pause" | null = null;
  private loaded = false;
  private failed = false;
  private disposed = false;
  private pending = false;
  private request = 0;

  constructor(
    private video: HTMLVideoElement,
    private source: string
  ) {}

  update(environment: Partial<PlaybackEnvironment>) {
    this.environment = { ...this.environment, ...environment };
    this.sync();
  }

  private mayLoad() {
    const { near, visible, hidden, reducedMotion, saveData } = this.environment;
    return (
      !this.disposed &&
      !this.failed &&
      !hidden &&
      (near || visible) &&
      this.preference !== "pause" &&
      (this.preference === "play" || (!reducedMotion && !saveData))
    );
  }

  private mayPlay() {
    return this.mayLoad() && this.environment.visible;
  }

  private sync() {
    if (this.disposed) return;
    if (this.mayLoad() && !this.loaded) {
      this.loaded = true;
      this.video.preload = "auto";
      this.video.src = this.source;
      this.video.load();
    }
    if (!this.mayPlay()) {
      this.request++;
      this.pending = false;
      this.video.pause();
      return;
    }
    if (this.pending || !this.video.paused) return;
    const request = ++this.request;
    this.pending = true;
    void this.video
      .play()
      .then(() => {
        if (!this.mayPlay()) this.video.pause();
      })
      .catch(() => {
        // Autoplay can be blocked. The play control and still remain available.
      })
      .finally(() => {
        if (request === this.request) this.pending = false;
      });
  }

  toggle() {
    if (this.disposed) return;
    if (!this.video.paused || this.pending) {
      this.preference = "pause";
    } else {
      this.preference = "play";
      this.environment.near = true;
      this.environment.visible = true;
      if (this.failed && this.loaded) this.video.load();
      this.failed = false;
    }
    this.sync();
  }

  fail() {
    this.failed = true;
    this.sync();
  }

  dispose() {
    this.disposed = true;
    this.video.pause();
    if (this.loaded) {
      this.video.removeAttribute("src");
      this.video.load();
    }
  }
}
