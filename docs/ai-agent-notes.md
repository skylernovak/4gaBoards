# AI Agent Usage Notes

## Goal

Use AI agents to accelerate project exploration, E2E test planning, Playwright implementation, and test stabilization for the 4ga Boards take-home exercise.

## 1. Project Exploration

### Prompt Used

I am testing the open-source project 4ga Boards. Review the project structure and identify the main user workflows that would make strong candidates for Playwright E2E tests. Focus on MVP product value and avoid brittle or environment-dependent features.

### AI Output Summary

The agent identified project/board/card creation and card lifecycle management as the strongest E2E candidates.

### My Decision

I selected these features because they validate the core Kanban workflow and are realistic to automate in the take-home timeframe.

---

## 2. Test Plan Generation

### Prompt Used

Create an E2E test plan for 4ga Boards covering:
- user authentication
- project creation
- board creation
- list creation
- card creation
- card editing
- card movement
- card deletion

Include priority, preconditions, steps, expected results, and Playwright automation notes.

### AI Output Summary

The agent generated test cases covering the main happy paths and a small number of negative/destructive cases.

### My Refinement

I reduced scope to the highest-value P0/P1 cases to keep the implementation focused and reliable.

---

## 3. Playwright Implementation

### Prompt Used

Using the existing app UI and selectors, generate Playwright tests for creating a project, board, list, and card. Prefer role-based selectors and avoid brittle CSS selectors unless no accessible locator exists.

### AI Output Summary

The agent generated an initial Playwright spec with helper functions for login and entity creation.

### My Refinement

I reviewed the selectors, replaced brittle locators where possible, added unique test data, and added assertions after each major action.

---

## 4. Debugging and Stabilization

### Prompt Used

This Playwright test fails intermittently after creating a card. Review the test and suggest more reliable waits/assertions without using arbitrary timeouts.

### AI Output Summary

The agent suggested waiting for visible UI state changes and backend persistence indicators instead of static waits.

### My Refinement

I updated the test to assert that the created card is visible in the expected list and persists after page reload.

---

## 5. Agent Workflow Rules and Documentation Maintenance

### Prompt Used

Create a reusable AI-agent rule and skill so the project notes are updated after meaningful milestones, including accepted test plans, accepted test cases, passing Playwright scripts, stabilization work, commits, and PDF project checkpoints. Review recent chat context before updating the document.

### AI Output Summary

The agent identified `AGENTS.md` as the closest Codex equivalent to a strict repo-level rule and created an `ai-agent-notes-updater` skill to guide updates to this document.

### My Decision

I chose a milestone-based documentation workflow so AI usage is captured as part of the QA delivery process, not reconstructed at the end. This keeps the notes focused on practical agent usage, prompt design, and SDET judgment throughout the take-home exercise.

---

## 6. Test Plan Review Against Requirements and Code

### Prompt Used

Review the drafted 4gaBoards Playwright E2E test plan against the original take-home PDF requirements and the actual application codebase. Use the Senior SDET review prompt from the draft, apply the QA test planning skill, and recommend improvements that make the plan more reliable, realistic, and code-aware.

### AI Output Summary

The agent extracted the PDF requirements, confirmed the assignment scope, inspected the existing Playwright setup and 4gaBoards code paths, and recommended keeping the two-feature focus on project/board/list/card creation and card lifecycle management. It also identified repo-specific improvements, including using `demo/demo`, matching the actual `tests/e2e/specs` layout, preferring the app's Move Card menu over drag-and-drop, validating persistence with reload checks, and deferring lower-value flows such as attachments, SSO, and multi-user collaboration.

### My Refinement

I used the review to produce a final draft that is grounded in tangible code rather than a generic Kanban test plan. The final version keeps the scope realistic for the take-home while showing stronger SDET judgment through prioritization, selector-risk mitigation, cleanup strategy, and implementation sequencing.

---

## 7. Final Test Plan Formatting

### Prompt Used

Evaluate whether test cases should live inside the test plan or in a separate CSV/document, then update the final test plan accordingly.

### AI Output Summary

The agent recommended keeping test cases inside the markdown test plan for this take-home exercise and adding a compact coverage table for reviewer scanning. It advised against CSV because there is no test-management import requirement and markdown preserves better traceability between strategy, priority, and implementation guidance.

### My Decision

I kept the detailed test cases in the main test plan and added a coverage summary table. This makes the submission easier to review while preserving enough detail for Playwright implementation.

---

## 8. Test Plan Deliverable Update

### Prompt Used

Update the repository `TEST_PLAN.md` with the finalized 4gaBoards Playwright E2E test plan.

### AI Output Summary

The agent copied the finalized markdown test plan into the project-level `TEST_PLAN.md`, making it part of the take-home deliverable rather than leaving it only in the Downloads draft file.

### My Decision

I promoted the finalized plan into the repository so the submission branch contains the required test plan artifact alongside the Playwright tests and AI usage documentation.
