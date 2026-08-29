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

test("critical merchant forms, filtering, focus, and Escape behavior", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/payments/transactions");
  await expect(page.getByRole("heading", { name: "Transactions" })).toBeVisible();

  const search = page.getByPlaceholder("Search transactions");
  await search.fill("no-such-transaction");
  await expect(page.getByText("No transactions match these filters.")).toBeVisible();
  await search.fill("");

  await page.locator(".transactions-create-button").click();
  const paymentDialog = page.getByRole("dialog", { name: "Create payment" });
  await expect(paymentDialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(paymentDialog).toHaveCount(0);

  await page.locator(".transactions-create-button").click();
  await paymentDialog.locator('input[name="amount"]').fill("125.45");
  await paymentDialog.locator('input[name="customer"]').fill("Browser Test Co");
  await paymentDialog.locator('input[name="email"]').fill("billing@example.com");
  await paymentDialog.locator('input[name="description"]').fill("Smoke test payment");
  await paymentDialog.getByRole("button", { name: "Create payment" }).click();
  await expect(page.getByText("Browser Test Co")).toBeVisible();
  await expect(page.locator("#main-content").getByText("$125.45")).toBeVisible();

  await page.goto("/payments/subscriptions");
  await expect(page.getByRole("heading", { name: "Subscriptions" })).toBeVisible();

  await page.getByRole("row", { name: /Nathan Bariac/ }).click();
  const subscriptionDrawer = page.getByRole("dialog", { name: "Pro plan" });
  await expect(subscriptionDrawer).toBeVisible();

  const drawerActionSizes = await subscriptionDrawer.locator(".ui-drawer-footer .button").evaluateAll((buttons) =>
    buttons.map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const iconRect = button.querySelector("svg")?.getBoundingClientRect();
      return {
        buttonHeight: buttonRect.height,
        iconHeight: iconRect?.height ?? 0,
        iconWidth: iconRect?.width ?? 0
      };
    })
  );
  expect(drawerActionSizes.length).toBeGreaterThan(0);
  for (const size of drawerActionSizes) {
    expect(size.buttonHeight).toBeLessThanOrEqual(44);
    expect(size.iconHeight).toBeLessThanOrEqual(20);
    expect(size.iconWidth).toBeLessThanOrEqual(20);
  }

  await page.keyboard.press("Escape");
  await expect(subscriptionDrawer).toHaveCount(0);

  await page.locator(".ops-create-button").click();
  const subscriptionDialog = page.getByRole("dialog", { name: "Create subscription" });
  await expect(subscriptionDialog).toBeVisible();
  await expect(subscriptionDialog.locator(":focus")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(subscriptionDialog).toHaveCount(0);
});

test("invoice drawer remains readable below the standard mobile breakpoint", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.setViewportSize({ height: 824, width: 281 });
  await page.goto("/payments/invoices");

  const draftInvoice = page.getByRole("row", { name: /Aug 7, 2026.*Draft Atlas Design/ });
  await draftInvoice.locator("td").first().click();

  const drawer = page.locator(".ops-drawer");
  await expect(drawer).toBeVisible();
  const geometry = await drawer.evaluate((element) => {
    const drawerRect = element.getBoundingClientRect();
    const summary = element.querySelector(".ops-summary-grid");
    const summaryRect = summary?.getBoundingClientRect();
    const sections = summary ? Array.from(summary.children).map((child) => child.getBoundingClientRect()) : [];
    const status = summary?.querySelector(".ops-status");
    const statusRect = status?.getBoundingClientRect();
    return {
      drawerTop: drawerRect.top,
      statusContained:
        Boolean(summaryRect && statusRect) &&
        statusRect!.left >= summaryRect!.left &&
        statusRect!.right <= summaryRect!.right,
      statusText: status?.textContent?.trim(),
      statusWidth: statusRect?.width ?? 0,
      summaryContained:
        Boolean(summaryRect) &&
        sections.every((section) => section.left >= summaryRect!.left && section.right <= summaryRect!.right)
    };
  });

  expect(geometry.drawerTop).toBe(64);
  expect(geometry.statusText).toBe("Draft");
  expect(geometry.statusWidth).toBeLessThanOrEqual(80);
  expect(geometry.statusContained).toBe(true);
  expect(geometry.summaryContained).toBe(true);
});

test("merchant selects use the ACRU listbox with complete keyboard behavior", async ({ page }) => {
  await page.goto("/settings/business");

  const businessStructure = page.getByRole("combobox", { name: /Business structure/ });
  await businessStructure.click();
  const listbox = page.getByRole("listbox", { name: "Business structure" });
  await expect(listbox).toBeVisible();
  await expect(listbox.getByRole("option", { name: "Limited liability company" })).toHaveAttribute(
    "aria-selected",
    "true"
  );

  await businessStructure.press("ArrowDown");
  await businessStructure.press("Enter");
  await expect(businessStructure).toHaveValue("Corporation");
  await expect(listbox).toHaveCount(0);
  await expect(businessStructure).toBeFocused();

  await businessStructure.press(" ");
  await expect(listbox).toBeVisible();
  await businessStructure.press("Escape");
  await expect(listbox).toHaveCount(0);
  await expect(businessStructure).toBeFocused();

  await page.goto("/reports/analytics");
  const metric = page.getByRole("combobox", { name: "Payment performance metric" });
  await metric.click();
  const metricListbox = page.getByRole("listbox");
  await expect(metricListbox).toBeVisible();
  await metricListbox.getByRole("option", { name: "Net revenue" }).click();
  await expect(metric).toHaveValue("Net revenue");
});

test("banking payout summary keeps the balance clear of its label", async ({ page }) => {
  await page.goto("/settings/banking-payouts");

  const summary = page.locator(".settings-balance-hero > div").first();
  const label = summary.getByText("Available to pay out", { exact: true });
  const balance = summary.getByText("$284,913.20", { exact: true });
  const geometry = await Promise.all([label.boundingBox(), balance.boundingBox(), summary.boundingBox()]).then(
    ([labelBox, balanceBox, summaryBox]) => ({ labelBox, balanceBox, summaryBox })
  );

  expect(geometry.labelBox).not.toBeNull();
  expect(geometry.balanceBox).not.toBeNull();
  expect(geometry.summaryBox).not.toBeNull();
  expect(geometry.balanceBox!.y).toBeGreaterThanOrEqual(geometry.labelBox!.y + geometry.labelBox!.height);
  expect(geometry.balanceBox!.x).toBeGreaterThanOrEqual(geometry.summaryBox!.x);
  expect(geometry.balanceBox!.x + geometry.balanceBox!.width).toBeLessThanOrEqual(
    geometry.summaryBox!.x + geometry.summaryBox!.width + 1
  );
});

test("submitted onboarding links to ACRU documentation with clear spacing", async ({ page }) => {
  await page.goto("/onboarding?preview=1&step=submitted");

  const actions = page.locator(".submitted-actions");
  const documentation = page.getByRole("link", { name: "View documentation" });
  await expect(documentation).toHaveAttribute("href", "/developers/documentation");

  const spacing = await Promise.all([actions.boundingBox(), documentation.boundingBox()]).then(
    ([actionsBox, documentationBox]) => ({ actionsBox, documentationBox })
  );
  expect(spacing.actionsBox).not.toBeNull();
  expect(spacing.documentationBox).not.toBeNull();
  expect(spacing.documentationBox!.y - (spacing.actionsBox!.y + spacing.actionsBox!.height)).toBeGreaterThanOrEqual(14);

  await documentation.click();
  await expect(page).toHaveURL(/\/developers\/documentation$/);
  await expect(page.getByRole("heading", { name: "Documentation", exact: true })).toBeVisible();
});

test("refund related activity keeps status badges compact", async ({ page }) => {
  await page.goto("/payments/refunds");
  await page.locator(".ops-table tbody tr").first().click();

  const drawer = page.locator(".ops-drawer");
  await drawer.getByRole("button", { name: "Related activity" }).click();
  const relatedRow = drawer.locator(".ops-related-row");
  const status = relatedRow.locator(".ops-status");
  await expect(status).toHaveText("Succeeded");

  const geometry = await relatedRow.evaluate((row) => {
    const leadingIcon = row.querySelector(":scope > span:first-child")?.getBoundingClientRect();
    const badge = row.querySelector(":scope > .ops-status")?.getBoundingClientRect();
    const badgeIcon = row.querySelector(":scope > .ops-status svg")?.getBoundingClientRect();
    return {
      badgeHeight: badge?.height ?? 0,
      badgeIconCentered:
        Boolean(badge && badgeIcon) &&
        Math.abs(badge!.top + badge!.height / 2 - (badgeIcon!.top + badgeIcon!.height / 2)) <= 1,
      badgeWidth: badge?.width ?? 0,
      leadingIconHeight: leadingIcon?.height ?? 0,
      leadingIconWidth: leadingIcon?.width ?? 0
    };
  });

  expect(geometry.leadingIconHeight).toBeCloseTo(34, 3);
  expect(geometry.leadingIconWidth).toBeCloseTo(34, 3);
  expect(geometry.badgeHeight).toBeLessThanOrEqual(24);
  expect(geometry.badgeWidth).toBeGreaterThan(geometry.badgeHeight);
  expect(geometry.badgeIconCentered).toBe(true);
});
