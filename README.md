# 🎭 Playwright TypeScript Framework

Enterprise-grade **UI and API test automation** built on [Playwright](https://playwright.dev) + [TypeScript](https://typescriptlang.org) — strict typing, Page Object Model, native API testing, custom fixtures, and a complete GitHub Actions CI pipeline.

[![CI](https://github.com/sharika8/playwright-typescript-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/sharika8/playwright-typescript-framework/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.49-2EAD33?logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://typescriptlang.org)

---

## ✨ Features

| Capability | Detail |
|---|---|
| **UI automation** | Playwright — Chromium, Firefox, WebKit, Mobile Chrome |
| **API testing** | Native `APIRequestContext` — no extra HTTP library needed |
| **Page Object Model** | Abstract `BasePage` with typed helpers, fluent interface |
| **Typed API clients** | `PostsClient`, `UsersClient` — full TypeScript domain types |
| **Custom fixtures** | `loginPage`, `homePage`, `postsClient`, `loggedInPage` — zero boilerplate |
| **Tag-based filtering** | `@smoke`, `@regression` — run any subset via `--grep` |
| **Multi-browser matrix** | CI: Chromium × Firefox × WebKit in parallel |
| **Parallel execution** | `fullyParallel: true`, 4 workers in CI |
| **Auto retry** | 2 retries in CI, 0 locally |
| **Reports** | HTML + JUnit XML + GitHub inline annotations |
| **Environments** | `ENV=staging`, `ENV=production` |
| **Strict TypeScript** | `"strict": true` — no `any`, full domain types |

---

## 📁 Project Structure

```
playwright-typescript-framework/
├── playwright.config.ts          # 6 projects: api, chromium, firefox, webkit, mobile-chrome, integration
├── tsconfig.json                 # Strict TypeScript
├── package.json                  # Scripts: test, test:ui, test:api, test:smoke, report…
│
├── src/
│   ├── types/index.ts            # Domain types: Post, User, Todo, LoginCredentials
│   ├── pages/
│   │   ├── base.page.ts          # BasePage: click, fill, assert, wait, screenshot
│   │   ├── login.page.ts         # navigate(), login(), assertLoginSuccess(), logout()
│   │   ├── home.page.ts          # getHeading(), getExampleLinks(), clickLink()
│   │   └── checkboxes.page.ts    # checkAll(), uncheckAll(), areAllChecked()
│   ├── api/
│   │   ├── base.client.ts        # APIClient: get/post/put/patch/delete + assertStatus()
│   │   ├── posts.client.ts       # getAll, getById, create, update, patch, remove
│   │   └── users.client.ts       # getAll, getById, getPosts, getTodos, getAlbums
│   ├── fixtures/index.ts         # Custom fixtures extending Playwright base test
│   └── utils/helpers.ts          # randomString, randomInt, randomEmail, withRetry
│
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts         # 9 tests: smoke login, logout, wrong creds, empty fields
│   │   ├── home.spec.ts          # 5 tests: heading, title, link count, navigation
│   │   └── checkboxes.spec.ts    # 3 tests: count, checkAll, uncheckAll
│   ├── api/
│   │   ├── posts.spec.ts         # 11 tests: GET/POST/PATCH/DELETE + schema + 404
│   │   └── users.spec.ts         # 6 tests: list, get, relationships, 404
│   └── integration/
│       └── ui-api.spec.ts        # 3 tests: UI reachable + API responding together
│
└── .github/workflows/ci.yml      # lint → API + UI matrix (3 browsers) → integration → gate
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/sharika8/playwright-typescript-framework.git
cd playwright-typescript-framework

npm install
npx playwright install          # install all browsers
```

---

## 🧪 Running Tests

```bash
# By suite
npm run test                    # everything
npm run test:ui                 # all UI tests (all browsers)
npm run test:api                # API only — fast, no browser needed
npm run test:smoke              # @smoke tagged only
npm run test:regression         # @regression tagged only

# By browser
npx playwright test tests/ui --project=chromium
npx playwright test tests/ui --project=firefox
npx playwright test tests/ui --project=webkit

# By tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression" --project=chromium

# Debug
npm run test:headed             # visible browser window
npm run test:debug              # step-through with Playwright Inspector
npx playwright test --ui        # interactive UI mode

# Different environment
ENV=staging npm run test:smoke
ENV=production npm run test:api
```

---

## ⚙️ Configuration

### Projects

| Project | Test dir | Browser | Use case |
|---|---|---|---|
| `api` | `tests/api` | none | REST API tests — fastest |
| `chromium` | `tests/ui` | Chrome | Primary UI browser |
| `firefox` | `tests/ui` | Firefox | Cross-browser UI |
| `webkit` | `tests/ui` | Safari | Cross-browser UI |
| `mobile-chrome` | `tests/ui` | Pixel 5 | Mobile viewport |
| `integration` | `tests/integration` | Chrome | UI + API combined |

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `ENV` | `development` | `development` / `staging` / `production` |
| `TEST_USERNAME` | `tomsmith` | Login username for `loggedInPage` fixture |
| `TEST_PASSWORD` | `SuperSecretPassword!` | Login password |

---

## 🏗️ Writing Tests

Import from `src/fixtures` to get page objects and API clients pre-built:

```typescript
import { test, expect } from "../../src/fixtures";
import type { Post } from "../../src/types";

// UI test — loginPage fixture pre-navigates to /login
test("login succeeds @smoke", async ({ loginPage }) => {
  await loginPage.login({ username: "tomsmith", password: "SuperSecretPassword!" });
  await loginPage.assertLoginSuccess();
});

// Already authenticated
test("secure area accessible @regression", async ({ loggedInPage }) => {
  expect(loggedInPage.url()).toContain("/secure");
});

// API test — typed client, no browser
test("100 posts returned @smoke", async ({ postsClient }) => {
  const response = await postsClient.getAll();
  await postsClient.assertStatus(response, 200);
  const posts = await postsClient.json<Post[]>(response);
  expect(posts).toHaveLength(100);
});
```

### Adding a new Page Object

```typescript
// src/pages/dropdown.page.ts
import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class DropdownPage extends BasePage {
  readonly DROPDOWN = "#dropdown";

  constructor(page: Page) { super(page); }

  async navigate(): Promise<DropdownPage> {
    await this.goto("/dropdown");
    return this;
  }

  async selectOption(value: string): Promise<void> {
    await this.page.locator(this.DROPDOWN).selectOption(value);
  }
}
```

Then add it to `src/fixtures/index.ts`:

```typescript
dropdownPage: async ({ page }, use) => {
  const dp = new DropdownPage(page);
  await dp.navigate();
  await use(dp);
},
```

### Adding a new API client

```typescript
// src/api/todos.client.ts
import { APIRequestContext, APIResponse } from "@playwright/test";
import { APIClient } from "./base.client";

export class TodosClient extends APIClient {
  constructor(request: APIRequestContext) { super(request); }

  async getAll(): Promise<APIResponse> { return this.get("/todos"); }
  async getCompleted(): Promise<APIResponse> { return this.get("/todos", { completed: "true" }); }
  async getByUser(userId: number): Promise<APIResponse> {
    return this.get(`/users/${userId}/todos`);
  }
}
```

---

## 🤖 CI/CD Pipeline

| Job | Trigger | Details |
|---|---|---|
| `lint` | every push | TypeScript `tsc --noEmit` + ESLint |
| `api-tests` | every push | API suite — no browser, fast |
| `ui-tests` | every push | Chromium, Firefox, WebKit matrix |
| `integration-tests` | after api+ui | Cross-layer, Chromium only |
| `smoke` | PRs only | `@smoke` tag, fast gate before merge |
| `all-passed` | always | Summary gate for branch protection |

HTML reports + JUnit XML uploaded as artifacts on every run (30-day retention).

---

## 📊 Test Coverage

| Spec | Tests | Tags | Coverage |
|---|---|---|---|
| `ui/login.spec.ts` | 9 | smoke, regression | Login, logout, bad creds, empty, URL |
| `ui/home.spec.ts` | 5 | smoke | Heading, title, links, navigation |
| `ui/checkboxes.spec.ts` | 3 | regression | Count, check all, uncheck all |
| `api/posts.spec.ts` | 11 | smoke, regression | CRUD, schema, content-type, 404 |
| `api/users.spec.ts` | 6 | smoke, regression | List, get, relationships, 404 |
| `integration/ui-api.spec.ts` | 3 | regression | UI + API together |
| **Total** | **37** | | |

---

## 🔗 Related Repos

| Repo | Stack | Description |
|---|---|---|
| [enterprise-qa-framework](https://github.com/sharika8/enterprise-qa-framework) | Python + Playwright | Python POM + custom zero-dep runner |
| [k6-performance-framework](https://github.com/sharika8/k6-performance-framework) | k6 JS | Smoke, load, stress, spike, soak |
| [api-contract-testing](https://github.com/sharika8/api-contract-testing) | Node + Pact | Consumer-driven contract tests |
| [mobile-appium-framework](https://github.com/sharika8/mobile-appium-framework) | Python + Appium | Android + iOS automation |
| [test-data-management](https://github.com/sharika8/test-data-management) | Python | Factories, seeders, fixtures |
| [ci-quality-dashboard](https://github.com/sharika8/ci-quality-dashboard) | React | GitHub Actions CI dashboard |

---

## 📜 Licence

MIT
