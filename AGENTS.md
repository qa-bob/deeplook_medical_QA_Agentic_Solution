# AGENTS.md — QA Agentic Solution for Deeplook Medical

This file provides project context and agent instructions for AI coding tools that support the `AGENTS.md` convention (Devin, OpenAI Codex, Cursor, etc.).

> **Claude Code users:** Claude Code reads `CLAUDE.md` (which imports this file). See `Agent.md` for the full agent architecture and `Skills.md` for available slash commands.

---

## Project Summary

Playwright + TypeScript regression test suite for [deeplookmedical.com](https://www.deeplookmedical.com). Built on the **Page Object Model (POM)** design pattern with OOP principles. Tests cover smoke, navigation, forms, functional, visual, and responsive scenarios across desktop, tablet, and mobile viewports.

---

## Target Site

| Property | Value |
|----------|-------|
| URL | https://www.deeplookmedical.com |
| Platform | Wix-based website |
| Pages | Home, Solution (DL Precise™), News & Press, About Us, Contact |
| Auth required | No |
| Forms | Contact form at `/contact-us`; email subscription in footer |

---

## Hard Constraints

- **Never submit any form** — test field interactions only; never call `.submit()` or click submit buttons
- **Never hardcode the base URL** — read from `site.config.json` via `siteConfig.url` or Playwright `baseURL`
- **No assertions inside page objects** — all `expect()` calls go in spec files (`tests/**/*.spec.ts`)
- **TypeScript strict mode** — all properties must be typed; no implicit `any`
- **Real selectors only** — inspect the live page before writing any locator

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| `@playwright/test` | ^1.44.0 | Browser automation and assertions |
| TypeScript | ^5.4.0 | Strongly typed test code |
| Node.js | 18+ | Runtime |
| ESLint | ^8.57.0 | Linting |

---

## Commands

```bash
npm test                # Run all tests (desktop / tablet / mobile)
npm run test:smoke      # @smoke only — fastest gate
npm run test:navigation # @navigation only
npm run test:forms      # @forms only
npm run test:visual     # @visual only — screenshot regression
npm run test:responsive # @responsive only
npm run baseline        # Update visual snapshots
npm run typecheck       # TypeScript check — must pass before PR
npm run lint            # ESLint
```

---

## File Layout

```
src/pages/            One class per page, all extend BasePage
src/fixtures/         Custom Playwright fixture — import test from here
src/types/            TypeScript interfaces (SiteConfig)
src/utils/            Helpers (link-checker, visual-helper)
tests/smoke/          @smoke tests
tests/navigation/     @navigation tests
tests/forms/          @forms tests
tests/functional/     @functional tests — one file per page
tests/visual/         @visual tests — screenshot regression
tests/responsive/     @responsive tests
site.config.json      Site URL and feature flags
playwright.config.ts  Playwright projects (desktop / mobile / tablet)
CLAUDE.md             Claude Code instructions (loaded every session)
```

---

## Before Writing Tests

1. Read `site.config.json` to get the URL and flags
2. Fetch the live page to inspect real DOM structure
3. Create or update the relevant POM class in `src/pages/`
4. Write tests that import from `@fixtures/site.fixture`
5. Run `npm run typecheck` — must produce zero errors

---

## Page Object Model Rules

```typescript
// CORRECT — locators as readonly class properties
export class ExamplePage extends BasePage {
  readonly heroHeading: Locator = this.page.locator('h1').first();

  async clickCTA(): Promise<void> {
    await this.page.getByRole('link', { name: /get started/i }).click();
  }
}

// WRONG — don't put locators or assertions inside page object methods
async assertHeadingExists(): Promise<void> {
  await expect(this.page.locator('h1')).toBeVisible(); // NO
}
```

---

## Test Structure

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @tag', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('describes expected behaviour @tag', async ({ homePage }) => {
    const text = await homePage.getMainHeading();
    expect(text.length).toBeGreaterThan(5);
  });
});
```
