---
name: Bug report
about: A test is failing, producing false positives, or generating flaky results
title: '[BUG] '
labels: bug
assignees: ''
---

## Describe the bug

<!-- What test is failing and what is the unexpected behaviour? -->

## Test file and test name

<!-- Example: tests/functional/solution-page.spec.ts — "solution page displays key statistics" -->

## Steps to reproduce

```bash
npx playwright test <test-file> --grep "<test name>" --headed
```

1. Run the command above
2. Observe the failure

## Expected behaviour

<!-- What should the test assert? -->

## Actual behaviour

<!-- What does the test actually assert, or what error is thrown? -->

## Environment

| Property | Value |
|----------|-------|
| OS | |
| Node version | |
| Playwright version | |
| Browser | |
| Project | `chromium-desktop` / `mobile-chrome` / `tablet` |

## Playwright error output

```
Paste error output here
```

## Additional context

<!-- Screenshots, CI link, or related issues. -->
