// Client names approved by Acru for public display on September 11, 2026.
// Names without a verified official asset stay out of the visual carousel.
export const acruClients = [
  "Bitunix",
  "Blofin",
  "PackDraw",
  "Leveledup Traders",
  "Roobet",
  "MundPay",
  "Fulfillment Pros",
  "Solstice Marketing Solutions",
  "Crush Research",
  "Betonline.ag",
  "Cornerstone ATS"
] as const;

type ClientLogo = {
  name: (typeof acruClients)[number];
  src: string;
  width: number;
  height: number;
  wordmark?: string;
  badge?: boolean;
};

export const acruClientLogos: readonly ClientLogo[] = [
  { name: "Bitunix", src: "/marketing/clients/v1/bitunix.svg", width: 108, height: 24 },
  { name: "Blofin", src: "/marketing/clients/v1/blofin.svg", width: 80, height: 20 },
  { name: "PackDraw", src: "/marketing/clients/v1/packdraw-symbol.svg", width: 45, height: 45, wordmark: "PackDraw" },
  {
    name: "Leveledup Traders",
    src: "/marketing/clients/v1/leveled-up-traders.jpg",
    width: 149,
    height: 149,
    wordmark: "Leveled Up Traders",
    badge: true
  },
  { name: "Roobet", src: "/marketing/clients/v1/roobet.svg", width: 2000, height: 517 },
  { name: "MundPay", src: "/marketing/clients/v1/mundpay.svg", width: 144, height: 24 },
  { name: "Fulfillment Pros", src: "/marketing/clients/v1/fulfillment-pros.svg", width: 320, height: 60 },
  { name: "Crush Research", src: "/marketing/clients/v1/crush-research.webp", width: 512, height: 151 },
  { name: "Betonline.ag", src: "/marketing/clients/v1/betonline.svg", width: 5810, height: 773 },
  { name: "Cornerstone ATS", src: "/marketing/clients/v1/cornerstone.svg", width: 941, height: 148 }
];
