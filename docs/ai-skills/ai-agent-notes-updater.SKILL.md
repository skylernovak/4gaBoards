---
name: ai-agent-notes-updater
description: Use this skill whenever a 4ga Boards project milestone is reached and docs/ai-agent-notes.md should be refreshed. Trigger after test plan acceptance, test case acceptance, PDF requirements extraction, acceptance criteria changes, Playwright tests passing or being accepted, flaky test stabilization, selector hardening, commits, PR-ready handoff, or any meaningful project checkpoint. Update the notes from current and recent chat context to highlight practical AI-agent usage, prompt engineering, and experienced SDET judgment.
---

# AI Agent Notes Updater

## Purpose

Update the 4ga Boards AI usage notes so they remain an accurate project deliverable, not a generic changelog.

The target document is `4gaBoards/docs/ai-agent-notes.md` from the workspace root, or `docs/ai-agent-notes.md` when already working inside `4gaBoards`.

## When To Use

Use this skill after meaningful milestones, including:

- PDF requirements extraction or interpretation
- acceptance criteria being locked or materially changed
- test plan accepted
- test cases accepted
- Playwright script created, passing, reviewed, or accepted
- flaky test stabilized
- selectors or waits hardened in a meaningful way
- major scope change
- commit created
- PR-ready or handoff-ready checkpoint

If multiple milestones happen together, make one consolidated update.

## Update Workflow

1. Read the existing notes document before editing.
2. Review the current and recent chat context for prompts, outputs, user decisions, constraints, and milestone outcomes.
3. If the milestone involves files, tests, or commits, inspect the relevant local state before summarizing it.
4. Update the notes with what the user asked, what the agent produced, and how the human refined or accepted it.
5. Keep the document concise, specific, and written from the perspective of a thoughtful SDET using AI deliberately.

## Content Guidance

Capture details that show intelligent AI usage:

- prompt intent and prompt-engineering choices
- why the selected scope was valuable for the take-home exercise
- how AI output was reviewed, narrowed, corrected, or stabilized
- evidence of quality judgment, such as avoiding brittle selectors, preferring reliable assertions, or cutting low-value scope
- outcome of the milestone, especially accepted plans, passing tests, commits, or handoff decisions

Avoid:

- generic praise of AI
- long transcripts
- unsupported claims not visible in chat or local artifacts
- turning the document into a raw changelog
- claiming the PDF was read if its contents were not actually available in the workspace or conversation

## Document Shape

Preserve the existing markdown style unless the user asks for a restructure.

For a new milestone, add or update a numbered section with:

- `Prompt Used`
- `AI Output Summary`
- `My Refinement` or `My Decision`

Use `My Decision` when the human accepted or chose scope. Use `My Refinement` when the human adjusted AI output.

If the current section already covers the milestone, revise it instead of duplicating it.

## Final Check

Before finishing, confirm the notes answer these questions:

- What did the agent help with?
- What prompt or instruction pattern mattered?
- What did the human decide or improve?
- Why does this demonstrate strong SDET judgment for the project?
