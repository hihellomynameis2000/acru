import { describe, expect, it } from "vitest";
import { navigationDirectLinks, navigationPanels, navigationSignIn } from "./navigation";
import { editorialDestinations, footerDirectory } from "./editorial";

describe("minimal marketing navigation", () => {
  it("keeps Help center in the Resources dropdown and footer", () => {
    expect(
      navigationPanels
        .find((panel) => panel.id === "resources")
        ?.items.some((item) => item.title === "Help center" && item.href === "/help")
    ).toBe(true);
    expect(
      footerDirectory.some((group) => group.links.some(([label, href]) => label === "Help center" && href === "/help"))
    ).toBe(true);
  });
  it("keeps the reference groups and all product destinations", () => {
    expect(navigationPanels.map((panel) => panel.label)).toEqual(["Products", "Solutions", "Resources", "Company"]);
    const products = navigationPanels[0];
    expect(products.items.map((item) => item.title)).toEqual(footerDirectory.slice(0, 4).map((group) => group.title));
    expect(products.items.flatMap((item) => item.links ?? [])).toHaveLength(21);
    expect(navigationPanels[1].items.map((item) => item.title)).toEqual([
      "Ecommerce",
      "Fintech",
      "Gaming",
      "Marketplaces",
      "Remittances",
      "Global payroll"
    ]);
    expect(navigationDirectLinks.map(([label]) => label)).toEqual(["Developers", "Pricing"]);
    expect(navigationDirectLinks.find(([label]) => label === "Developers")?.[1]).toBe("/developers/documentation");
    expect(navigationSignIn).toBe("https://merchants.acrudevelopment.com/sign-in");
  });

  it("uses only real Acru sections, demo requests, contact links, and policies", () => {
    const links = [
      ...navigationDirectLinks,
      ...navigationPanels.flatMap((panel) => [
        ...panel.links,
        ...panel.items.map((item) => [item.title, item.href] as const),
        ...panel.items.flatMap((item) => item.links ?? [])
      ])
    ];
    for (const [label, href] of links) {
      expect(label.trim().length).toBeGreaterThan(0);
      if (href.startsWith("#"))
        expect(["#products", "#businesses", "#payment-flow", ...Object.values(editorialDestinations)]).toContain(href);
      else if (href.startsWith("/")) expect(Object.values(editorialDestinations)).toContain(href);
      else if (!href.startsWith("mailto:")) expect(new URL(href).origin).toBe("https://acru.com");
    }
  });

  it("uses compact icon categories with useful descriptions and no images", () => {
    for (const item of navigationPanels.flatMap((panel) => panel.items)) {
      expect(item.icon).toBeTruthy();
      expect(item.description.length).toBeGreaterThan(10);
      expect(item).not.toHaveProperty("image");
    }
  });
});
