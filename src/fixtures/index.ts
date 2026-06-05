// src/fixtures/index.ts — Custom Playwright test fixtures
//
// Import from here instead of "@playwright/test" to get page objects and API clients:
//   import { test, expect } from "../../src/fixtures";

import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { HomePage } from "../pages/home.page";
import { CheckboxesPage } from "../pages/checkboxes.page";
import { PostsClient } from "../api/posts.client";
import { UsersClient } from "../api/users.client";

type UiFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  checkboxesPage: CheckboxesPage;
  loggedInPage: Page;
};

type ApiFixtures = {
  postsClient: PostsClient;
  usersClient: UsersClient;
};

export const test = base.extend<UiFixtures & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await use(lp);
  },

  homePage: async ({ page }, use) => {
    const hp = new HomePage(page);
    await hp.navigate();
    await use(hp);
  },

  checkboxesPage: async ({ page }, use) => {
    const cp = new CheckboxesPage(page);
    await cp.navigate();
    await use(cp);
  },

  loggedInPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login({
      username: process.env.TEST_USERNAME ?? "tomsmith",
      password: process.env.TEST_PASSWORD ?? "SuperSecretPassword!",
    });
    await lp.assertLoginSuccess();
    await use(page);
  },

  postsClient: async ({ request }, use) => {
    await use(new PostsClient(request));
  },

  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
});

export { expect };
