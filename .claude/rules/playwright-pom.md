---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.ts"
---

# Playwright Test Rules

- Import `test` and `expect` from `@fixtures/site.fixture`, never from `@playwright/test` directly
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never call `page.waitForTimeout()` — use `waitForSelector`, `waitForURL`, or `waitForLoadState` instead
- Never submit a form — test field interactions and validation only; never click submit buttons or call `.submit()`
- Never hardcode the base URL — use `siteConfig.url` from the fixture or `baseURL` from Playwright config
- Never enter real credentials — `auth.required` is `false` in `site.config.json`
- Prefer page object methods over raw `page.locator()` calls in test bodies
- Use `await element.count() > 0` checks before methods that would throw on missing elements
- Use soft assertions (`expect.soft()`) for non-critical checks; hard assertions for core functionality
