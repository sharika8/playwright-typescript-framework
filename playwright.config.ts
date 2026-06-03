import { defineConfig, devices } from "@playwright/test";
const ENV = process.env.ENV || "development";
const envConfig = {
  development: { baseURL: "https://the-internet.herokuapp.com", apiURL: "https://jsonplaceholder.typicode.com" },
  staging: { baseURL: "https://the-internet.herokuapp.com", apiURL: "https://jsonplaceholder.typicode.com" },
  production: { baseURL: "https://the-internet.herokuapp.com", apiURL: "https://jsonplaceholder.typicode.com" },
};
const cfg = envConfig[ENV] ?? envConfig.development;
export default defineConfig({
  testDir: "./tests", testMatch: "**/*.spec.ts",
  fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }], ["junit", { outputFile: "test-results/junit.xml" }]],
  use: { baseURL: cfg.baseURL, trace: "on-first-retry", screenshot: "only-on-failure", video: "retain-on-failure" },
  projects: [
    { name: "api", testDir: "./tests/api", use: { baseURL: cfg.apiURL, extraHTTPHeaders: { "Content-Type": "application/json", Accept: "application/json" } } },
    { name: "chromium", testDir: "./tests/ui", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", testDir: "./tests/ui", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testDir: "./tests/ui", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", testDir: "./tests/ui", use: { ...devices["Pixel 5"] } },
    { name: "integration", testDir: "./tests/integration", use: { ...devices["Desktop Chrome"], baseURL: cfg.baseURL, extraHTTPHeaders: { Accept: "application/json" } } },
  ],
});
