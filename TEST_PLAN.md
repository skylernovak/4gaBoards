# 4gaBoards Playwright E2E Test Plan

## Executive Summary

This test plan covers focused MVP end-to-end coverage for **4gaBoards**, a Kanban-style task management application. It is aligned with the take-home exercise requirements:

- Explore the project and identify one or two main features for E2E testing.
- Develop a test plan with test cases.
- Implement the test cases using Playwright.
- Document AI-agent usage as part of the final submission.

The selected features are:

1. **Project / Board / List / Card creation**
2. **Card lifecycle management**

These are the strongest E2E candidates because they validate the core user value of 4gaBoards: creating workspaces, organizing work into boards/lists/cards, and moving cards through a workflow.

## Codebase Context

The current repository already contains a Playwright setup:

```text
4gaBoards/tests/playwright.config.ts
4gaBoards/tests/e2e/specs/login.spec.ts
4gaBoards/tests/e2e/specs/addUser.spec.ts
4gaBoards/tests/e2e/pageObjects/LoginPage.ts
4gaBoards/tests/e2e/pageObjects/UserSettingPage.ts
```

Key implementation facts:

- The Playwright base URL is `http://localhost:3000`.
- E2E specs are located under `4gaBoards/tests/e2e/specs`.
- The seeded local admin user is `demo/demo`.
- The app exposes API/UI support for projects, boards, lists, cards, tasks, labels, comments, attachments, and board export.
- Existing E2E coverage is thin: login and admin user creation. Core Kanban workflows are not yet covered.

## Test Strategy

### Goals

- Validate that a user can authenticate and access the application.
- Validate that a user can create the core Kanban hierarchy: project, board, list, and card.
- Validate that created data persists after refresh/navigation.
- Validate that a user can open and edit card details.
- Validate that a card can move through a workflow using the app's supported UI.
- Validate that destructive card deletion behaves correctly.

### In Scope

- Login with seeded local credentials.
- Project creation.
- Board creation using the simplest available template, preferably the empty/default board template.
- List creation.
- Card creation.
- Card detail view.
- Card title editing.
- Card description editing.
- Card movement between lists.
- Card deletion.
- Persistence checks after refresh.

### Out of Scope for MVP

- SSO or external auth providers.
- Realtime collaboration and multi-user behavior.
- File attachments.
- Import/export workflows.
- Full permissions and role-based access.
- Visual regression testing.
- Cross-browser matrix testing.
- Full CI pipeline design.
- Exhaustive task/checklist testing.

These items are intentionally deferred to keep the take-home focused on robust, meaningful Playwright coverage rather than broad but brittle coverage.

## Assumptions

- The app is running locally at `http://localhost:3000`.
- The seeded admin user `demo/demo` is available.
- Tests are written in TypeScript with `@playwright/test`.
- Tests should prefer user-facing locators such as `getByRole`, `getByText`, `getByPlaceholder`, and `getByLabel` where the UI supports them.
- The app uses custom UI controls in places, so stable fallbacks such as `input[name="..."]`, `button[title="..."]`, and scoped visible text locators are acceptable when accessible locators are not exposed.
- Unique test data should be generated per run.
- Tests should avoid arbitrary `waitForTimeout` calls.
- Critical create/edit/move/delete flows should verify persistence with reload checks.

## Recommended Automation Files

```text
4gaBoards/tests/e2e/specs/auth.spec.ts
4gaBoards/tests/e2e/specs/board-creation.spec.ts
4gaBoards/tests/e2e/specs/card-lifecycle.spec.ts
4gaBoards/tests/e2e/helpers/auth.ts
4gaBoards/tests/e2e/helpers/testData.ts
```

Optional lightweight page objects may be added only where they reduce duplication without hiding important assertions.

## Test Data and Cleanup Strategy

Use unique names for all created entities:

```ts
const runId = Date.now();
const projectName = `QE E2E Project ${runId}`;
const boardName = `QE Automation Board ${runId}`;
const listTodo = `To Do ${runId}`;
const listInProgress = `In Progress ${runId}`;
const cardTitle = `Validate login behavior ${runId}`;
```

Cleanup should be practical, not over-engineered:

- Use destructive UI flows where deletion behavior is part of the test objective.
- For non-objective cleanup, use a helper if the UI flow is stable enough.
- If cleanup is deferred, unique names keep repeated local runs debuggable and prevent false positives.

## Test Case Coverage Summary

Keep detailed test cases in this test plan rather than a separate CSV. A single markdown document makes the strategy, coverage, and implementation guidance easier to review for this take-home exercise.

| ID | Priority | Scenario | Automate Now? | Implementation Notes |
|---|---|---|---|---|
| TC-01 | P0 | Log in successfully | Yes | Use seeded `demo/demo` user |
| TC-02 | P0 | Create a new project | Yes | Assert visible project state |
| TC-03 | P0 | Create a board inside a project | Yes | Use empty/default template |
| TC-04 | P0 | Create workflow lists on a board | Yes | Create unique To Do, In Progress, Done lists |
| TC-05 | P0 | Create a card in a list | Yes | Scope assertion to target list |
| TC-06 | P0 | Verify created board data persists after refresh | Yes | Use `page.reload()` and visible assertions |
| TC-07 | P0 | Open card details | Yes | Verify selected card title in detail view |
| TC-08 | P1 | Rename a card | Yes, after P0 path | Verify old title is gone and new title persists |
| TC-09 | P1 | Add or update card description | Yes, after P0 path | Keep text simple; avoid rich-text coverage |
| TC-10 | P0 | Move card from To Do to In Progress | Yes | Prefer Move Card menu over drag-and-drop |
| TC-11 | P1 | Delete a card | Yes, after P0 path | Verify absence after refresh |
| Deferred | P2 | Cancel deletion, tasks, labels, attachments, export, SSO, multi-user | No | Document as future coverage after MVP stabilizes |

## Feature 1: Project / Board / List / Card Creation

### Feature Objective

Validate that a user can create the core Kanban hierarchy needed to manage work in 4gaBoards.

A successful user should be able to:

1. Log in.
2. Create a project.
3. Create a board inside that project.
4. Create workflow lists.
5. Create a card inside a list.
6. Refresh the page and confirm the created data persists.

## TC-01: Log in successfully

**Priority:** P0  
**Type:** Smoke / setup  
**Automation Candidate:** Yes

### Preconditions

- App is running locally.
- Seeded admin user exists.

### Test Data

```text
Username: demo
Password: demo
```

### Steps

1. Navigate to `/login`.
2. Enter the seeded username.
3. Enter the seeded password.
4. Submit the login form.
5. Wait for the authenticated landing page to load.

### Expected Result

- User is authenticated successfully.
- Dashboard or main app shell is visible.
- URL resolves to the authenticated root route.
- No login error is displayed.

### Playwright Notes

- Existing selectors use `input[name="emailOrUsername"]`, `input[name="password"]`, and `button[title="Log in"]`.
- Prefer stable accessible selectors if available, but these existing selectors are acceptable for this app.
- Consider `storageState` later if repeated login becomes a performance problem.

## TC-02: Create a new project

**Priority:** P0  
**Type:** Happy path  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- User is on the dashboard or project landing page.

### Test Data

```text
Project name: QE E2E Project <runId>
```

### Steps

1. Click the create/add project action.
2. Enter a unique project name.
3. Submit the project creation form.
4. Verify the project appears in the project list or dashboard.
5. Open the project.

### Expected Result

- Project is created successfully.
- Project name is visible.
- User can open the project.

### Playwright Notes

- The project add popup uses an input named `name` with placeholder text for entering a project name.
- Assert visible project state, not only URL changes.

## TC-03: Create a board inside a project

**Priority:** P0  
**Type:** Happy path  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A project exists and is open.

### Test Data

```text
Board name: QE Automation Board <runId>
```

### Steps

1. Open the target project.
2. Click the create/add board action.
3. Enter a unique board name.
4. Keep or select the empty/default board template.
5. Submit the board creation form.
6. Verify the board appears inside the project.
7. Open the board.

### Expected Result

- Board is created successfully.
- Board appears under the selected project.
- User can open the board.

### Playwright Notes

- The code includes a built-in empty template (`builtin-empty`).
- Keep this test focused on creating a usable board, not template-management behavior.

## TC-04: Create workflow lists on a board

**Priority:** P0  
**Type:** Happy path  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A board exists and is open.

### Test Data

```text
Lists:
- To Do <runId>
- In Progress <runId>
- Done <runId>
```

### Steps

1. Click the add list action.
2. Create a list named `To Do <runId>`.
3. Create a list named `In Progress <runId>`.
4. Create a list named `Done <runId>`.
5. Verify all three lists are visible on the board.

### Expected Result

- All lists are created successfully.
- Lists are visible as separate workflow columns/sections.

### Playwright Notes

- The list add popup uses a text area with placeholder text for entering a list name.
- Scope list assertions to the board area where possible.
- Verify order only if order is stable and easy to assert without brittle selectors.

## TC-05: Create a card in a list

**Priority:** P0  
**Type:** Happy path  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A board exists.
- A `To Do <runId>` list exists.

### Test Data

```text
Card title: Validate login behavior <runId>
```

### Steps

1. Locate the `To Do <runId>` list.
2. Click the add card action inside that list.
3. Enter a unique card title.
4. Save the card.
5. Verify the card appears inside the `To Do <runId>` list.

### Expected Result

- Card is created successfully.
- Card title is visible.
- Card appears in the expected list.

### Playwright Notes

- The card add UI uses a text area with placeholder text for entering a card name.
- Scope the card assertion to the target list to avoid false positives.

## TC-06: Verify created board data persists after refresh

**Priority:** P0  
**Type:** Persistence / regression  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- Project, board, lists, and card have been created.

### Steps

1. Navigate to the created board.
2. Refresh the page.
3. Verify the board still loads.
4. Verify the expected lists are visible.
5. Verify the created card remains visible in the expected list.

### Expected Result

- Created data remains visible after refresh.
- Card remains in the correct list.
- User session remains valid.

### Playwright Notes

- This is a high-value assertion because it validates persisted state, not only optimistic UI updates.
- Use `page.reload()` followed by explicit visible UI assertions.

## Feature 2: Card Lifecycle Management

### Feature Objective

Validate that a user can manage a card after creation. This includes opening card details, editing card information, moving the card through a workflow, and deleting the card.

A successful user should be able to:

1. Open a card.
2. Edit card details.
3. Move the card between lists.
4. Delete the card.

## TC-07: Open card details

**Priority:** P0  
**Type:** Happy path  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A board exists.
- A card exists.

### Steps

1. Navigate to the board.
2. Click an existing card.
3. Verify the card detail modal or panel opens.
4. Verify the selected card title is visible in the detail view.
5. Close the detail view.

### Expected Result

- Card detail view opens successfully.
- Card title matches the selected card.
- Detail view can be closed.

### Playwright Notes

- Prefer `getByRole('dialog')` if the modal exposes a semantic dialog role.
- If not, use the most stable visible container around the card detail view.

## TC-08: Rename a card

**Priority:** P1  
**Type:** Edit flow  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A board exists.
- A card exists.

### Test Data

```text
Original title: Validate login behavior <runId>
Updated title: Validate user authentication flow <runId>
```

### Steps

1. Open an existing card.
2. Edit the card title.
3. Save the change or trigger the app's auto-save behavior.
4. Close the card detail view.
5. Verify the updated card title appears on the board.
6. Verify the old title no longer appears as the card title.
7. Refresh the page.
8. Verify the updated title persists.

### Expected Result

- Card title updates successfully.
- Updated title is visible on the board.
- Updated title persists after refresh.

### Playwright Notes

- Wait on visible state or the updated value rather than using static waits.
- Use unique names so absence assertions are safe.

## TC-09: Add or update card description

**Priority:** P1  
**Type:** Edit flow  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A card exists.

### Test Data

```text
Description: This card was created by Playwright to validate card detail persistence.
```

### Steps

1. Open an existing card.
2. Add or edit the card description.
3. Save the description.
4. Close the card detail view.
5. Reopen the card.
6. Verify the description is still present.

### Expected Result

- Description saves successfully.
- Description remains visible after closing and reopening the card.

### Playwright Notes

- Keep the description text simple.
- Do not test markdown/rich text formatting in this MVP E2E test.

## TC-10: Move a card from To Do to In Progress

**Priority:** P0  
**Type:** Core Kanban workflow  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A board exists.
- `To Do <runId>` and `In Progress <runId>` lists exist.
- A card exists in `To Do <runId>`.

### Steps

1. Open the card or its card action menu.
2. Choose the app's Move Card action.
3. Select the same project and board.
4. Select the `In Progress <runId>` destination list.
5. Confirm the move.
6. Verify the card is no longer visible under `To Do <runId>`.
7. Verify the card is visible under `In Progress <runId>`.
8. Refresh the page.
9. Verify the card remains in `In Progress <runId>`.

### Expected Result

- Card moves successfully.
- Card appears only in the destination list.
- New card location persists after refresh.

### Playwright Notes

- Prefer the built-in Move Card menu flow over drag-and-drop.
- The code includes a `CardMoveStep` with project, board, and list dropdowns.
- Use `dragTo()` only if the menu-based move path is unavailable.

## TC-11: Delete a card

**Priority:** P1  
**Type:** Destructive action  
**Automation Candidate:** Yes

### Preconditions

- User is logged in.
- A board exists.
- A uniquely named card exists.

### Steps

1. Open the card or its card action menu.
2. Click delete card.
3. Confirm the deletion.
4. Verify the card no longer appears on the board.
5. Refresh the page.
6. Verify the card is still absent.

### Expected Result

- Card is deleted after confirmation.
- Card does not reappear after refresh.

### Playwright Notes

- Use unique card names so absence assertions are safe.
- This test can double as cleanup for the card lifecycle spec.

## Deferred Test Cases

These are valid but should not be implemented until the P0/P1 path is stable:

| Candidate | Reason to Defer |
|---|---|
| Cancel card deletion | Useful safety check, but lower value than confirming deletion works |
| Task/checklist item creation | Supported by code, but more UI-specific and not core to the MVP path |
| Labels and members | Valuable later, but expands scope and setup complexity |
| Attachments | Requires file handling and cleanup |
| Board import/export | Useful feature coverage, but outside the selected MVP flow |
| SSO auth | External dependency and out of scope for local take-home |
| Multi-user collaboration | Requires multiple sessions and more fixture design |

## Recommended MVP Automation Scope

### `auth.spec.ts`

Covers:

- TC-01: Log in successfully

### `board-creation.spec.ts`

Covers:

- TC-02: Create a new project
- TC-03: Create a board inside a project
- TC-04: Create workflow lists on a board
- TC-05: Create a card in a list
- TC-06: Verify created board data persists after refresh

### `card-lifecycle.spec.ts`

Covers:

- TC-07: Open card details
- TC-08: Rename a card
- TC-09: Add or update card description
- TC-10: Move a card from To Do to In Progress
- TC-11: Delete a card

## Implementation Order

1. Confirm `pnpm ci:test:e2e` or local equivalent can run the existing Playwright suite.
2. Add or reuse `loginAsAdmin(page)`.
3. Add `uniqueName(prefix)` test data helper.
4. Implement the project/board/list/card creation flow.
5. Add reload persistence assertions.
6. Implement card lifecycle actions in a second spec.
7. Stabilize selectors and waits before adding any deferred tests.

## Helper Recommendations

Keep helpers small and readable:

```text
4gaBoards/tests/e2e/helpers/auth.ts
4gaBoards/tests/e2e/helpers/testData.ts
```

Recommended helpers:

- `loginAsAdmin(page)`
- `uniqueName(prefix)`
- `createProject(page, projectName)`
- `createBoard(page, boardName)`
- `createList(page, listName)`
- `createCard(page, listName, cardTitle)`

Avoid building a large framework before the core tests are passing. The take-home will be stronger if the implementation is simple, readable, and stable.

## Playwright Locator Guidance

Preferred order:

1. `getByRole` when the UI exposes useful roles and names.
2. `getByLabel` when form labels are accessible.
3. `getByPlaceholder` for project, board, list, and card name inputs where placeholders are stable.
4. `getByText` for visible project, board, list, and card names.
5. Scoped locators inside list/card containers.
6. Existing stable fallbacks such as `input[name="..."]` or `button[title="..."]`.

Avoid:

- unscoped text assertions for card titles that may appear in multiple places
- arbitrary `waitForTimeout`
- drag-and-drop as the first movement strategy
- assertions that only prove optimistic UI updates

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Brittle selectors in custom controls | Prefer user-facing locators; use stable attribute fallbacks when needed |
| Drag-and-drop flakiness | Use the card action menu's Move flow first |
| Test data collisions | Generate unique names per run |
| Optimistic UI false positives | Reload and assert persisted state after key actions |
| Over-scoping the take-home | Complete P0 first, then add P1 only if stable |
| Cleanup complexity | Use unique data and targeted cleanup rather than a heavy cleanup framework |

## Final Recommendation

This plan is ready for implementation after the repo-specific updates above. It demonstrates strong QA judgment because it:

- selects the highest-value product workflows
- keeps scope realistic for a take-home assignment
- validates persistence, not just UI interaction
- avoids high-flake areas like drag-and-drop where the app provides a menu path
- uses the existing Playwright setup rather than inventing unnecessary structure
- leaves clear room for deferred coverage without diluting the MVP tests
