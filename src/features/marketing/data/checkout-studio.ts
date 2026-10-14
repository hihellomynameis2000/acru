export const studioColors = [
  { id: "blue", label: "Acru blue", value: "#4498ce", ink: "#102b3c" },
  { id: "indigo", label: "Indigo", value: "#645bc4", ink: "#ffffff" },
  { id: "green", label: "Evergreen", value: "#28785f", ink: "#ffffff" },
  { id: "slate", label: "Graphite", value: "#344e5c", ink: "#ffffff" }
] as const;

export const studioShapes = [
  { id: "square", label: "Square", radius: 6 },
  { id: "soft", label: "Soft", radius: 20 },
  { id: "round", label: "Round", radius: 36 }
] as const;

export const studioSizes = [
  { id: "compact", label: "Compact", width: 340 },
  { id: "wide", label: "Wide", width: 440 }
] as const;

export const studioRails = [
  { id: "apple-pay", label: "Apple Pay", group: "Express" },
  { id: "ach", label: "ACH", group: "Express" },
  { id: "metamask", label: "MetaMask", group: "Crypto" },
  { id: "coinbase", label: "Coinbase Pay", group: "Crypto" },
  { id: "phantom", label: "Phantom", group: "Crypto" },
  { id: "klarna", label: "Klarna", group: "Pay later" },
  { id: "afterpay", label: "Afterpay", group: "Pay later" }
] as const;

export type StudioRail = (typeof studioRails)[number]["id"];
export type StudioField = "color" | "shape" | "size" | "rails";
export type StudioConfig = {
  color: (typeof studioColors)[number]["id"];
  shape: (typeof studioShapes)[number]["id"];
  size: (typeof studioSizes)[number]["id"];
  rails: readonly StudioRail[];
};

export const initialStudioConfig: StudioConfig = {
  color: "blue",
  shape: "soft",
  size: "wide",
  rails: ["apple-pay", "ach"]
};

export const studioScenes: readonly { field: StudioField; target: string; change: Partial<StudioConfig> }[] = [
  { field: "color", target: "color-indigo", change: { color: "indigo" } },
  { field: "shape", target: "shape-round", change: { shape: "round" } },
  { field: "size", target: "size-compact", change: { size: "compact" } },
  { field: "rails", target: "rail-metamask", change: { rails: ["apple-pay", "ach", "metamask"] } },
  { field: "rails", target: "rail-ach", change: { rails: ["apple-pay", "metamask"] } },
  { field: "rails", target: "rail-coinbase", change: { rails: ["apple-pay", "metamask", "coinbase"] } },
  { field: "rails", target: "rail-apple-pay", change: { rails: ["metamask", "coinbase"] } },
  { field: "rails", target: "rail-phantom", change: { rails: ["metamask", "coinbase", "phantom"] } },
  { field: "color", target: "color-green", change: { color: "green" } },
  { field: "shape", target: "shape-square", change: { shape: "square" } },
  { field: "size", target: "size-wide", change: { size: "wide" } },
  { field: "rails", target: "rail-metamask", change: { rails: ["coinbase", "phantom"] } },
  { field: "rails", target: "rail-klarna", change: { rails: ["coinbase", "phantom", "klarna"] } },
  { field: "rails", target: "rail-phantom", change: { rails: ["coinbase", "klarna"] } },
  { field: "rails", target: "rail-afterpay", change: { rails: ["coinbase", "klarna", "afterpay"] } },
  { field: "rails", target: "rail-coinbase", change: { rails: ["klarna", "afterpay"] } },
  { field: "rails", target: "rail-apple-pay", change: { rails: ["apple-pay", "klarna", "afterpay"] } },
  { field: "color", target: "color-slate", change: { color: "slate" } },
  { field: "shape", target: "shape-soft", change: { shape: "soft" } },
  { field: "rails", target: "rail-klarna", change: { rails: ["apple-pay", "afterpay"] } },
  { field: "rails", target: "rail-ach", change: { rails: ["apple-pay", "ach", "afterpay"] } },
  { field: "rails", target: "rail-afterpay", change: { rails: ["apple-pay", "ach"] } },
  { field: "color", target: "color-blue", change: { color: "blue" } }
];

export type StudioState = {
  config: StudioConfig;
  scene: number;
  automatic: boolean;
  activeField: StudioField | null;
  activeTarget: string | null;
};

export const initialStudioState: StudioState = {
  config: initialStudioConfig,
  scene: 0,
  automatic: true,
  activeField: null,
  activeTarget: null
};

export type StudioAction = { type: "cue" } | { type: "advance" } | { type: "toggle-playback" };

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  if (action.type === "cue") {
    const scene = studioScenes[state.scene];
    return state.automatic ? { ...state, activeField: scene.field, activeTarget: scene.target } : state;
  }
  if (action.type === "advance") {
    if (!state.automatic) return state;
    const scene = studioScenes[state.scene];
    return {
      ...state,
      config: { ...state.config, ...scene.change },
      scene: (state.scene + 1) % studioScenes.length,
      activeField: scene.field,
      activeTarget: scene.target
    };
  }
  return { ...state, automatic: !state.automatic };
}
