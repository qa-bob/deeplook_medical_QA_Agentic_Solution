# Agent Architecture

This document describes the Claude Code subagents configured for this repository, how they work, and how to add new ones.

---

## Overview

Two specialized subagents are defined in `.claude/agents/`. Claude Code reads these definitions and automatically delegates tasks that match each agent's description. Agents run in their own context window, keeping the main session clean.

---

## site-analyzer

**File:** `.claude/agents/site-analyzer.md`

**Role:** Crawls a live website and produces a fully-populated `site.config.json`.

**Invoked when:**
- Onboarding a new target site (first-time config generation)
- Verifying an existing `site.config.json` is accurate after a redesign
- Running the `/analyze-site` slash command

**Capabilities:**
- Navigate to URLs via headless browser context
- Inspect DOM: read text content, attributes, element counts, nav structure
- Follow HTTP redirects to identify the canonical URL
- Dismiss cookie consent banners before inspecting structure
- Set viewport to mobile / tablet / desktop sizes
- Check link reachability via HEAD requests

**Output:** A complete, validated `site.config.json` with all fields populated:

```json
{
  "name": "string",
  "url": "string — canonical URL after redirects",
  "description": "string — from <meta name='description'>",
  "industry": "string — inferred from page copy",
  "hasContactForm": true,
  "expectedNavItems": ["Solution", "News", "About", "Contact Us"],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false, "loginUrl": "", "username": "", "password": "" }
}
```

**Tools:** WebFetch, Read, Write, Grep, Glob

---

## test-generator

**File:** `.claude/agents/test-generator.md`

**Role:** Reads `site.config.json` and generates site-specific Playwright test files beyond the shared framework suites.

**Invoked when:**
- A site has unique functionality not covered by the generic suites
- Writing regression tests for a recently discovered bug
- A site's structure requires site-specific locators
- Running the `/generate-full-suite` slash command

**Output:** TypeScript test files in `tests/custom/<scenario-name>.spec.ts` and updated POM classes in `src/pages/`.

**Rules applied by this agent:**
- Imports from `@fixtures/site.fixture`
- Tags all tests appropriately
- Follows strict TypeScript (no implicit `any`)
- Never submits forms
- Adds new locators to POM classes, not directly in spec files

**Tools:** WebFetch, Read, Write, Edit, Grep, Glob, Bash

---

## Slash Commands that Invoke Agents

| Command | Agent | What happens |
|---------|-------|-------------|
| `/analyze-site` | site-analyzer | Crawls site, updates `site.config.json`, reports issues |
| `/generate-full-suite` | test-generator | Analyzes site, generates full POM + test suite |
| `/run-smoke` | — (direct) | Runs `npm run test:smoke`, parses results |
| `/update-baseline` | — (direct) | Runs `npm run baseline`, reports updated snapshots |
| `/generate-report` | — (direct) | Reads `test-results/results.json`, formats summary |

---

## Frontmatter Format

Agent files in `.claude/agents/` use YAML frontmatter to declare their identity and tool access:

```markdown
---
name: agent-name
description: >
  One or two sentences explaining exactly when Claude should delegate to this
  agent. This text is what Claude reads to decide whether to invoke it.
tools:
  - Read
  - Write
  - WebFetch
  - Grep
  - Glob
  - Bash
model: claude-haiku-4-5   # Optional: override model for cost/speed
---

## Role
...system prompt and step-by-step instructions...
```

**Required frontmatter fields:** `name`, `description`

**Optional fields:** `tools` (restrict available tools), `model` (default inherits from main session)

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md`
2. Add frontmatter with `name`, `description`, and optional `tools`
3. Write the system prompt: role, capabilities, inputs, outputs, step-by-step instructions
4. Test by asking Claude to perform a task that matches the description

See the [Claude Code sub-agents documentation](https://code.claude.com/docs/en/sub-agents) for the full specification.

---

## Agent Memory

Subagents can maintain their own auto memory. To enable, add to the agent's frontmatter:

```yaml
---
name: my-agent
description: ...
memory: true
---
```

Auto memory lets the agent accumulate learnings (selector patterns, site quirks, debugging insights) across sessions without manual effort.
