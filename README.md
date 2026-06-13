# Deeplook Medical — QA Agentic Solution

Playwright + TypeScript test automation framework for [deeplookmedical.com](https://www.deeplookmedical.com), built using the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles. Designed for agentic execution by Claude Code.

---

## Purpose

This repository provides automated **smoke, functional, and regression** test coverage for the Deeplook Medical public website. It tests every discoverable feature — hero sections, navigation, the DL Precise™ product page, team / about page, news & press, and contact forms — without registering for accounts or submitting any forms.

| Property | Value |
|----------|-------|
| **Target Site** | https://www.deeplookmedical.com |
| **Industry** | Medical Imaging / AI-Assisted Diagnostics |
| **Framework** | Playwright v1.44+ |
| **Language** | TypeScript (strict mode) |
| **Pattern** | Page Object Model (POM) + OOP |
| **AI Tooling** | Claude Code (agentic test generation and maintenance) |

---

## Development Setup

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | LTS recommended |
| npm | 9+ | Bundled with Node |
| Claude Code CLI | latest | For AI-assisted test generation |

### Install

```bash
# Clone the repository
git clone <repo-url>
cd deeplook_medical_QA_Agentic_Solution

# Install Node dependencies
npm install

# Install Playwright browsers (Chromium required; all browsers optional)
npx playwright install chromium
# or install all browsers:
npx playwright install
```

### Verify setup

```bash
npm run typecheck   # TypeScript must compile with zero errors
npm run test:smoke  # Smoke tests must pass against live site
```

---

## Running Tests

```bash
npm test                    # All tests across desktop / tablet / mobile
npm run test:smoke          # @smoke  — HTTPS, title, no critical JS errors
npm run test:navigation     # @navigation  — nav links, routing, mobile menu
npm run test:forms          # @forms  — contact form field interactions
npm run test:visual         # @visual  — screenshot regression
npm run test:responsive     # @responsive  — layout at 390px / 768px / 1280px
npm run test:headed         # Run with browser window visible
npm run report              # Open Playwright HTML report
npm run baseline            # Update visual snapshots (commit the diff)
npm run lint                # ESLint
npm run typecheck           # TypeScript check (no emit)
```

### Filter by tag

```bash
npx playwright test --grep @functional   # Business-logic tests for each page
npx playwright test --grep @smoke        # Smoke gate only
```

### Run against a specific browser

```bash
npx playwright test --project=chromium-desktop
npx playwright test --project=mobile-chrome
npx playwright test --project=tablet
```

---

## Project Structure

```
deeplook_medical_QA_Agentic_Solution/
├── site.config.json              # Target site URL and feature flags
├── playwright.config.ts          # Playwright projects and global settings
├── global-setup.ts               # Pre-flight site reachability check
├── tsconfig.json                 # TypeScript path aliases
│
├── CLAUDE.md                     # Claude Code project instructions (loaded every session)
├── AGENTS.md                     # Cross-tool agent compatibility (Devin, Codex, etc.)
├── Agent.md                      # Agent architecture documentation
├── Skills.md                     # Available Claude Code skills / slash commands
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # BasePage — shared navigation, screenshot, error helpers
│   │   ├── home.page.ts          # HomePage — hero, CTAs, statistics, footer subscription
│   │   ├── navigation.page.ts    # NavigationPage — nav links, mobile menu, reachability
│   │   ├── contact.page.ts       # ContactFormPage — form fields, validation
│   │   ├── solution.page.ts      # SolutionPage — DL Precise™ product page
│   │   ├── about.page.ts         # AboutPage — leadership, board, advisors, partners
│   │   └── blog.page.ts          # BlogPage — news articles, category filters
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom Playwright fixtures (import test from here)
│   ├── utils/
│   │   ├── link-checker.ts       # Link reachability helpers
│   │   └── visual-helper.ts      # Screenshot comparison helpers
│   └── types/
│       └── site-config.types.ts  # SiteConfig interface
│
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts      # HTTPS, title, JS errors, load time
│   ├── navigation/
│   │   └── nav-links.spec.ts              # Nav visibility, 404 checks, mobile menu
│   ├── forms/
│   │   └── contact-form.spec.ts           # Form fields, validation, accessibility
│   ├── functional/
│   │   ├── homepage.spec.ts               # Hero, CTAs, stats, footer subscription
│   │   ├── solution-page.spec.ts          # DL Precise features, FDA mention, CTAs
│   │   ├── about-page.spec.ts             # Team, board, advisors, email subscription
│   │   └── blog-news.spec.ts              # Articles, category filters, post links
│   ├── visual/
│   │   └── visual-regression.spec.ts      # Screenshot baselines across viewports
│   └── responsive/
│       └── layout.spec.ts                 # No horizontal overflow at each breakpoint
│
├── .claude/
│   ├── agents/
│   │   ├── site-analyzer.md      # Crawls live site → populated site.config.json
│   │   └── test-generator.md     # Generates site-specific POM + tests
│   ├── commands/
│   │   ├── analyze-site.md       # /analyze-site
│   │   ├── generate-full-suite.md # /generate-full-suite
│   │   ├── run-smoke.md          # /run-smoke
│   │   ├── update-baseline.md    # /update-baseline
│   │   └── generate-report.md    # /generate-report
│   └── rules/
│       ├── playwright-pom.md     # POM rules scoped to tests/**/*.spec.ts
│       └── typescript-strict.md  # TypeScript rules scoped to src/**/*.ts
│
└── .github/
    ├── workflows/
    │   └── playwright.yml        # CI — runs full suite on PR and push to main
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    ├── PULL_REQUEST_TEMPLATE.md
    ├── CODEOWNERS
    └── CONTRIBUTING.md
```

---

## Architecture

### Page Object Model (POM)

Every page or major section has one class in `src/pages/`. All classes follow these OOP rules:

| Rule | Detail |
|------|--------|
| Extend `BasePage` | All page objects inherit shared navigation, screenshot, and error-checking methods |
| Readonly locators | Properties are `readonly Locator` — defined once, reused across tests |
| Methods = actions | Methods drive user behaviour: `clickDemoButton()`, `fillEmailField()`, `navigateToSolution()` |
| No assertions in POMs | `expect()` belongs only in spec files |
| Strict TypeScript | All properties typed, no `any`, strict mode enforced |

### Test Tags

Every test must have at least one tag:

| Tag | Purpose |
|-----|---------|
| `@smoke` | Site loads, HTTPS, title present, no critical JS errors |
| `@navigation` | Nav links, routing, mobile menu, 404 checks |
| `@forms` | Form field interaction and validation (never submit) |
| `@functional` | Business features: hero, product sections, team, news |
| `@visual` | Screenshot regression via `toHaveScreenshot()` |
| `@responsive` | Layout checks at 390px / 768px / 1280px |

### Custom Fixture

Import `test` and `expect` from `@fixtures/site.fixture` — never from `@playwright/test` directly.
The fixture provides pre-constructed page objects and the loaded `SiteConfig`.

```typescript
import { test, expect } from '@fixtures/site.fixture';

test('example', async ({ homePage, siteConfig }) => { ... });
```

---

## Contributor Rules

1. **Never submit a form.** Test field interactions and validation only — never call `.submit()` or click submit buttons.
2. **Never hardcode the base URL.** Use `siteConfig.url` from the fixture or `baseURL` from Playwright config.
3. **No assertions inside page objects.** All `expect()` calls belong in spec files.
4. **One page class per page / section.** Add locators to the POM — never use `page.locator()` directly in test bodies.
5. **Run `npm run typecheck` before opening a PR.** Zero TypeScript errors required.
6. **Tag every test.** At least one of: `@smoke @navigation @forms @functional @visual @responsive`.
7. **Use Playwright auto-waiting.** No `page.waitForTimeout()` — use `waitForSelector`, `waitForURL`, or `waitForLoadState`.
8. **No `any` without a comment.** Explain why with a one-line comment if you must use `any`.
9. **Real selectors only.** Fetch the live page with `WebFetch` before writing locators — no guessing.
10. **Keep visual baselines current.** Run `npm run baseline` and commit the updated snapshots after intentional UI changes.

See `.github/CONTRIBUTING.md` for the full pull request workflow.

---

## Claude Code Integration

This repo is structured for agentic execution. Claude Code reads `CLAUDE.md` at every session start and can:

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Inspect the live site and update `site.config.json` |
| `/generate-full-suite` | Generate a complete POM + test suite from scratch |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a formatted test results summary |

See `Agent.md` for the agent architecture and `Skills.md` for all available commands.

---

## CI/CD

GitHub Actions runs the full Playwright suite on every pull request and push to `main`.
See `.github/workflows/playwright.yml`.

Test reports are uploaded as artifacts and viewable in the Actions tab.
Visual regression snapshots are stored in `__snapshots__/` and committed to the repo.
