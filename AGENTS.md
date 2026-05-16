# AGENTS.md

## Purpose

Use this repository-level instruction file to keep Codex aligned with the 4ga Boards take-home workflow.

## Required Workflow Rule

When a meaningful milestone is reached, Codex must use the `ai-agent-notes-updater` skill to refresh `docs/ai-agent-notes.md` using the current and recent chat context.

Treat the following as milestone events that require a notes update:

- a test plan is accepted
- test cases are accepted
- the first Playwright spec is passing and has been reviewed or accepted
- a flaky test is stabilized
- selectors are hardened or rewritten in a meaningful way
- a major scope change occurs
- acceptance criteria are locked in or materially changed
- a commit is created for a stable milestone
- the work reaches a PR-ready or handoff-ready state
- the PDF requirements pass is complete
- any other checkpoint where the project understanding or delivery state materially changes

When one of those milestones occurs:

1. Invoke the `ai-agent-notes-updater` skill.
2. Read the current and recent chat context before editing the document.
3. Update `docs/ai-agent-notes.md` to reflect what was done, why it changed, and what decision was made.
4. Keep the document focused on practical AI-agent usage, prompt patterns, and the judgment of an experienced SDET.

## Skills

- Use `qa-test-planner` for test plans, manual test cases, regression suites, bug reports, and QA deliverables.
- Use `playwright-best-practices` when writing, reviewing, debugging, or stabilizing TypeScript Playwright tests.
- Use `webapp-testing` when inspecting or testing a running local web app with Playwright-driven browser automation.
- Use `playwright-cli` when interactive browser navigation, snapshots, locator discovery, or quick UI reconnaissance would help.
- Use `test-driven-development` before implementing app features, bug fixes, refactors, or behavior changes. Do not use it for documentation-only or skill-only edits.
- Use `skill-creator` when creating or improving local Codex skills.
- Use `ai-agent-notes-updater` after milestone events to update `docs/ai-agent-notes.md`.

## Additional Guidance

- Prefer the notes-updater skill whenever a project phase closes, even if the user does not explicitly ask for a documentation refresh.
- If multiple milestone events happen together, combine them into a single update pass.
- Do not let the notes drift into a generic changelog. The purpose is to capture useful AI-agent process notes for this project.
- If the milestone involves a code change, reference the relevant test or commit outcome in the notes.
