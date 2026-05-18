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

---

## 11. First Planned Spec Implementation

### Prompt Used

Implement the first Playwright spec from the test plan and align the suite structure with the planned `auth.spec.ts` entry point.

### AI Output Summary

The agent followed a test-first path by creating `auth.spec.ts` before the shared helper existed, verifying the expected failure, then adding a small `loginAsAdmin(page)` helper under `tests/e2e/helpers/auth.ts`. After the new spec passed, it removed the older duplicate `login.spec.ts` and reran the suite to confirm the planned auth spec and the existing add-user coverage both stayed green.

### My Refinement

I kept the implementation deliberately small because the main value at this stage is aligning the repository with the test plan without introducing a large abstraction layer. Extracting only the login helper shows stronger SDET judgment than building a framework early, and replacing the legacy login file avoids carrying duplicate smoke coverage as the real MVP specs are added.

---

## 12. Board Creation MVP Flow

### Prompt Used

Proceed with the board creation specs from the test plan and implement the P0 project, board, list, card, and persistence path.

### AI Output Summary

The agent used a test-first approach again by creating `board-creation.spec.ts` before the shared test-data helper existed, verifying the expected module failure, then adding a minimal `uniqueName(prefix)` helper under `tests/e2e/helpers/testData.ts`. It combined code inspection with Playwright MCP reconnaissance to confirm the real `Add Project`, `Add Board`, `Add list`, and `Add card` controls, the English placeholders, and the actual route transitions after project and board creation. The resulting spec covers project creation, board creation, three workflow lists, card creation in the target list, and reload persistence.

### My Refinement

I accepted a small amount of selector pragmatism where the UI does not expose clean semantic containers, such as scoping a list via its titled header and nearest list wrapper, because that is still materially better than using positional selectors or arbitrary waits. The final validation came from rerunning the full current suite and seeing `addUser.spec.ts`, `auth.spec.ts`, and `board-creation.spec.ts` all pass together, which is the right checkpoint before moving to card lifecycle coverage.

---

## 13. Card Lifecycle MVP Flow

### Prompt Used

Proceed with the next set of tests and implement the card lifecycle spec from the plan.

### AI Output Summary

The agent created `card-lifecycle.spec.ts` to cover opening a card, renaming it, adding a description, moving it from `To Do` to `In Progress`, and deleting it with a post-refresh absence check. It reused the existing login and test-data helpers, created its own board fixture inside the spec, and then stabilized the flow by tightening selectors only where the live UI proved ambiguous. The key fixes were scoping the rename field to the modal title textarea, selecting the move destination from the dropdown item rather than the board column header, and scoping delete confirmation to the modal dialog rather than the header delete icon.

### My Refinement

I kept the lifecycle test user-oriented instead of API-oriented, even though some selectors required careful scoping, because the take-home is stronger when it demonstrates that the visible card modal and move/delete flows actually work. The final checkpoint was the most important one: rerunning the full suite and confirming `addUser.spec.ts`, `auth.spec.ts`, `board-creation.spec.ts`, and `card-lifecycle.spec.ts` all pass together, which means the planned MVP coverage is now implemented end-to-end.

---

## 14. GitHub Actions E2E CI

### Prompt Used

Add a functional, maintainable GitHub Actions workflow that runs the Playwright E2E smoke tests against the app in CI, using the existing project structure and keeping the solution lightweight, debuggable, and appropriate for a small team.

### AI Output Summary

The agent inspected the repository before proposing CI details and confirmed that the project uses `pnpm`, the checked-in app starts with `pnpm start`, the Playwright base URL is `http://localhost:3000`, the test directory is `tests/e2e/specs`, and there were no existing `@smoke` tags to filter on. It also found an older workflow that only ran on a narrower trigger set and mutated dependencies in CI, so the new implementation replaced that with a single `playwright.yml` workflow that uses concurrency cancellation, installs pinned toolchain versions, starts Postgres with `docker-compose-dev.yml`, seeds the database, starts the local app, waits for readiness, uploads Playwright artifacts, and writes a concise job summary. After the first push, the agent then reviewed the failed GitHub Actions runs and separated two distinct issues: the existing `deploy.yml` release workflow was still auto-triggering on branch pushes and trying to publish images to the upstream `ghcr.io/rargames/4gaboards` registry, while the new `Playwright CI` workflow failed first in `pnpm/action-setup` and then again when `actions/setup-node` tried to cache `pnpm` before `pnpm` existed on the runner. The latest revision also restructured the workflow into explicit setup, environment, execution, and results phases so the Actions UI exposes each condition and test stage clearly rather than hiding most of the work inside one combined command. It also renamed the visible job to `4gaBoards Playwright Tests`, expanded the fallback suite to include the existing `addUser.spec.ts`, and extracted the reusable board-setup flow into a shared helper module instead of keeping that setup embedded inside one spec.

### My Refinement

I deliberately chose the local app startup path over the production-style `docker-compose.yml` image because the point of this stretch deliverable is to validate the same checked-out code reviewers will inspect, not just a prebuilt container. I also kept the workflow intentionally narrow by running the core MVP specs when `@smoke` tags are absent, avoiding a premature browser matrix or sharding strategy, and validating locally with YAML parsing, formatting checks, and a full serial Playwright run before treating the CI workflow as ready for GitHub-side verification. Once the first GitHub run exposed real failures, I treated that as a workflow-hardening exercise rather than assuming the initial draft was enough: I disabled `deploy.yml` auto-runs by moving it to `workflow_dispatch` only for this fork, replaced `pnpm/action-setup` with a simpler Node 24 plus Corepack activation path, and removed the premature `setup-node` cache hook that expected `pnpm` to exist too early. I then reworked the workflow so reviewers can inspect the CI run like a real SDET pipeline: setup is explicit, the environment phase verifies the DB and app readiness, the suite is listed before execution, Playwright logs stream with the `line` reporter, and the final summary reports total, passed, failed, flaky, and skipped counts instead of only a generic success or failure state. I also agreed with the structural cleanup point on the tests themselves: page objects should own page-level interactions, while repeated multi-step scenario setup such as board/list/card creation belongs in shared helpers or fixtures so future specs can reuse it without copying orchestration logic.

---

## 15. Final Requirement Check and Handoff Readiness

### Prompt Used

Reference the original take-home PDF and evaluate the completed branch against the assignment requirements to determine how well the submission meets the expected bar.

### AI Output Summary

The agent decoded the one-page assignment PDF locally and extracted the core requirements: set up the chosen open-source project locally, identify one or two main features for E2E testing, develop a test plan with test cases, implement the cases using Playwright, and submit a branch containing the test plan, AI-agent markdown files, and Playwright tests. It then compared those requirements against the repository state and confirmed the presence of `TEST_PLAN.md`, `docs/ai-agent-notes.md`, four Playwright specs under `tests/e2e/specs`, shared helpers, and a working local validation path. It also noted that the CI workflow is a stretch deliverable that goes beyond the required submission set rather than substituting for any required artifact.

### My Decision

I consider the branch above the stated requirement bar. The core ask is fully met with a focused feature selection, a detailed and code-aware test plan, implemented Playwright coverage, and explicit AI-agent documentation. The added CI workflow strengthens the submission as a senior-level stretch deliverable because it demonstrates maintainability, debuggability, and ownership beyond the minimum without diluting the original assignment scope.

---

## 16. Lightweight Fixture Layer Refactor

### Prompt Used

Implement a proper but constrained Playwright fixture layer quickly, replacing repeated setup paths with shared fixtures while keeping the current suite green and avoiding a heavy framework rewrite.

### AI Output Summary

The agent introduced a shared custom `test` wrapper under `tests/e2e/fixtures/test.ts` with three typed fixtures: `adminPage` for authenticated navigation, `boardData` for reusable unique board/card naming, and `boardWithCard` for lifecycle tests that need a prebuilt board state. It also split the existing board helper so `createBoardFixtureOnAuthenticatedPage()` can reuse an already logged-in page, migrated the current specs to the fixture layer, and kept the board-creation spec intentionally direct so it still proves the user-facing creation flow instead of hiding the behavior inside a fixture.

### My Refinement

I kept this as a lightweight fixture layer rather than a full test framework because the current suite does not justify more abstraction than that. The most important validation was rerunning the full suite after the refactor and confirming all four specs still pass, which shows the fixtures improved reuse without weakening coverage or making the test flow harder to understand.

---

## 17. AI-Agent Deliverable Packaging

### Prompt Used

For the deliverable "Markdown files used to interact with AI agents," package the branch so reviewers can clearly see the relevant markdown artifacts, including the project instructions, skill usage evidence, and MCP-related notes.

### AI Output Summary

The agent reviewed the repository state, confirmed the branch was already clean and synced with `origin/snorkel-takehome`, and then checked whether the AI-agent deliverable was self-contained inside the repo. That review showed the branch already included `AGENTS.md`, `TEST_PLAN.md`, and this notes document, and that MCP usage was already documented here, but the project-specific skill definition still existed only in the local Codex skill workspace. The agent therefore added a repo-local artifact manifest and a snapshot of the `ai-agent-notes-updater` skill so reviewers can inspect the workflow instructions and milestone-note automation logic directly from the branch without relying on external local paths.

### My Decision

I wanted the deliverable to be reviewable from the repository itself rather than forcing the reviewer to infer which local AI-agent assets mattered. The right packaging choice was to keep the branch focused on the markdown artifacts that actually governed or documented the work, explicitly point to the MCP coverage already captured in these notes, and snapshot the custom project skill that was authored for this take-home rather than trying to vendor every third-party skill bundle into the repo.
