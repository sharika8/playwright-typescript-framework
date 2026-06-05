// src/pages/checkboxes.page.ts — Checkboxes Page Object

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class CheckboxesPage extends BasePage {
  readonly BOXES = "#checkboxes input[type='checkbox']";

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<CheckboxesPage> {
    await this.goto("/checkboxes");
    return this;
  }

  checkboxes(): Locator {
    return this.page.locator(this.BOXES);
  }

  async checkAll(): Promise<void> {
    for (const box of await this.checkboxes().all()) {
      if (!(await box.isChecked())) await box.check();
    }
  }

  async uncheckAll(): Promise<void> {
    for (const box of await this.checkboxes().all()) {
      if (await box.isChecked()) await box.uncheck();
    }
  }

  async areAllChecked(): Promise<boolean> {
    for (const box of await this.checkboxes().all()) {
      if (!(await box.isChecked())) return false;
    }
    return true;
  }

  async areAllUnchecked(): Promise<boolean> {
    for (const box of await this.checkboxes().all()) {
      if (await box.isChecked()) return false;
    }
    return true;
  }
}
