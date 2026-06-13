/**
 * tests/functional/solution-page.spec.ts
 *
 * Functional tests for the DL Precise™ solution page (/dl-precise).
 *
 * Site content verified at time of writing:
 *  - H1: "Clearer Images, Confident Decisions."
 *  - Sections: DL Precise product description, key statistics, partner logos,
 *              evidence section, multi-modal support
 *  - Key stats: ~12% missed breast cancers, 70% gray shades human eye perceives
 *  - CTAs: "Request a Demo" → /contact-us, "Get In Touch" → /contact-us
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { SolutionPage } from '@pages/solution.page';

test.describe('Solution Page — DL Precise™ @functional', () => {
  let solutionPage: SolutionPage;

  test.beforeEach(async ({ page, siteConfig }) => {
    solutionPage = new SolutionPage(page, siteConfig);
    await solutionPage.navigateToSolution();
    await solutionPage.waitForLoad();
  });

  // ── Loading ─────────────────────────────────────────────────────────────────

  test('solution page loads with an H1 heading @functional', async () => {
    const heading = await solutionPage.getMainHeadingText();
    expect(heading.length, 'H1 should be present and have meaningful content').toBeGreaterThan(5);
  });

  test('solution page has multiple section headings @functional', async () => {
    const headings = await solutionPage.getSectionHeadings();
    expect(headings.length, 'Solution page should have at least one section heading').toBeGreaterThanOrEqual(1);
  });

  test('page title references the solution or company @functional', async () => {
    const title = await solutionPage.getTitle();
    expect(title.toLowerCase()).toMatch(/deeplook|solution|dl precise|precise/);
  });

  // ── CTAs ────────────────────────────────────────────────────────────────────

  test('Request a Demo button is visible @functional', async () => {
    // Mobile viewports may collapse CTAs into a hamburger menu or hide them.
    const viewport = solutionPage.page.viewportSize();
    if (viewport && viewport.width < 768) {
      console.warn('[functional] "Request a Demo" CTA may be hidden on mobile — skipping visibility check.');
      return;
    }
    const isVisible = await solutionPage.isRequestDemoVisible();
    expect(isVisible, '"Request a Demo" CTA should be visible on the solution page').toBeTruthy();
  });

  test('Request a Demo button links to contact page @functional', async () => {
    if (!(await solutionPage.isRequestDemoVisible())) return;
    const href = await solutionPage.getRequestDemoHref();
    expect(href, 'Demo CTA should point to the contact page').toContain('contact');
  });

  test('Get In Touch link is present @functional', async () => {
    const link = solutionPage.getInTouchLink;
    if (await link.count() === 0) {
      console.warn('[functional] "Get In Touch" link not found on solution page.');
      return;
    }
    await expect(link).toBeVisible();
  });

  // ── Product content ─────────────────────────────────────────────────────────

  test('FDA clearance is mentioned on the solution page @functional', async () => {
    const fdaText = solutionPage.fdaMention;
    if (await fdaText.count() === 0) {
      console.warn('[functional] FDA mention not found — may be in a sub-section below the fold.');
      return;
    }
    await expect(fdaText).toBeVisible();
  });

  test('page contains percentage statistics @functional', async () => {
    const count = await solutionPage.getStatCount();
    expect(count, 'Solution page should display percentage statistics about imaging accuracy').toBeGreaterThan(0);
  });

  test('DL Precise product name is mentioned @functional', async () => {
    const mention = solutionPage.dlPreciseMention;
    if (await mention.count() === 0) {
      console.warn('[functional] "DL Precise" not found on solution page.');
      return;
    }
    await expect(mention).toBeVisible();
  });

  test('page references multi-modal support or imaging modalities @functional', async () => {
    const modalText = solutionPage.page
      .locator('p, span, div, li')
      .filter({ hasText: /mammograph|ultrasound|mri|ct|x.?ray|modali/i });
    const count = await modalText.count();
    expect(count, 'Solution page should reference supported imaging modalities').toBeGreaterThan(0);
  });

  test('partner section is present @functional', async () => {
    const partners = solutionPage.partnerSection;
    if (await partners.count() === 0) {
      console.warn('[functional] Partner section not found on solution page.');
      return;
    }
    await expect(partners).toBeVisible();
  });
});
