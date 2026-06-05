// tests/integration/ui-api.spec.ts — Cross-layer integration tests
// Uses absolute API URL to avoid baseURL conflict in integration project

import { test as base, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/home.page";
import { LoginPage } from "../../src/pages/login.page";

const API_URL = "https://jsonplaceholder.typicode.com";

test.describe("UI + API consistency @regression", () => {
  test("UI homepage reachable", async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();
    const heading = await home.getHeading();
    expect(heading).toContain("Welcome");
  });

  test("API /posts returns 100 items", async ({ request }) => {
    const response = await request.get(`${API_URL}/posts`);
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts).toHaveLength(100);
  });

  test("API /users returns 10 items", async ({ request }) => {
    const response = await request.get(`${API_URL}/users`);
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(users).toHaveLength(10);
  });

  test("login flow works end to end @smoke", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login({ username: "tomsmith", password: "SuperSecretPassword!" });
    await lp.assertLoginSuccess();
  });
});
