const assetBase = "/media/acru-landing/v1";

export const landingArtwork = {
  payments: {
    src: "/marketing/payments.png",
    width: 1837,
    height: 1048,
    alt: "Card, Apple Pay, ACH, and USDC payments connected through Acru"
  },
  checkout: {
    src: `${assetBase}/checkout.png`,
    width: 1799,
    height: 983,
    alt: "Acru checkout with payment methods, card details, and an order summary"
  },
  authentication: {
    src: `${assetBase}/authentication.png`,
    width: 1779,
    height: 924,
    alt: "Customer payment details alongside identity, device, 3DS, and risk checks"
  },
  developers: {
    src: `${assetBase}/developers.png`,
    width: 1758,
    height: 966,
    alt: "Acru payment API request, test response, and developer tools"
  },
  chart: {
    src: `${assetBase}/chart.png`,
    width: 2124,
    height: 2268,
    alt: "Payment volume over time with available, pending, and reserved balances"
  }
} as const;

export const landingProducts = [
  {
    id: "payment-methods",
    title: "Payment methods",
    description:
      "Accept Apple Pay, Google Pay, PayPal, Venmo, and more—with cards, local bank payments, and crypto in one place.",
    artwork: landingArtwork.payments
  },
  {
    id: "checkout",
    title: "Checkout",
    description:
      "Keep your brand front and center with hosted or embedded checkout. Let customers pay now or choose Klarna and Afterpay.",
    artwork: landingArtwork.checkout
  },
  {
    id: "authentication",
    title: "Authentication",
    description:
      "Connect identity, device, and payment signals. Apply authentication where it matters, with less friction for your customers.",
    artwork: landingArtwork.authentication
  },
  {
    id: "developer-infrastructure",
    title: "Developer infrastructure",
    description:
      "Build your payment flow with APIs and developer tools. Test requests and follow payment events as you integrate.",
    artwork: landingArtwork.developers
  }
] as const;

export type LandingProductAnimation = {
  src: string;
  poster: string;
  width: number;
  height: number;
};

export const landingProductAnimations: Partial<
  Record<(typeof landingProducts)[number]["id"], LandingProductAnimation>
> = {
  "payment-methods": {
    src: "/media/acru-payment-methods/v1/payment-methods.mp4",
    poster: "/media/acru-payment-methods/v1/poster.webp",
    width: 1200,
    height: 728
  },
  checkout: {
    src: "/media/acru-checkout/v1/checkout.mp4",
    poster: "/media/acru-checkout/v1/poster.webp",
    width: 1200,
    height: 728
  },
  authentication: {
    src: "/media/acru-authentication/v1/authentication.mp4",
    poster: "/media/acru-authentication/v1/poster.webp",
    width: 1200,
    height: 728
  },
  "developer-infrastructure": {
    src: "/media/acru-developers/v1/developers.mp4",
    poster: "/media/acru-developers/v1/poster.webp",
    width: 1200,
    height: 728
  }
};

export const landingChartAnimation = {
  src: "/media/acru-payment-chart/v1/payment-chart.mp4",
  poster: "/media/acru-payment-chart/v1/poster.webp",
  width: 1180,
  height: 1260
} satisfies LandingProductAnimation;

export const landingBusinesses = [
  {
    id: "ecommerce",
    title: "Ecommerce",
    headline: "More completed orders. More room to grow.",
    description:
      "Keep your checkout as considered as the rest of your brand. Bring familiar payment methods, authorization, and post-purchase visibility into the same flow."
  },
  {
    id: "fintech",
    title: "Fintech",
    headline: "Your product. A complete money movement layer.",
    description:
      "Make account funding and withdrawals feel native. Connect verification, payment rails, and event data to the experience you’re building."
  },
  {
    id: "gaming",
    title: "Gaming",
    headline: "Stay in the moment. Keep money moving.",
    description:
      "Give players familiar deposit options and a clear way to withdraw eligible funds. Configure controls around the player, market, and payment."
  },
  {
    id: "marketplaces",
    title: "Marketplaces",
    headline: "Great for buyers. Built for sellers. Clear for you.",
    description:
      "Keep buyer payments, seller verification, platform fees, and payouts connected as your marketplace grows."
  }
] as const;

export function businessContactHref(title: string) {
  const business = landingBusinesses.find((business) => business.title === title);
  if (!business) throw new Error(`Unknown industry: ${title}`);
  return `/industries/${business.id}`;
}
