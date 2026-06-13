---
paths:
  - "src/**/*.ts"
---

# TypeScript Rules for Page Objects and Utilities

- All page object classes must extend `BasePage` from `@pages/base.page`
- All locators must be declared as `readonly Locator` properties on the class body — not inside methods
- Methods represent user actions; they must never contain `expect()` assertions
- Never use `any` without an explanatory comment on the same line
- All method return types must be explicit: `Promise<void>`, `Promise<string>`, `Promise<Locator[]>`, etc.
- Use `??` (nullish coalescing) when Playwright attribute reads may return `null` — example: `(await el.textContent()) ?? ''`
- Check `await element.count() > 0` before calling methods that throw on zero-match locators
- Path aliases are configured in `tsconfig.json`: use `@pages/`, `@fixtures/`, `@utils/`, `@types/`
