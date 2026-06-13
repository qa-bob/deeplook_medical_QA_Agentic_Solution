# Skills Reference

This document lists all Claude Code slash commands (skills) available in this repository, what they do, and how to add new ones.

Skills are defined in `.claude/commands/`. Invoke them with `/command-name` inside a Claude Code session.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Analyze the live website and produce a fully-populated `site.config.json`.

**Usage:**
```
/analyze-site [url]
```

If `url` is omitted, reads the URL from `site.config.json`.

**What it does:**
1. Navigate to the site (or URL override)
2. Extract title, meta description, nav links, form elements, H1, primary CTAs
3. Attempt to find the contact page at `/contact`, `/contact-us`, `/get-in-touch`
4. Check for responsiveness issues at 390px viewport
5. Output a completed `site.config.json` and an issues checklist

**Output format:**
- Complete JSON block
- Issues checklist (missing meta description, broken links, etc.)
- Confidence assessment (High / Medium / Low)

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyze the site and generate a complete POM + test suite from scratch.

**Usage:**
```
/generate-full-suite
```

**What it does:**
1. Run `/analyze-site` to update `site.config.json`
2. Fetch each discovered page to inspect the real DOM
3. Create or update page object classes in `src/pages/` (one per page)
4. Update `src/fixtures/site.fixture.ts` with new page object fixtures
5. Write test files across all suites (`smoke/`, `navigation/`, `forms/`, `functional/`, `visual/`, `responsive/`)
6. Run `npx tsc --noEmit` to confirm TypeScript compiles clean
7. Report what was created, updated, and any coverage gaps

**Rules enforced:**
- No placeholder selectors — live page inspected before every locator
- No form submissions
- All tests tagged appropriately
- TypeScript must compile before success is reported

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Run the `@smoke` test suite and report results.

**Usage:**
```
/run-smoke
```

**What it does:**
1. Execute `npm run test:smoke`
2. Parse results from `test-results/results.json`
3. Report: total passed / failed / skipped, any failures with error detail and file location

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Refresh visual regression snapshot baselines after intentional UI changes.

**Usage:**
```
/update-baseline
```

**What it does:**
1. Run `npm run baseline` to regenerate all `@visual` snapshots
2. Report which files were updated in `__snapshots__/`
3. Remind the contributor to review the diffs and commit the updated snapshots

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Generate a formatted test results summary from the most recent test run.

**Usage:**
```
/generate-report
```

**What it does:**
1. Read `test-results/results.json`
2. Produce a markdown summary: pass / fail counts by suite and viewport
3. Highlight any failing tests with file path, test name, and error message

---

## Skill File Format

Skills in `.claude/commands/` are plain markdown. The filename (without `.md`) becomes the slash command.

```markdown
# /command-name

Short description of what this skill does.

## Usage

/command-name [optional-arg]

## What this command does

1. First step
2. Second step
3. ...
```

### Optional frontmatter

Skills support YAML frontmatter for advanced control:

```markdown
---
description: >
  One sentence shown to Claude when deciding whether to auto-invoke this skill.
allowed-tools:
  - Read
  - Write
  - Bash
run-in-subagent: true   # Run in isolated context window
---
```

- `description` — Claude uses this to auto-invoke the skill when relevant
- `allowed-tools` — restrict which tools the skill can use
- `run-in-subagent: true` — run in an isolated context window (protects main session)

---

## Where Skills Live

| Location | Scope |
|----------|-------|
| `.claude/commands/` | Project-scoped (this repo only) |
| `~/.claude/commands/` | User-scoped (all your projects) |

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md`
2. Write the instructions in plain markdown
3. Optionally add YAML frontmatter for tool restrictions or auto-invocation
4. Test by typing `/<skill-name>` in a Claude Code session

See the [Claude Code skills documentation](https://code.claude.com/docs/en/skills) for the full specification.
