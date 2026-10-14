import { editorialHref, footerDirectory } from "./editorial";

export type NavigationLink = readonly [label: string, href: string];
export type NavigationItem = {
  title: string;
  href: string;
  icon:
    | "payments"
    | "movement"
    | "platform"
    | "protection"
    | "ecommerce"
    | "fintech"
    | "gaming"
    | "marketplaces"
    | "company"
    | "guides";
  description: string;
  links?: readonly NavigationLink[];
};
export type NavigationPanel = {
  id: string;
  label: string;
  items: readonly NavigationItem[];
  links: readonly NavigationLink[];
};

const destination = ([label, path]: NavigationLink): NavigationLink => [label, editorialHref(path)];

export const navigationPanels: readonly NavigationPanel[] = [
  {
    id: "products",
    label: "Products",
    items: footerDirectory.slice(0, 4).map((group, index) => ({
      title: group.title,
      href: editorialHref(["/payments", "/payouts", "/platforms", "/risk"][index]),
      icon: (["payments", "movement", "platform", "protection"] as const)[index],
      description: [
        "Every way your customers pay",
        "From balance to destination",
        "Connect every side of your business",
        "Clarity behind every decision"
      ][index],
      links: group.links.map(destination)
    })),
    links: [
      ["See the payment flow", editorialHref("/payments")],
      ["Explore the platform", editorialHref("/platforms")],
      ["Talk to Acru", editorialHref("/contact")]
    ]
  },
  {
    id: "solutions",
    label: "Solutions",
    items: footerDirectory[4].links.map(([title, path], index) => ({
      title,
      href: editorialHref(path),
      icon: (["ecommerce", "fintech", "gaming", "marketplaces", "movement", "company"] as const)[index],
      description: [
        "Built for the purchase journey",
        "Money movement in your product",
        "Payments for the player journey",
        "Connect buyers and sellers",
        "Make distance less complicated",
        "Payouts for a global team"
      ][index]
    })),
    links: [
      ["Find your solution", "#businesses"],
      ["Partner with Acru", editorialHref("/partners")],
      ["Talk to Acru", editorialHref("/contact")]
    ]
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      {
        title: "Acru guides",
        href: editorialHref("/resources"),
        icon: "guides",
        description: "Practical payment perspectives"
      },
      { title: "Articles", href: editorialHref("/articles"), icon: "guides", description: "Ideas for what comes next" },
      {
        title: "Help center",
        href: editorialHref("/help"),
        icon: "guides",
        description: "Answers for checkout and payment operations"
      },
      {
        title: "Developer overview",
        href: editorialHref("/developers"),
        icon: "platform",
        description: "Plan your Acru integration"
      }
    ],
    links: [
      ["See a demo", editorialHref("/demo")],
      ["Questions & answers", editorialHref("/faq")],
      ["Contact our team", editorialHref("/contact")]
    ]
  },
  {
    id: "company",
    label: "Company",
    items: [
      {
        title: "About Acru",
        href: editorialHref("/company"),
        icon: "company",
        description: "The people behind the platform"
      },
      {
        title: "Partners",
        href: editorialHref("/partners"),
        icon: "marketplaces",
        description: "Build something better together"
      },
      {
        title: "Security",
        href: editorialHref("/security"),
        icon: "protection",
        description: "Trust starts with the details"
      }
    ],
    links: [
      ["Contact", editorialHref("/contact")],
      ["Privacy", "https://acru.com/legal/privacy"],
      ["Terms", "https://acru.com/legal/terms"]
    ]
  }
];

export const navigationDirectLinks: readonly NavigationLink[] = [
  ["Developers", editorialHref("/developers")],
  ["Pricing", editorialHref("/pricing")]
];

export const navigationSignIn = "https://merchants.acrudevelopment.com/sign-in";
