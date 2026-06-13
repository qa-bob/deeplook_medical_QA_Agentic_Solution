/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config. All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { SolutionPage } from '@pages/solution.page';
import { AboutPage } from '@pages/about.page';
import { BlogPage } from '@pages/blog.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** SolutionPage (DL Precise™) page object (does not auto-navigate) */
  solutionPage: SolutionPage;
  /** AboutPage page object (does not auto-navigate) */
  aboutPage: AboutPage;
  /** BlogPage (News & Press) page object (does not auto-navigate) */
  blogPage: BlogPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the contact page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * solutionPage — constructs SolutionPage (/dl-precise) without navigating.
   * Call solutionPage.navigateToSolution() in your test or beforeEach.
   */
  solutionPage: async ({ page, siteConfig }, use) => {
    const solutionPage = new SolutionPage(page, siteConfig);
    await use(solutionPage);
  },

  /**
   * aboutPage — constructs AboutPage (/about-us) without navigating.
   * Call aboutPage.navigateToAbout() in your test or beforeEach.
   */
  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },

  /**
   * blogPage — constructs BlogPage (/blog) without navigating.
   * Call blogPage.navigateToBlog() in your test or beforeEach.
   */
  blogPage: async ({ page, siteConfig }, use) => {
    const blogPage = new BlogPage(page, siteConfig);
    await use(blogPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
