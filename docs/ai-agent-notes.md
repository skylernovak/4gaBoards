# AI Agent Usage Notes

## Goal

Use AI agents to accelerate project exploration, E2E test planning, Playwright implementation, and test stabilization for the 4ga Boards take-home exercise.

## AI Agent Skills and Tools Used

| Skill / Tool | Source | Purpose | Why I Used It |
|---|---|---|---|
| `qa-test-planner` | `skills.sh` / `softaworks/agent-toolkit` | Test plan review and prioritization | Helped structure P0/P1/P2 coverage and validate scope against the assignment |
| `playwright-best-practices` | `skills.sh` / `currents-dev/playwright-best-practices-skill` | Playwright implementation guidance | Used to keep tests robust, avoid brittle selectors, and prefer reliable waits |
| `webapp-testing` | `skills.sh` / `anthropics/skills` | Local app and UI exploration | Useful for inspecting rendered behavior and validating automation assumptions |
| `playwright-cli` | `skills.sh` / `microsoft/playwright-cli` | Browser reconnaissance and locator discovery | Useful for quick snapshots, UI inspection, and exploratory interaction when needed |
| `Playwright MCP` | Local MCP server | Browser automation and runtime verification | Used to confirm browser tooling was operational and available for local app inspection and UI-driven debugging |
| `GitHub MCP` | Local MCP server | Repository and pull request access | Used to confirm GitHub integration was operational for repo-aware workflow support without leaving the Codex environment |
| `skill-creator` | `skills.sh` / `anthropics/skills` | Custom skill creation | Used to create the notes-updater workflow skill and align it with Codex |
| `ai-agent-notes-updater` | Local project skill | Documentation maintenance | Ensures AI usage notes are updated after meaningful project milestones |

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

---

## 9. MCP Tooling Verification

### Prompt Used

Confirm whether the Playwright and GitHub MCP servers are operational, then document that these MCPs are also part of the project workflow.

### AI Output Summary

The agent verified the GitHub MCP by reading the authenticated GitHub account context and verified the Playwright MCP by listing the active browser session. It also checked repository state to confirm that these health checks did not require code changes or operational setup commits.

### My Decision

I documented the MCP servers because they are part of the practical AI-assisted QA workflow for this take-home. Browser-side verification and repo-aware tooling are useful supporting capabilities, but I treated them as instrumentation for exploration and validation rather than as evidence of product changes.

---

## 10. Selector Hardening and Headed Verification

### Prompt Used

Implement the fix for `deleteUserByEmail`, then run both existing Playwright specs again in headed mode with one worker.

### AI Output Summary

The agent traced the failing cleanup path to a brittle delete locator that used an exact title selector for `Delete User` even though the rendered control exposed `Delete user`. It recommended switching to role-based lookup, scoping the action to the opened dialog, and rerunning the suite serially in headed mode for clearer verification.

### My Refinement

I accepted the minimal fix because it removed an avoidable selector risk without broadening test scope. Running the suite with one worker in headed mode confirmed the existing login and add-user specs both pass, which is stronger evidence than the earlier parallel run where cleanup failed after the main workflow had already succeeded.
