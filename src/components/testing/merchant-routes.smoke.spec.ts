import { expect, test } from "@playwright/test";

import { merchantRoutes } from "@/components/shell/merchant-routes";

test("every merchant route renders without runtime or horizontal-overflow failures", async ({ page }, testInfo) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  for (const route of merchantRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${route} returned an error response`).toBeLessThan(400);
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("text=Something went wrong")).toHaveCount(0);
    await expect
      .poll(
        () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
        { message: `${route} overflows the ${testInfo.project.name} viewport` }
      )
      .toBe(true);
  }

  expect(runtimeErrors, `Runtime errors in ${testInfo.project.name}`).toEqual([]);
});

test("shell keyboard and responsive navigation behavior", async ({ page }, testInfo) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  if (testInfo.project.name === "tablet-768" || testInfo.project.name === "mobile-390") {
    const toggle = page.getByRole("button", { name: "Open navigation" });
    await toggle.click();
    await expect(page.locator(".sidebar")).toHaveAttribute("data-mobile-open", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator(".sidebar")).toHaveAttribute("data-mobile-open", "false");
  } else {
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    await expect(page.getByRole("dialog", { name: "Search ACRU" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Search ACRU" })).toHaveCount(0);
  }
});
