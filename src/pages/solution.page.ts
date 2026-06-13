/**
 * src/pages/solution.page.ts
 *
 * SolutionPage models the DL Precise™ product solution page at /dl-precise.
 * The page is hosted on Wix; selectors use semantic roles and text matching
 * to stay resilient across Wix class-name changes.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class SolutionPage extends BasePage {
  readonly path = '/dl-precise';

  // ── Primary heading ────────────────────────────────────────────────────────
  // Wix renders page headings as <h2> (not <h1>); fall back through the heading hierarchy.

  readonly mainHeading: Locator = this.page.locator('h1, h2, [role="heading"]').first();
  readonly sectionHeadings: Locator = this.page.locator('h1, h2, h3, [role="heading"]');

  // ── CTAs ───────────────────────────────────────────────────────────────────

  // Wix CTA accessible names don't always surface through getByRole; use text filter instead.
  readonly requestDemoButton: Locator = this.page
    .locator('a, button')
    .filter({ hasText: /request.*demo/i })
    .first();

  readonly getInTouchLink: Locator = this.page
    .locator('a, button')
    .filter({ hasText: /get in touch/i })
    .first();

  readonly contactUsLink: Locator = this.page
    .getByRole('link', { name: /contact us/i })
    .first();

  // ── Product content ────────────────────────────────────────────────────────

  readonly fdaMention: Locator = this.page
    .locator('p, span, div, h2, h3')
    .filter({ hasText: /fda/i })
    .first();

  readonly percentageStats: Locator = this.page
    .locator('p, span, div')
    .filter({ hasText: /\d+%/ });

  readonly dlPreciseMention: Locator = this.page
    .locator('*')
    .filter({ hasText: /dl precise/i })
    .first();

  // ── Evidence section ───────────────────────────────────────────────────────

  readonly evidenceSection: Locator = this.page
    .locator('*')
    .filter({ hasText: /evidence/i })
    .first();

  // ── Partner logos ──────────────────────────────────────────────────────────

  readonly partnerSection: Locator = this.page
    .locator('*')
    .filter({ hasText: /partner/i })
    .first();

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToSolution(): Promise<void> {
    await this.page.goto(`${this.url}${this.path}`, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeadingText(): Promise<string> {
    if (await this.mainHeading.count() === 0) return '';
    return (await this.mainHeading.textContent())?.trim() ?? '';
  }

  async getSectionHeadings(): Promise<string[]> {
    const headings = await this.sectionHeadings.all();
    const texts: string[] = [];
    for (const h of headings) {
      const text = (await h.textContent())?.trim();
      if (text) texts.push(text);
    }
    return texts;
  }

  async isRequestDemoVisible(): Promise<boolean> {
    if (await this.requestDemoButton.count() === 0) return false;
    return this.requestDemoButton.isVisible();
  }

  async getRequestDemoHref(): Promise<string> {
    return (await this.requestDemoButton.getAttribute('href')) ?? '';
  }

  async getStatCount(): Promise<number> {
    return this.percentageStats.count();
  }
}
