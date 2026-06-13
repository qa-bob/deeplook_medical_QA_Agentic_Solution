# Contributing to Deeplook Medical QA

Thank you for contributing. This guide explains the workflow and standards all contributors must follow.

---

## Setup

See the [README](../README.md#development-setup) for full setup instructions.

Quick start:
```bash
npm install
npx playwright install chromium
npm run typecheck   # Must pass before working
npm run test:smoke  # Confirm the site is reachable
```

---

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| New test | `test/<short-description>` | `test/solution-page-functional` |
| Bug fix | `fix/<issue-or-description>` | `fix/nav-link-selector` |
| Maintenance | `chore/<description>` | `chore/update-baselines` |
| Documentation | `docs/<description>` | `docs/update-contributing` |

---

## Before Opening a PR

All of the following must be true:

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes
- [ ] All new/modified tests have at least one tag: `@smoke` `@navigation` `@forms` `@functional` `@visual` `@responsive`
- [ ] No forms are submitted in any test
- [ ] No URLs are hardcoded — all tests use `siteConfig.url` or Playwright `baseURL`
- [ ] Page locators are defined on the POM class, not inline in the test body
- [ ] If visual tests changed, run `npm run baseline` and commit the updated `__snapshots__` diffs

---

## Pull Request Process

1. Branch from `main` using the naming convention above
2. Make your changes
3. Run all checks listed above
4. Open a PR using the template provided (`.github/PULL_REQUEST_TEMPLATE.md`)
5. At least one reviewer must approve before merging
6. Squash-merge into `main`

---

## Code Style

### TypeScript
- Strict mode is on — no `any` without an explanatory comment on the same line
- All return types must be explicit: `Promise<void>`, `Promise<string>`, `Promise<Locator[]>`
- Use nullish coalescing (`??`) when Playwright attribute reads may return `null`
- Check `await element.count() > 0` before calling methods that throw on missing elements

### Playwright
- **No `page.waitForTimeout()`** — use `waitForSelector`, `waitForURL`, or `waitForLoadState`
- **No assertions in page objects** — `expect()` belongs only in spec files
- **No form submissions** — test field interactions and validation only
- **Real selectors** — fetch the live page with `WebFetch` (or a browser) before writing any locator

### Comments
- Write the **why**, not the what — well-named identifiers document the what
- One short line max; never multi-paragraph comment blocks
- No task references in comments (`// fixes #123`) — that belongs in the commit message

---

## Adding a New Page

1. Create `src/pages/<page-name>.page.ts` extending `BasePage`
2. Add all locators as `readonly Locator` properties on the class
3. Add action methods (no assertions in the class)
4. Add a fixture for it in `src/fixtures/site.fixture.ts`
5. Create `tests/functional/<page-name>.spec.ts` (at minimum)
6. Run `npm run typecheck`

## Adding a Test to an Existing Page

1. Find the relevant page object in `src/pages/`
2. Add any new locators needed as `readonly Locator` properties
3. Add the test to the appropriate spec file in `tests/`
4. Tag the test

---

## AI-Assisted Test Generation

Inside a Claude Code session, use:

- `/analyze-site` — refresh `site.config.json` from the live site
- `/generate-full-suite` — generate or update the full POM + test suite
- `/run-smoke` — run smoke tests and get a quick pass/fail report

See `Skills.md` for all available commands and `Agent.md` for the agent architecture.

---

## Questions?

Open a GitHub Issue or Discussion. Label it with `question` and describe what you're trying to test.
