# AI-Agent Deliverable Artifacts

This document groups the markdown artifacts in this branch that demonstrate practical AI-assisted work for the take-home assignment.

## Primary Deliverable Files

- [`AGENTS.md`](../AGENTS.md)
  Repo-level instructions that governed how Codex should work in this project, including when to refresh AI usage notes and which local skills to use for test planning, Playwright work, and milestone documentation.
- [`TEST_PLAN.md`](../TEST_PLAN.md)
  The main QA planning deliverable produced with AI assistance and then refined to reflect the actual product, scope, and risk priorities.
- [`docs/ai-agent-notes.md`](./ai-agent-notes.md)
  The running record of prompts, decisions, refinements, MCP usage, and milestone outcomes across the project.

## Skill Files Used

These are the skills explicitly referenced in the project notes and workflow.

### Project Skill Snapshot

- [`docs/ai-skills/ai-agent-notes-updater.SKILL.md`](./ai-skills/ai-agent-notes-updater.SKILL.md)
  Local project skill created for this repo so AI usage notes are refreshed after meaningful milestones.

### External Skill References Used During Development

These skills lived in the local Codex skill workspace during implementation. They are listed here so reviewers can see exactly which skill definitions informed the work, even when the full upstream skill bundles are not part of this repository.

| Skill | Local Development Path | How It Was Used |
| --- | --- | --- |
| `qa-test-planner` | `.agents/skills/qa-test-planner/SKILL.md` | Used to structure the test plan and review deliverable quality from a Senior SDET perspective |
| `playwright-best-practices` | `.agents/skills/playwright-best-practices/SKILL.md` | Used to guide selector quality, waits, fixture structure, and CI design |
| `webapp-testing` | `.agents/skills/webapp-testing/SKILL.md` | Used for local app inspection and runtime validation patterns |
| `playwright-cli` | `.agents/skills/playwright-cli/SKILL.md` | Used for browser reconnaissance, locator discovery, and exploratory interaction |
| `skill-creator` | `.agents/skills/skill-creator/SKILL.md` | Used to create the project-specific notes updater skill |

## MCP Tooling Covered In Markdown

The repo-level AI notes already document the MCP tooling that was part of the workflow:

- `Playwright MCP`
  Recorded in [`docs/ai-agent-notes.md`](./ai-agent-notes.md) as the browser automation and runtime verification tool used for UI-driven validation.
- `GitHub MCP`
  Recorded in [`docs/ai-agent-notes.md`](./ai-agent-notes.md) as the repo-aware tooling used for GitHub inspection and workflow support.

## Why This File Exists

The assignment asks for markdown files used to interact with AI agents. Without a manifest, some of that context would remain implicit or depend on local workspace conventions outside the repository. This file makes the deliverable reviewable from the branch itself by pointing directly to the repo-controlled instructions, notes, and skill-related evidence.
