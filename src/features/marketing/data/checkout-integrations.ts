// Featured roster supplied by the user on 2026-10-08.
// Logos identify the integrations; they do not establish endorsement or universal availability.
export const featuredCheckoutIntegrations = [
  { name: "WooCommerce", image: "/marketing/checkout/integrations/woocommerce.png", width: 17055, height: 8713 },
  { name: "NMI", image: "/marketing/checkout/integrations/nmi.webp", width: 838, height: 270 },
  { name: "Plaid", image: "/plaid-logo.webp", width: 1280, height: 488 },
  { name: "Authorize.net", image: "/marketing/checkout/integrations/authorize-net.png", width: 1920, height: 428 },
  { name: "Shopify", image: "/marketing/checkout/integrations/shopify.png", width: 1000, height: 286 }
] as const;

export type IntegrationCategory =
  | "Gateways & banking"
  | "Commerce & checkout"
  | "Subscriptions & billing"
  | "Forms & operations"
  | "Wallet infrastructure";
export type CheckoutIntegration = {
  name: string;
  category: IntegrationCategory;
  image?: string;
  width?: number;
  height?: number;
  darkLogo?: boolean;
};

// Original brand assets; provenance and resolution notes live beside the files.
// Unavailable high-resolution marks use the directory's text fallback.
const directoryLogos: Record<string, { image: string; width: number; height: number; darkLogo?: boolean }> = {
  BigCommerce: { image: "bigcommerce.svg", width: 500, height: 125 },
  "WP EasyCart": { image: "wp-easycart.png", width: 1500, height: 359 },
  ClickFunnels: { image: "clickfunnels.svg", width: 188, height: 26, darkLogo: true },
  GoHighLevel: { image: "gohighlevel.svg", width: 172, height: 38, darkLogo: true },
  "sticky.io": { image: "sticky-io.svg", width: 697.77, height: 195.58 },
  Chargebee: { image: "chargebee.svg", width: 187, height: 26 },
  ChargeOver: { image: "chargeover.svg", width: 286.61, height: 32.56 },
  Recurly: { image: "recurly.svg", width: 330, height: 22, darkLogo: true },
  PayWhirl: { image: "paywhirl.svg", width: 267.3, height: 35.2 },
  PayKickstart: { image: "paykickstart.png", width: 2188, height: 436 },
  SubscriptionFlow: { image: "subscriptionflow.svg", width: 2088.84, height: 633.6 },
  Hiveage: { image: "hiveage.png", width: 1260, height: 400 },
  Formstack: { image: "formstack.svg", width: 192.19, height: 68.03 },
  "Gravity Forms": { image: "gravity-forms.png", width: 774, height: 400 },
  "123FormBuilder": { image: "123formbuilder.png", width: 1950, height: 565 },
  Chargent: { image: "chargent.png", width: 500, height: 156 },
  Docusign: { image: "docusign.svg", width: 1200, height: 241.4 },
  Checkfront: { image: "checkfront.svg", width: 329.7, height: 60.6 },
  Bastion: { image: "bastion.svg", width: 165, height: 48 }
};

const roster: [string, IntegrationCategory][] = [
  ["NMI", "Gateways & banking"],
  ["Authorize.net", "Gateways & banking"],
  ["Plaid", "Gateways & banking"],
  ["Shopify", "Commerce & checkout"],
  ["WooCommerce", "Commerce & checkout"],
  ["BigCommerce", "Commerce & checkout"],
  ["Adobe Commerce", "Commerce & checkout"],
  ["Zen Cart", "Commerce & checkout"],
  ["WP EasyCart", "Commerce & checkout"],
  ["CheckoutChamp", "Commerce & checkout"],
  ["ClickFunnels", "Commerce & checkout"],
  ["GoHighLevel", "Forms & operations"],
  ["sticky.io", "Subscriptions & billing"],
  ["Chargebee", "Subscriptions & billing"],
  ["ChargeOver", "Subscriptions & billing"],
  ["Recurly", "Subscriptions & billing"],
  ["PayWhirl", "Subscriptions & billing"],
  ["PayKickstart", "Subscriptions & billing"],
  ["SubscriptionFlow", "Subscriptions & billing"],
  ["Hiveage", "Subscriptions & billing"],
  ["Formstack", "Forms & operations"],
  ["Gravity Forms", "Forms & operations"],
  ["123FormBuilder", "Forms & operations"],
  ["Chargent", "Forms & operations"],
  ["Docusign", "Forms & operations"],
  ["Checkfront", "Forms & operations"],
  ["Bastion", "Wallet infrastructure"]
];

export const checkoutIntegrations: CheckoutIntegration[] = roster.map(([name, category]) => {
  const logo = directoryLogos[name];
  return {
    name,
    category,
    ...(logo ? { ...logo, image: `/marketing/checkout/integrations/${logo.image}` } : {}),
    ...featuredCheckoutIntegrations.find((integration) => integration.name === name)
  };
});
