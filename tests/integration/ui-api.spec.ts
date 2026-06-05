// tests/integration/ui-api.spec.ts — Cross-layer integration tests
import { test, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/home.page";
import { LoginPage } from "../../src/pages/login.page";

const API_URL = "https://jsonplaceholder.typicode.com";

test.describe("UI + API consistency @regression", () => {
  test("UI homepage reachable", async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();
    expect(await home.getHeading()).toContain("Welcome");
  });

  test("API /posts returns 100 items", async ({ request }) => {
    const r = await request.get(`${API_URL}/posts`);
    expect(r.status()).toBe(200);
    const posts = await r.json() as unknown[];
    expect(posts).toHaveLength(100);
  });

  test("API /users returns 10 items", async ({ request }) => {
    const r = await request.get(`${API_URL}/users`);
    expect(r.status()).toBe(200);
    const users = await r.json() as unknown[];
    expect(users).toHaveLength(10);
  });

  test("login flow works @smoke", async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login({ username: "tomsmith", password: "SuperSecretPassword!" });
    await lp.assertLoginSuccess();
  });
});
