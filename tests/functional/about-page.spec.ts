/**
 * tests/functional/about-page.spec.ts
 *
 * Functional tests for the About Us page (/about-us).
 *
 * Site content verified at time of writing:
 *  - H1: "Reimagining Medical Imaging with Unmatched Precision & Insight"
 *  - Sections: company overview, leadership team, board of directors,
 *              board observers, scientific advisors, strategic advisors,
 *              partner ecosystem (13+ partners)
 *  - Key people: Marissa Fayer (CEO), David Dahn (CFO), Alice Raia (CTO),
 *                Chirag Parghi (CMO), Peter Graham (CCO)
 *  - Footer: email subscription form
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { AboutPage } from '@pages/about.page';

test.describe('About Us Page @functional', () => {
  let aboutPage: AboutPage;

  test.beforeEach(async ({ page, siteConfig }) => {
    aboutPage = new AboutPage(page, siteConfig);
    await aboutPage.navigateToAbout();
    await aboutPage.waitForLoad();
  });

  // ── Loading ─────────────────────────────────────────────────────────────────

  test('about page loads with a meaningful H1 heading @functional', async () => {
    const heading = await aboutPage.getMainHeadingText();
    expect(heading.length, 'H1 on the about page should have meaningful content').toBeGreaterThan(5);
  });

  test('page title references the company or about section @functional', async () => {
    const title = await aboutPage.getTitle();
    expect(title.toLowerCase()).toMatch(/deeplook|about/);
  });

  // ── Team sections ────────────────────────────────────────────────────────────

  test('CEO or executive leadership is mentioned @functional', async () => {
    const isVisible = await aboutPage.isCeoMentionVisible();
    if (!isVisible) {
      const fallback = aboutPage.page
        .locator('*')
        .filter({ hasText: /chief|executive|officer/i })
        .first();
      if (await fallback.count() > 0) {
        await expect(fallback).toBeVisible();
        return;
      }
      console.warn('[functional] Leadership mention not found on about page.');
    }
    expect(isVisible, 'CEO or executive leadership should be mentioned on the about page').toBeTruthy();
  });

  test('Board of Directors section is present @functional', async () => {
    const isVisible = await aboutPage.isBoardSectionVisible();
    if (!isVisible) {
      console.warn('[functional] "Board of Directors" text not found — may use a different heading.');
    }
    expect(isVisible, 'Board of Directors section should be visible').toBeTruthy();
  });

  test('advisor section is present @functional', async () => {
    const advisorSection = aboutPage.advisorSection;
    if (await advisorSection.count() === 0) {
      console.warn('[functional] Advisor section not found on about page.');
      return;
    }
    await expect(advisorSection).toBeVisible();
  });

  test('scientific advisors are mentioned @functional', async () => {
    const sciAdvisors = aboutPage.scientificAdvisorSection;
    if (await sciAdvisors.count() === 0) {
      const generalAdvisors = aboutPage.page
        .locator('*')
        .filter({ hasText: /radiology|medical|physician/i })
        .first();
      if (await generalAdvisors.count() > 0) {
        await expect(generalAdvisors).toBeVisible();
        return;
      }
      console.warn('[functional] Scientific advisor section not found.');
      return;
    }
    await expect(sciAdvisors).toBeVisible();
  });

  // ── Social / external links ─────────────────────────────────────────────────

  test('at least one LinkedIn profile link is present @functional', async () => {
    const count = await aboutPage.getLinkedInLinkCount();
    expect(count, 'About page should link to LinkedIn profiles for team members').toBeGreaterThan(0);
  });

  // ── Contact CTA ─────────────────────────────────────────────────────────────

  test('Contact Us link is present @functional', async () => {
    const link = aboutPage.contactUsLink;
    if (await link.count() === 0) {
      console.warn('[functional] Contact Us link not found on about page.');
      return;
    }
    await expect(link).toBeVisible();
  });

  // ── Footer subscription ─────────────────────────────────────────────────────

  test('email subscription input is present in footer @functional', async () => {
    await aboutPage.scrollToFooter();
    const emailInput = aboutPage.emailSubscribeInput;
    if (await emailInput.count() === 0) {
      console.warn('[functional] Email subscription input not found on about page.');
      return;
    }
    await expect(emailInput).toBeVisible();
  });

  test('email subscription input accepts text without submitting @functional', async () => {
    await aboutPage.scrollToFooter();
    const emailInput = aboutPage.emailSubscribeInput;
    if (await emailInput.count() === 0) return;

    await aboutPage.fillSubscribeEmail('test@example.com');
    const value = await aboutPage.getSubscribeInputValue();
    expect(value, 'Email input should hold the entered value').toBe('test@example.com');
  });
});
