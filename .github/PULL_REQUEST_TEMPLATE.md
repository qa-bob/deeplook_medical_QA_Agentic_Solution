## What does this PR do?

<!-- One sentence describing the change and why it is needed. -->

## Type of change

- [ ] New test(s)
- [ ] Updated test(s) or page object
- [ ] Bug fix — a failing/flaky test now passes reliably
- [ ] Visual baseline update
- [ ] New page object class
- [ ] Maintenance / refactor
- [ ] Documentation

## Pages / features covered

<!-- List the pages or features this PR tests. Link to the page URL if helpful. -->

-

## Checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes
- [ ] All new tests are tagged with at least one of: `@smoke` `@navigation` `@forms` `@functional` `@visual` `@responsive`
- [ ] No forms are submitted in any test
- [ ] No hardcoded URLs — all tests use `siteConfig.url` or Playwright `baseURL`
- [ ] Selectors are defined in the POM class, not inline in the test body
- [ ] If visual tests changed, `__snapshots__` are updated and reviewed

## Test output / CI link

<!-- Paste relevant Playwright output, a screenshot, or a link to the CI run. Optional but helpful for reviewers. -->
