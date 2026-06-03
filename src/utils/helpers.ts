import { Page } from "@playwright/test";
export async function waitForPageStable(page: Page, ms = 500: Promise<void> { await page.waitForLoadState("networkidle"); await page.waitForTimeout(ms); }
export function randomString(length = 8, prefix = ""): string { const chars = "abcdefghijklmnopqrstuvwxyz0123456789"; return prefix + Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join(""); }
export function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function randomEmail(domain = "test.example.com"): string { return `${randomString(8)}@${domain}`; }
