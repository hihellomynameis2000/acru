import { defineConfig } from "@playwright/test";

const viewports = [
  { height: 1000, name: "desktop-1440", width: 1440 },
  { height: 900, name: "desktop-1024", width: 1024 },
  { height: 1024, name: "tablet-768", width: 768 },
  { height: 844, name: "mobile-390", width: 390 }
];

export default defineConfig({
  expect: { timeout: 8_000 },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  projects: viewports.map(({ height, name, width }) => ({ name, use: { viewport: { height, width } } })),
  reporter: [["list"]],
  retries: process.env.CI ? 1 : 0,
  testDir: "./src/components/testing",
  testMatch: "**/*.smoke.spec.ts",
  timeout: 120_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:3100/dashboard"
  }
});
