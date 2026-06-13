/**
 * src/pages/about.page.ts
 *
 * AboutPage models the About Us / team page at /about-us.
 * Covers leadership, board of directors, scientific advisors, strategic advisors,
 * partner logos, and the footer email subscription form.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class AboutPage extends BasePage {
  readonly path = '/about-us';

  // ── Primary heading ────────────────────────────────────────────────────────
  // Wix renders page headings as <h2> on inner pages; fall back through the heading hierarchy.

  readonly mainHeading: Locator = this.page.locator('h1, h2, [role="heading"]').first();

  // ── Team sections ──────────────────────────────────────────────────────────

  readonly ceoMention: Locator = this.page
    .locator('*')
    .filter({ hasText: /marissa fayer|chief executive|ceo/i })
    .first();

  readonly boardSection: Locator = this.page
    .locator('*')
    .filter({ hasText: /board of directors/i })
    .first();

  readonly advisorSection: Locator = this.page
    .locator('*')
    .filter({ hasText: /advisor/i })
    .first();

  readonly scientificAdvisorSection: Locator = this.page
    .locator('*')
    .filter({ hasText: /scientific advisor/i })
    .first();

  // ── Navigation / CTAs ──────────────────────────────────────────────────────

  readonly contactUsLink: Locator = this.page
    .getByRole('link', { name: /contact us/i })
    .first();

  readonly linkedInLinks: Locator = this.page.locator('a[href*="linkedin.com"]');

  // ── Email subscription (footer) ────────────────────────────────────────────

  readonly emailSubscribeInput: Locator = this.page
    .locator('input[type="email"], input[placeholder*="email" i]')
    .first();

  readonly subscribeButton: Locator = this.page
    .getByRole('button', { name: /subscribe/i })
    .first();

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToAbout(): Promise<void> {
    await this.page.goto(`${this.url}${this.path}`, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeadingText(): Promise<string> {
    if (await this.mainHeading.count() === 0) return '';
    return (await this.mainHeading.textContent())?.trim() ?? '';
  }

  async isCeoMentionVisible(): Promise<boolean> {
    if (await this.ceoMention.count() === 0) return false;
    return this.ceoMention.isVisible();
  }

  async isBoardSectionVisible(): Promise<boolean> {
    if (await this.boardSection.count() === 0) return false;
    return this.boardSection.isVisible();
  }

  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillSubscribeEmail(email: string): Promise<void> {
    await this.emailSubscribeInput.fill(email);
  }

  async getSubscribeInputValue(): Promise<string> {
    return this.emailSubscribeInput.inputValue();
  }

  async getLinkedInLinkCount(): Promise<number> {
    return this.linkedInLinks.count();
  }
}
