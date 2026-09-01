import { expect, test } from "@playwright/test";

import { merchantRoutes } from "@/components/shell/merchant-routes";

test("public homepage is responsive, branded, and links to real policies", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Payments infrastructure, built for scale." })).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Acru merchant dashboard showing revenue, wallet balance, and business controls" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payments fueling growth, built for scale." })).toBeVisible();
  await expect(page.getByRole("img", { name: "Payment methods connected to an approved Acru payment" })).toBeVisible();
  await expect(page.locator(".marketing-trust-section dt", { hasText: "Every cent accounted for" })).toBeVisible();
  await expect(page.locator(".marketing-trust-section dt", { hasText: "Access with clear boundaries" })).toBeVisible();
  await expect(page.locator(".marketing-trust-section dt", { hasText: "Issues visible in real time" })).toBeVisible();
  await expect(page.getByText("Ledger-first", { exact: true })).toHaveCount(0);
  await expect(page.locator(".marketing-scroll-reveal-word")).toHaveCount(21);
  await expect(page.getByText("Built for integration", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Designed for serious operations", { exact: true })).toHaveCount(0);
  await expect(page.getByText("A platform that grows with you", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Tell us what you are building/)).toHaveCount(0);
  await expect(page.locator(".app-shell")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Apply now" })).toHaveAttribute("href", "/sign-up");
  await expect
    .poll(() => page.locator(".marketing-header").evaluate((element) => getComputedStyle(element).position))
    .toBe("sticky");

  await page.locator(".marketing-intro").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await expect
    .poll(() =>
      page
        .locator(".marketing-scroll-reveal-word")
        .last()
        .evaluate((element) => ({ color: getComputedStyle(element).color, opacity: getComputedStyle(element).opacity }))
    )
    .toEqual({ color: "rgb(51, 76, 93)", opacity: "1" });

  const stage = page.locator(".marketing-product-stage");
  const stageGeometry = await stage.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      height: bounds.height,
      right: bounds.right,
      viewportWidth: document.documentElement.clientWidth,
      width: bounds.width
    };
  });
  expect(stageGeometry.documentWidth).toBeLessThanOrEqual(stageGeometry.viewportWidth + 1);
  expect(stageGeometry.right).toBeLessThanOrEqual(stageGeometry.viewportWidth + 1);
  expect(Math.abs(stageGeometry.width - stageGeometry.height)).toBeLessThanOrEqual(1);

  const productRail = page.locator(".marketing-capability-track");
  await expect.poll(() => productRail.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.getByRole("button", { name: "Next product" }).click();
  await expect(page.getByRole("button", { name: "Show Checkout" })).toHaveAttribute("aria-pressed", "true");

  if (testInfo.project.name === "desktop-1440") {
    const primaryAction = page.getByRole("link", { name: "Learn more" });
    const secondaryAction = page.getByRole("link", { name: "See a demo" });
    const applyAction = page.getByRole("link", { name: "Apply now" });
    const actionSizes = await Promise.all(
      [primaryAction, secondaryAction, applyAction].map((action) =>
        action.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return { height: bounds.height, width: bounds.width };
        })
      )
    );
    expect(actionSizes).toEqual([
      { height: 40, width: 164 },
      { height: 40, width: 164 },
      { height: 40, width: 164 }
    ]);

    const productsNavigation = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", {
      name: "Products"
    });
    await productsNavigation.hover();
    await expect
      .poll(() => productsNavigation.evaluate((element) => getComputedStyle(element).backgroundColor))
      .toBe("rgb(241, 242, 242)");

    const nextButton = page.getByRole("button", { name: "Next product" });
    await nextButton.hover();
    await expect
      .poll(() => nextButton.locator("svg").evaluate((element) => getComputedStyle(element).fill))
      .toBe("rgb(255, 255, 255)");
  }

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText(/Infrastructure for the businesses shaping what comes next/)).toHaveCount(0);
  await expect(footer.getByText(/Accept payments, manage revenue/)).toHaveCount(0);
  await expect(footer.getByText("Talk to sales", { exact: true })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/legal/privacy");
  await expect(footer.getByRole("link", { name: "Terms of service" })).toHaveAttribute("href", "/legal/terms");
  await expect(footer.getByRole("link", { name: "Acru on X" })).toHaveAttribute("href", "https://x.com/acruhq");
  await expect(footer.getByRole("link", { name: "Acru on Facebook" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Acru on YouTube" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Acru on LinkedIn" })).toBeVisible();
  await expect(footer.getByText(/Acru is not a bank/)).toBeVisible();

  if (testInfo.project.name === "mobile-390") {
    const menu = page.getByRole("button", { name: "Open navigation" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();

    const headerGeometry = await page.locator(".marketing-header").evaluate((element) => {
      const brand = element.querySelector<HTMLElement>(".marketing-brand");
      const bounds = element.getBoundingClientRect();
      return { brandWidth: brand?.getBoundingClientRect().width ?? 0, height: bounds.height };
    });
    expect(headerGeometry.height).toBeLessThanOrEqual(60);
    expect(headerGeometry.brandWidth).toBeLessThanOrEqual(100);

    await menu.click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    const mobileSignIn = page.getByRole("link", { name: "Sign in" });
    await expect(mobileSignIn).toBeVisible();
    await expect
      .poll(() => mobileSignIn.evaluate((element) => getComputedStyle(element).backgroundColor))
      .toBe("rgba(0, 0, 0, 0)");
    await expect(page.getByText("Menu", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Close navigation" })).toBeFocused();

    const menuGeometry = await page.locator(".marketing-mobile-menu-dialog").evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        left: bounds.left,
        right: bounds.right,
        viewportWidth: document.documentElement.clientWidth,
        width: bounds.width
      };
    });
    expect(menuGeometry.left).toBe(0);
    expect(menuGeometry.right).toBe(menuGeometry.viewportWidth);
    expect(menuGeometry.width).toBe(menuGeometry.viewportWidth);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  }
});

test("official legal center and policy pages are responsive and navigable", async ({ page }, testInfo) => {
  await page.goto("/legal");
  await expect(page.getByRole("heading", { name: "Legal center", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read terms of service" })).toHaveAttribute("href", "/legal/terms");
  await expect(page.getByRole("link", { name: "Read privacy policy" })).toHaveAttribute("href", "/legal/privacy");

  await page.goto("/legal/privacy");

  await expect(page.getByRole("heading", { name: "Privacy Policy", level: 1 })).toBeVisible();
  await expect
    .poll(() => page.locator(".marketing-header").evaluate((element) => getComputedStyle(element).position))
    .toBe("relative");
  await expect(page.getByText("Official policy", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Related policy", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "3. Personal Information We Collect" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "17. California Privacy Notice" })).toBeVisible();
  const retentionTable = page.getByRole("table", { name: "12. Data Retention details" });
  await expect(page.locator(".legal-table-title", { hasText: "12. Data Retention details" })).toBeVisible();
  await expect(retentionTable).toBeVisible();
  await expect(retentionTable.locator("caption")).toHaveCount(0);
  await expect(page.locator(".app-shell")).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
    .toBe(true);

  if (testInfo.project.name === "mobile-390") {
    await expect(page.locator(".legal-mobile-toc summary")).toBeVisible();
    await expect(page.locator(".legal-toc")).toBeHidden();
    await page.locator(".legal-mobile-toc summary").click();
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
  } else {
    const tableOfContents = page.locator(".legal-toc");
    await expect(tableOfContents).toBeVisible();
    await expect.poll(() => tableOfContents.evaluate((element) => getComputedStyle(element).position)).toBe("sticky");

    await tableOfContents.getByRole("link", { name: "12. Data Retention" }).click();
    await expect
      .poll(() => tableOfContents.locator('[aria-current="location"]').getAttribute("href"))
      .toBe("#12-data-retention");

    await tableOfContents.getByRole("link", { name: "11. Marketing Communications" }).click();
    await expect
      .poll(() => tableOfContents.locator('[aria-current="location"]').getAttribute("href"))
      .toBe("#11-marketing-communications");
  }

  await page.goto("/legal/terms");
  await expect(page.getByRole("heading", { name: "Terms of Service", level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "39. Dispute Resolution; Binding Arbitration; Class Action Waiver" })
  ).toBeVisible();
  await expect(page.getByText(/Section 39 contains a binding arbitration agreement/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "47. Contact Information" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
    .toBe(true);
});

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

test("analytics chart total aligns with its panel heading", async ({ page }) => {
  await page.goto("/reports/analytics");

  const panel = page.locator(".report-performance");
  const heading = panel.getByRole("heading", { name: "Payment performance" });
  const total = panel.getByText("$8,420,588", { exact: true });
  const geometry = await Promise.all([heading.boundingBox(), total.boundingBox()]).then(([headingBox, totalBox]) => ({
    headingBox,
    totalBox
  }));

  expect(geometry.headingBox).not.toBeNull();
  expect(geometry.totalBox).not.toBeNull();
  expect(geometry.totalBox!.x).toBeCloseTo(geometry.headingBox!.x, 3);
});

test("partner sign-up create account button has no arrow", async ({ page }) => {
  await page.goto("/sign-up?portal=partner");

  const createAccount = page.getByRole("button", { name: "Create account" });
  await expect(createAccount).toBeVisible();
  await expect(createAccount.locator("svg")).toBeHidden();
});

test("admin access has no self-registration journey", async ({ page }) => {
  await page.goto("/sign-in?portal=admin");

  await expect(page.getByRole("heading", { name: "Sign in to Acru Admin" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create an account" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Continue with Google" })).toHaveCount(0);
  await expect(page.getByText("or continue with email")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Email address" })).toBeVisible();

  await page.goto("/sign-up?portal=admin");
  await expect(page).toHaveURL(/\/sign-in\?portal=admin$/);
  await expect(page.getByRole("heading", { name: "Sign in to Acru Admin" })).toBeVisible();
  await expect(page.getByText("Create an Acru admin account")).toHaveCount(0);
});

test("admin partner detail contains wide data and chart controls at every breakpoint", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "acru-session",
      JSON.stringify({ email: "admin-smoke@acru.test", portal: "admin", provider: "email", verified: true })
    );
  });
  await page.goto("/admin");
  await page.getByRole("button", { name: "Partners", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Partners", exact: true })).toBeVisible();

  const geometry = await page.evaluate(() => {
    const tableCard = document.querySelector<HTMLElement>(".admin-split-view .admin-table-card");
    const tableWrap = document.querySelector<HTMLElement>(".admin-split-view .admin-table-wrap");
    const sideProfile = document.querySelector<HTMLElement>(".admin-side-profile");
    const trendCard = sideProfile?.querySelector<HTMLElement>(".admin-trend-card");
    const range = trendCard?.querySelector<HTMLElement>(".admin-range");
    const bounds = (element: HTMLElement | null | undefined) => element?.getBoundingClientRect();

    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      range: bounds(range),
      sideProfile: bounds(sideProfile),
      tableCard: bounds(tableCard),
      tableOverflow: tableWrap ? getComputedStyle(tableWrap).overflowX : null,
      tableScrollWidth: tableWrap?.scrollWidth ?? 0,
      tableViewportWidth: tableWrap?.clientWidth ?? 0,
      tableWrap: bounds(tableWrap),
      trendCard: bounds(trendCard)
    };
  });

  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.tableOverflow).toBe("auto");
  expect(geometry.tableScrollWidth).toBeGreaterThanOrEqual(geometry.tableViewportWidth);
  expect(geometry.tableWrap!.left).toBeGreaterThanOrEqual(geometry.tableCard!.left);
  expect(geometry.tableWrap!.right).toBeLessThanOrEqual(geometry.tableCard!.right + 1);
  expect(geometry.trendCard!.left).toBeGreaterThanOrEqual(geometry.sideProfile!.left);
  expect(geometry.trendCard!.right).toBeLessThanOrEqual(geometry.sideProfile!.right + 1);
  expect(geometry.range!.left).toBeGreaterThanOrEqual(geometry.trendCard!.left);
  expect(geometry.range!.right).toBeLessThanOrEqual(geometry.trendCard!.right + 1);
});

test("password recovery is portal-aware, validated, and keyboard accessible", async ({ page }) => {
  await page.goto("/sign-in?portal=partner");
  const forgotPassword = page.getByRole("link", { name: "Forgot password?" });
  await expect(forgotPassword).toHaveAttribute("href", "/forgot-password?portal=partner");
  await forgotPassword.click();

  await expect(page).toHaveURL(/\/forgot-password\?portal=partner$/);
  await expect(page.getByRole("heading", { name: "Reset your partner password" })).toBeVisible();
  await expect(page.locator(".app-shell")).toHaveCount(0);
  const email = page.getByRole("textbox", { name: "Email address" });
  const submit = page.getByRole("button", { name: "Send reset link" });
  await expect(email).toBeFocused();
  await expect(submit).toBeDisabled();

  await email.fill("alex@northstar.test");
  await expect(submit).toBeEnabled();
  await submit.click();

  const successHeading = page.getByRole("heading", { name: "Check your email" });
  await expect(successHeading).toBeVisible();
  await expect(successHeading).toBeFocused();
  await expect(page.getByText("alex@northstar.test")).toBeVisible();
  await page.getByRole("button", { name: "Resend email" }).click();
  await expect(page.getByText("A new link is on its way.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to sign in" })).toHaveAttribute("href", "/sign-in?portal=partner");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
    .toBe(true);
});

test("every partner dropdown uses the ACRU listbox with keyboard dismissal", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await page.goto("/partners");
  const navigation = page.getByRole("navigation", { name: "Partner workspace" });
  const sections = [
    { name: "Applications", selects: 1 },
    { name: "Custom links", selects: 1 },
    { name: "Marketing materials", selects: 4 },
    { name: "Reports", selects: 7 }
  ];

  for (const section of sections) {
    await navigation.getByRole("button", { name: section.name, exact: true }).click();
    const selects = page.locator("select");
    await expect(selects).toHaveCount(section.selects);
    await expect(page.locator(".ui-select-root")).toHaveCount(section.selects);
    await expect(page.locator("select:not(.ui-select)")).toHaveCount(0);

    for (let index = 0; index < section.selects; index += 1) {
      const select = selects.nth(index);
      await select.click();
      const listbox = page.getByRole("listbox");
      await expect(listbox).toBeVisible();
      expect(await listbox.getByRole("option").count()).toBeGreaterThan(1);
      await select.press("Escape");
      await expect(listbox).toHaveCount(0);
      await expect(select).toBeFocused();
    }

    if (section.name === "Reports") {
      const dateRange = selects.first();
      await dateRange.click();
      await page.getByRole("listbox", { name: "Date range" }).getByRole("option", { name: "Last 7 days" }).click();
      await expect(dateRange).toHaveValue("7D");
      await expect(dateRange).not.toBeFocused();
      expect(await dateRange.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("none");
    }
  }
});

test("partner tables stream every available row without pagination", async ({ page }) => {
  await page.goto("/partners");
  const navigation = page.getByRole("navigation", { name: "Partner workspace" });
  const sections = [
    { loadsMore: true, name: "Applications", rows: 9, table: ".partner-applicants-table" },
    { name: "Merchants", rows: 4, table: ".partner-data-table table" },
    { name: "Payouts", rows: 5, table: ".partner-payout-history table" },
    { loadsMore: true, name: "Referrals", rows: 7, table: ".partner-referral-table table" },
    { loadsMore: true, name: "Custom links", rows: 5, table: ".partner-saved-links table" },
    { name: "Marketing materials", rows: 4, table: ".partner-marketing-library table" },
    { loadsMore: true, name: "Reports", rows: 7, table: ".partner-report-table table" }
  ];

  for (const section of sections) {
    await navigation.getByRole("button", { name: section.name, exact: true }).click();
    const table = page.locator(section.table);
    const footer = page.locator(".partner-infinite-footer");
    const rows = table.locator("tbody tr");
    if (section.loadsMore && (await rows.count()) < section.rows) {
      await footer.getByRole("button", { name: "Load more" }).click();
    }
    await expect(rows).toHaveCount(section.rows);
    await expect(footer).toHaveCount(0);
    await expect(page.getByText(/All .* loaded/)).toHaveCount(0);
    await expect(page.locator(".partner-pagination")).toHaveCount(0);
  }
});

test("admin team metrics fill the available row without generic icons", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await page.goto("/admin");
  await page.getByRole("button", { name: "Team", exact: true }).click();

  const grid = page.locator(".admin-metric-grid");
  const cards = grid.locator("article");
  await expect(cards).toHaveCount(5);
  expect(
    await grid
      .locator(".admin-metric-icon")
      .evaluateAll((icons) => icons.every((icon) => getComputedStyle(icon).display === "none"))
  ).toBe(true);

  const geometry = await Promise.all([grid.boundingBox(), cards.last().boundingBox()]).then(
    ([gridBox, lastCardBox]) => ({
      gridBox,
      lastCardBox
    })
  );
  expect(geometry.gridBox).not.toBeNull();
  expect(geometry.lastCardBox).not.toBeNull();
  expect(
    Math.abs(geometry.lastCardBox!.x + geometry.lastCardBox!.width - (geometry.gridBox!.x + geometry.gridBox!.width))
  ).toBeLessThanOrEqual(1);
});

test("admin reporting date range uses the merchant neutral pill treatment", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await page.goto("/admin");
  await page.getByRole("button", { name: "Reports", exact: true }).click();

  const range = page.locator(".admin-range");
  const active = range.locator("button.active");
  const styles = await Promise.all([
    range.evaluate((element) => {
      const style = getComputedStyle(element);
      return { borderRadius: style.borderRadius, height: element.getBoundingClientRect().height };
    }),
    active.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, borderRadius: style.borderRadius, color: style.color };
    })
  ]).then(([control, selected]) => ({ control, selected }));

  expect(styles.control.borderRadius).toBe("999px");
  expect(styles.control.height).toBeGreaterThanOrEqual(36);
  expect(styles.selected.borderRadius).toBe("999px");
  expect(styles.selected.background).toBe("rgb(59, 58, 58)");
  expect(styles.selected.background).not.toBe("rgb(75, 173, 223)");
  expect(styles.selected.color).toBe("rgb(238, 238, 238)");
});

test("partner workspace uses the polished card, chart, drawer, badge, and map treatments", async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await page.goto("/partners");

  await expect(page.getByRole("heading", { name: "Good morning, Alex" })).toBeVisible();
  await expect(page.locator(".partner-title-row .portal-kicker")).toBeHidden();
  expect(
    await page
      .locator(".partner-dashboard-metric-icon")
      .evaluateAll((icons) => icons.every((icon) => getComputedStyle(icon).display === "none"))
  ).toBe(true);

  const earningsRange = page.locator(".partner-chart-range");
  expect(await earningsRange.evaluate((element) => getComputedStyle(element).borderRadius)).toBe("999px");
  expect(
    await earningsRange
      .locator("button")
      .first()
      .evaluate((element) => getComputedStyle(element).borderRadius)
  ).toBe("999px");
  const earningsHitbox = page.locator(".partner-chart-hitbox");
  const hitbox = await earningsHitbox.boundingBox();
  expect(hitbox).not.toBeNull();
  await page.mouse.move(hitbox!.x + hitbox!.width * 0.2, hitbox!.y + hitbox!.height / 2);
  const earningsTooltip = page.locator(".partner-chart-tooltip");
  await expect(earningsTooltip).toBeVisible();
  const tooltipMotion = await earningsTooltip.evaluate((element) => {
    const style = getComputedStyle(element);
    return { duration: style.transitionDuration, property: style.transitionProperty };
  });
  expect(tooltipMotion.property).toContain("left");
  expect(tooltipMotion.duration).toBe("0.055s");

  await page.getByRole("button", { name: "Earnings", exact: true }).click();
  expect(
    await page
      .locator(".partner-merchant-bars > div")
      .evaluateAll((rows) => rows.every((row) => getComputedStyle(row).borderTopWidth === "0px"))
  ).toBe(true);

  await page.getByRole("button", { name: "Applications", exact: true }).click();
  expect(
    await page
      .locator(".partner-application-metrics article > svg")
      .evaluateAll((icons) => icons.every((icon) => getComputedStyle(icon).display === "none"))
  ).toBe(true);
  await page.locator(".partner-table-toolbar select").selectOption({ label: "Pending review" });
  const pendingReview = page.locator(".portal-status.pending-review").first();
  await expect(pendingReview).toHaveText("Pending review");
  const pendingStyle = await pendingReview.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { height: bounds.height, whiteSpace: getComputedStyle(element).whiteSpace };
  });
  expect(pendingStyle.whiteSpace).toBe("nowrap");
  expect(pendingStyle.height).toBeLessThanOrEqual(28);

  await page.getByRole("button", { name: "Payouts", exact: true }).click();
  const payoutCards = page.locator(".partner-payout-kpis > article");
  await expect(payoutCards).toHaveCount(4);
  await expect(page.locator(".partner-payout-kpis .partner-payout-kpi-icon")).toHaveCount(0);
  const payoutCardGeometry = await Promise.all([
    payoutCards.first().boundingBox(),
    payoutCards.first().locator("div").boundingBox()
  ]).then(([card, content]) => ({ card, content }));
  expect(payoutCardGeometry.card).not.toBeNull();
  expect(payoutCardGeometry.content).not.toBeNull();
  expect(payoutCardGeometry.content!.x - payoutCardGeometry.card!.x).toBeLessThanOrEqual(18);
  const payoutMethodTile = page.locator(".partner-payout-table-method .partner-payout-method-preview").first();
  expect((await payoutMethodTile.boundingBox())?.height).toBe(27);
  const payoutMethodCardTile = page.locator(".partner-payout-methods-card .partner-payout-method-preview").first();
  expect((await payoutMethodCardTile.boundingBox())?.height).toBe(34);
  const payoutWorkspaceGeometry = await Promise.all([
    page.locator(".partner-payout-history").boundingBox(),
    page.locator(".partner-payout-methods-card").boundingBox()
  ]).then(([history, methods]) => ({ history, methods }));
  expect(payoutWorkspaceGeometry.history).not.toBeNull();
  expect(payoutWorkspaceGeometry.methods).not.toBeNull();
  expect(
    Math.abs(payoutWorkspaceGeometry.history!.height - payoutWorkspaceGeometry.methods!.height)
  ).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "Reports", exact: true }).click();
  expect(
    await page
      .locator(".partner-data-metrics article > span")
      .evaluateAll((icons) => icons.every((icon) => getComputedStyle(icon).display === "none"))
  ).toBe(true);
  expect(
    await page.locator(".partner-report-chart-legend nav").evaluate((element) => getComputedStyle(element).borderRadius)
  ).toBe("999px");
  expect(
    await page
      .locator('.partner-report-filters select[aria-label="Date range"]')
      .evaluate((element) => getComputedStyle(element).borderRadius)
  ).toBe("999px");

  const reportGeometry = await Promise.all([
    page.locator(".partner-report-chart").boundingBox(),
    page.locator(".partner-report-chart-plot svg").boundingBox()
  ]).then(([card, chart]) => ({ card, chart }));
  expect(reportGeometry.card).not.toBeNull();
  expect(reportGeometry.chart).not.toBeNull();
  expect(reportGeometry.chart!.height).toBeGreaterThan(300);
  expect(
    reportGeometry.card!.y + reportGeometry.card!.height - (reportGeometry.chart!.y + reportGeometry.chart!.height)
  ).toBeLessThanOrEqual(16);
  const reportRange = page.locator(".partner-report-chart-legend nav");
  for (const range of ["30D", "7D", "3M", "1Y"]) {
    await reportRange.getByRole("button", { name: range, exact: true }).click();
    const plottedSeries = await page.locator(".partner-report-chart-plot .series").evaluateAll((series) =>
      series.map((path) => {
        const bounds = (path as SVGGraphicsElement).getBBox();
        return { height: bounds.height, top: bounds.y };
      })
    );
    expect(plottedSeries).toHaveLength(3);
    for (const series of plottedSeries) {
      expect(series.height).toBeGreaterThan(110);
      expect(series.top).toBeLessThan(45);
    }
  }

  const mapStyle = await page.locator(".partner-world-map-shell").evaluate((element) => {
    const style = getComputedStyle(element);
    const country = element.querySelector("path");
    const countryStyle = country ? getComputedStyle(country) : null;
    return {
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      borderWidth: style.borderTopWidth,
      countryStroke: countryStyle?.stroke
    };
  });
  expect(mapStyle.backgroundColor).toBe("rgba(0, 0, 0, 0)");
  expect(mapStyle.backgroundImage).toBe("none");
  expect(mapStyle.borderWidth).toBe("0px");
  expect(["none", "rgba(0, 0, 0, 0)", "transparent"]).toContain(mapStyle.countryStroke);

  await page
    .getByRole("navigation", { name: "Partner workspace" })
    .getByRole("button", { name: "Merchants", exact: true })
    .click();
  await page.locator(".partner-data-table tbody tr").first().click();
  const drawerColor = await page
    .locator(".partner-merchant-drawer")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const sidebarColor = await page
    .locator(".partner-sidebar")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const headerColor = await page
    .locator(".portal-header")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(drawerColor).toBe(sidebarColor);
  expect(drawerColor).toBe(headerColor);
});

test("partner report chart keeps its responsive geometry at phone width", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.goto("/partners");
  await page.getByRole("button", { name: "Reports", exact: true }).click();

  const chart = page.locator(".partner-report-chart-plot svg");
  await expect(chart).toBeVisible();
  await expect
    .poll(async () =>
      chart.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const viewBox = element.getAttribute("viewBox")?.split(/\s+/).map(Number) ?? [];
        return Math.abs((viewBox[2] ?? 0) - bounds.width) + Math.abs((viewBox[3] ?? 0) - bounds.height);
      })
    )
    .toBeLessThanOrEqual(2);

  const geometry = await chart.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const viewBox = element.getAttribute("viewBox")?.split(/\s+/).map(Number) ?? [];
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      renderedRatio: bounds.width / bounds.height,
      viewBoxRatio: (viewBox[2] ?? 1) / (viewBox[3] ?? 1)
    };
  });
  expect(Math.abs(geometry.renderedRatio - geometry.viewBoxRatio)).toBeLessThan(0.02);
  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);
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

test("team invitations enforce detailed page permissions and 2-step security", async ({ page }, testInfo) => {
  await page.goto("/settings/team");
  const inviteButton = page.getByRole("button", { name: "Invite member", exact: true });
  await inviteButton.click();

  const dialog = page.getByRole("dialog", { name: "Invite a team member" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".settings-permission-row")).toHaveCount(24);
  await expect(dialog.getByText("Required", { exact: true })).toHaveCount(3);
  await expect(dialog.getByText("2-step verification before first access", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/SMS alone is not/)).toBeVisible();

  await dialog.getByLabel("Role template").selectOption("Finance");
  const payoutLevel = dialog.getByLabel("Payouts access level", { exact: true });
  const developerLevel = dialog.getByLabel("Developers & API access level", { exact: true });
  await expect(payoutLevel).toHaveValue("manage");
  await expect(developerLevel).toBeDisabled();

  const payoutAccess = dialog.getByLabel("Allow access to Payouts", { exact: true });
  await payoutAccess.click({ force: true });
  await expect(payoutLevel).toBeDisabled();
  await payoutAccess.click({ force: true });
  await expect(payoutLevel).toBeEnabled();
  await expect(payoutLevel).toHaveValue("manage");

  const geometry = await dialog.evaluate((element) => ({
    dialogWidth: element.getBoundingClientRect().width,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(geometry.dialogWidth).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1);

  const suffix = testInfo.project.name.replace(/\W/g, "");
  const memberName = `Secure Member ${suffix}`;
  await dialog.getByLabel("Full name").fill(memberName);
  await dialog.getByLabel("Work email").fill(`secure-${suffix}@northstar.studio`);
  await dialog.getByRole("button", { name: "Send secure invitation" }).click();
  await expect(dialog).toHaveCount(0);

  const invitedRow = page.locator(".settings-team-row").filter({ hasText: memberName });
  await expect(invitedRow).toBeVisible();
  await expect(invitedRow.getByText("Required", { exact: true })).toBeVisible();

  await inviteButton.click();
  const duplicateDialog = page.getByRole("dialog", { name: "Invite a team member" });
  await duplicateDialog.getByLabel("Full name").fill("Duplicate Member");
  await duplicateDialog.getByLabel("Work email").fill("christian@northstar.studio");
  await duplicateDialog.getByRole("button", { name: "Send secure invitation" }).click();
  await expect(duplicateDialog.getByRole("alert")).toHaveText(/already belongs to a member/);
  await page.keyboard.press("Escape");
  await expect(duplicateDialog).toHaveCount(0);
  await expect(inviteButton).toBeFocused();
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
