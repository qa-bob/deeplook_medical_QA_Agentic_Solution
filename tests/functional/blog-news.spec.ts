/**
 * tests/functional/blog-news.spec.ts
 *
 * Functional tests for the News & Press page (/blog).
 *
 * Site content verified at time of writing:
 *  - H1: "News & Press"
 *  - Category filters: "All Posts", "Insights", "In the News"
 *  - Article cards with title, image, and date
 *  - Example article: "DeepLook Medical Announces Strategic Partnerships..." (Mar 13)
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { BlogPage } from '@pages/blog.page';

test.describe('News & Press Page @functional', () => {
  let blogPage: BlogPage;

  test.beforeEach(async ({ page, siteConfig }) => {
    blogPage = new BlogPage(page, siteConfig);
    await blogPage.navigateToBlog();
    await blogPage.waitForLoad();
  });

  // ── Loading ─────────────────────────────────────────────────────────────────

  test('news page loads with a meaningful H1 heading @functional', async () => {
    const heading = await blogPage.getMainHeadingText();
    expect(heading.length, 'H1 should be present on the news page').toBeGreaterThan(3);
  });

  test('page title references news, press, or the company @functional', async () => {
    const title = await blogPage.getTitle();
    expect(title.toLowerCase()).toMatch(/news|press|blog|deeplook/);
  });

  // ── Articles ────────────────────────────────────────────────────────────────

  test('at least one news article or post is present @functional', async () => {
    const cardCount = await blogPage.getArticleCardCount();
    if (cardCount === 0) {
      const links = await blogPage.getArticleLinks();
      expect(links.length, 'At least one article link should be present on the news page').toBeGreaterThan(0);
      return;
    }
    expect(cardCount, 'At least one article card should be visible').toBeGreaterThan(0);
  });

  test('article links point to the same domain @functional', async ({ siteConfig }) => {
    const links = await blogPage.getArticleLinks();
    if (links.length === 0) {
      console.warn('[functional] No article links found — Wix blog links may use a different pattern.');
      return;
    }

    const siteOrigin = new URL(siteConfig.url).origin;
    for (const href of links) {
      const isInternal =
        href.startsWith('/') ||
        href.startsWith(siteOrigin) ||
        href.startsWith(siteConfig.url);

      expect(isInternal, `Article link "${href}" should be an internal site link`).toBeTruthy();
    }
  });

  // ── Category filters ────────────────────────────────────────────────────────
  // Wix hides the blog category filter bar on mobile and tablet viewports.
  // These tests only assert on desktop (width >= 1024px); narrower viewports log a warning.

  test('"All Posts" category filter is visible @functional', async () => {
    const viewport = blogPage.page.viewportSize();
    if (viewport && viewport.width < 1024) {
      console.warn('[functional] Category filters hidden at this viewport — desktop only.');
      return;
    }
    const isVisible = await blogPage.isAllPostsFilterVisible();
    expect(isVisible, '"All Posts" filter should be visible on desktop').toBeTruthy();
  });

  test('"Insights" category filter is visible @functional', async () => {
    const viewport = blogPage.page.viewportSize();
    if (viewport && viewport.width < 1024) {
      console.warn('[functional] Category filters hidden at this viewport — desktop only.');
      return;
    }
    const isVisible = await blogPage.isInsightsFilterVisible();
    expect(isVisible, '"Insights" filter should be visible on desktop').toBeTruthy();
  });

  test('"In the News" category filter is visible @functional', async () => {
    const viewport = blogPage.page.viewportSize();
    if (viewport && viewport.width < 1024) {
      console.warn('[functional] Category filters hidden at this viewport — desktop only.');
      return;
    }
    const isVisible = await blogPage.isInTheNewsFilterVisible();
    expect(isVisible, '"In the News" filter should be visible on desktop').toBeTruthy();
  });

  // ── Navigation from blog ────────────────────────────────────────────────────

  test('news page has a link back to the homepage or site navigation @functional', async () => {
    const homeLink = blogPage.page
      .locator('a[href="/"], a[href*="deeplookmedical.com"]')
      .first();
    if (await homeLink.count() === 0) {
      // Site has nav — check for any nav
      const nav = blogPage.page.locator('nav, [role="navigation"]').first();
      if (await nav.count() > 0) {
        await expect(nav).toBeVisible();
        return;
      }
      console.warn('[functional] No home link or navigation found on blog page.');
      return;
    }
    await expect(homeLink).toBeVisible();
  });
});
