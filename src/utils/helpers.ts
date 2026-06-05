// src/utils/helpers.ts — shared test utilities

import { Page } from "@playwright/test";

/** Wait for network idle then a small buffer — useful after form submissions. */
export async function waitForPageStable(page: Page, ms = 500): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(ms);
}

/** Random alphanumeric string. */
export function randomString(length = 8, prefix = ""): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const rand = Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return prefix + rand;
}

/** Random integer between min and max inclusive. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random email address. */
export function randomEmail(domain = "test.example.com"): string {
  return `${randomString(8)}@${domain}`;
}

/** Retry a function up to `times` attempts with exponential backoff. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  times = 3,
  delayMs = 500
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < times - 1) {
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}
