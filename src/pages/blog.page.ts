/**
 * src/pages/blog.page.ts
 *
 * BlogPage models the News & Press page at /blog.
 * Covers: page heading, category filter links (All Posts / Insights / In the News),
 * article card presence, and post link extraction.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class BlogPage extends BasePage {
  readonly path = '/blog';

  // ── Primary heading ────────────────────────────────────────────────────────
  // Wix renders page headings as <h2> on inner pages; fall back through the heading hierarchy.

  readonly mainHeading: Locator = this.page.locator('h1, h2, [role="heading"]').first();

  // ── Category filters ───────────────────────────────────────────────────────

  readonly allPostsFilter: Locator = this.page
    .getByRole('link', { name: /all posts/i })
    .first();

  readonly insightsFilter: Locator = this.page
    .getByRole('link', { name: /^insights$/i })
    .first();

  readonly inTheNewsFilter: Locator = this.page
    .getByRole('link', { name: /in the news/i })
    .first();

  // ── Article cards ──────────────────────────────────────────────────────────

  readonly articleCards: Locator = this.page.locator(
    'article, [class*="post"], [class*="blog-item"], [class*="card"]'
  );

  readonly articleLinks: Locator = this.page.locator(
    'a[href*="/post/"], a[href*="/blog/"], a[href*="news"]'
  );

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToBlog(): Promise<void> {
    await this.page.goto(`${this.url}${this.path}`, { waitUntil: 'domcontentloaded' });
  }

  async getMainHeadingText(): Promise<string> {
    if (await this.mainHeading.count() === 0) return '';
    return (await this.mainHeading.textContent())?.trim() ?? '';
  }

  async getArticleCardCount(): Promise<number> {
    return this.articleCards.count();
  }

  async getArticleLinks(): Promise<string[]> {
    const links = await this.articleLinks.all();
    const hrefs: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  async isAllPostsFilterVisible(): Promise<boolean> {
    if (await this.allPostsFilter.count() === 0) return false;
    return this.allPostsFilter.isVisible();
  }

  async isInsightsFilterVisible(): Promise<boolean> {
    if (await this.insightsFilter.count() === 0) return false;
    return this.insightsFilter.isVisible();
  }

  async isInTheNewsFilterVisible(): Promise<boolean> {
    if (await this.inTheNewsFilter.count() === 0) return false;
    return this.inTheNewsFilter.isVisible();
  }

  async clickInsightsFilter(): Promise<void> {
    await this.insightsFilter.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickInTheNewsFilter(): Promise<void> {
    await this.inTheNewsFilter.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
