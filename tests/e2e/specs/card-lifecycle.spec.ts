import { expect, Page, test } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';
import { uniqueName } from '../helpers/testData';

const projectNamePlaceholder = 'Enter project name...';
const boardNamePlaceholder = 'Enter board name...';
const listNamePlaceholder = 'Enter list name...';
const cardNamePlaceholder = 'Enter card name... [Ctrl+Enter] - open';
const editCardNamePlaceholder = 'Enter card name...';
const descriptionPlaceholder = 'Enter description...';
const descriptionText = 'This card was created by Playwright to validate card detail persistence.';

function xpathLiteral(value: string): string {
  if (!value.includes("'")) {
    return `'${value}'`;
  }

  if (!value.includes('"')) {
    return `"${value}"`;
  }

  return `concat('${value.replace(/'/g, `', "'", '`)}')`;
}

function listWrapper(page: Page, listName: string) {
  return page.locator(`xpath=//div[@title=${xpathLiteral(listName)}]/ancestor::div[contains(@class, 'List_outerWrapper')][1]`);
}

async function createBoardFixture(page: Page, projectName: string, boardName: string, listTodo: string, listInProgress: string, listDone: string, cardTitle: string) {
  await page.goto('/login');
  await loginAsAdmin(page);

  await page.getByRole('button', { name: 'Add Project' }).last().click();
  let dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder(projectNamePlaceholder).fill(projectName);
  await dialog.getByRole('button', { name: 'Add Project' }).click();
  await expect(page).toHaveURL(/\/projects\/[^/]+$/);

  await page.getByRole('button', { name: 'Add Board' }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder(boardNamePlaceholder).fill(boardName);
  await dialog.getByRole('button', { name: 'Add Board' }).click();
  await expect(page).toHaveURL(/\/boards\/[^/]+$/);

  await page.getByRole('button', { name: /add list/i }).click();
  const listNameField = page.getByPlaceholder(listNamePlaceholder);

  await listNameField.fill(listTodo);
  await listNameField.press('Enter');
  await expect(page.locator(`div[title="${listTodo}"]`)).toBeVisible();

  await listNameField.fill(listInProgress);
  await listNameField.press('Enter');
  await expect(page.locator(`div[title="${listInProgress}"]`)).toBeVisible();

  await listNameField.fill(listDone);
  await listNameField.press('Enter');
  await expect(page.locator(`div[title="${listDone}"]`)).toBeVisible();

  const todoList = listWrapper(page, listTodo);
  await todoList.getByRole('button', { name: /add card/i }).click();
  await todoList.getByPlaceholder(cardNamePlaceholder).fill(cardTitle);
  await todoList.getByPlaceholder(cardNamePlaceholder).press('Enter');
  await expect(todoList.locator(`div[title="${cardTitle}"]`)).toBeVisible();
}

test('admin user can open, edit, move, and delete a card', async ({ page }) => {
  const projectName = uniqueName('QE Lifecycle Project');
  const boardName = uniqueName('QE Lifecycle Board');
  const listTodo = uniqueName('To Do');
  const listInProgress = uniqueName('In Progress');
  const listDone = uniqueName('Done');
  const cardTitle = uniqueName('Validate login behavior');
  const updatedCardTitle = uniqueName('Validate user authentication flow');

  await test.step('Create the board fixture with one card', async () => {
    await createBoardFixture(page, projectName, boardName, listTodo, listInProgress, listDone, cardTitle);
  });

  await test.step('Open card details', async () => {
    await page.getByRole('button', { name: new RegExp(cardTitle) }).click();
    await expect(page).toHaveURL(/\/cards\/[^/]+$/);
    await expect(page.locator(`div[title="${cardTitle}"]`).last()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close Card' })).toBeVisible();
  });

  await test.step('Rename the card and verify persistence', async () => {
    await page.locator(`div[title="${cardTitle}"]`).last().click();
    const nameField = page.locator(`textarea[placeholder="${editCardNamePlaceholder}"]`);
    await nameField.fill(updatedCardTitle);
    await nameField.press('Enter');

    await expect(page.locator(`div[title="${updatedCardTitle}"]`).last()).toBeVisible();
    await expect(page.locator(`div[title="${cardTitle}"]`)).toHaveCount(0);

    await page.getByRole('button', { name: 'Close Card' }).click();
    await expect(page).toHaveURL(/\/boards\/[^/]+$/);
    await expect(listWrapper(page, listTodo).locator(`div[title="${updatedCardTitle}"]`)).toBeVisible();

    await page.getByRole('button', { name: new RegExp(updatedCardTitle) }).click();
    await page.reload();
    await expect(page).toHaveURL(/\/cards\/[^/]+$/);
    await expect(page.locator(`div[title="${updatedCardTitle}"]`).last()).toBeVisible();
  });

  await test.step('Add a description and verify it after reopening', async () => {
    await page.getByRole('button', { name: /add description/i }).last().click();
    const descriptionField = page.getByPlaceholder(descriptionPlaceholder);
    await descriptionField.fill(descriptionText);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText(descriptionText, { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Close Card' }).click();
    await page.getByRole('button', { name: new RegExp(updatedCardTitle) }).click();
    await expect(page.getByText(descriptionText, { exact: true })).toBeVisible();
  });

  await test.step('Move the card to In Progress and verify persistence', async () => {
    await page.getByRole('button', { name: 'Edit Card' }).nth(2).click();
    await page.getByRole('button', { name: 'Move Card' }).click();
    await page.getByRole('button', { name: 'Open dropdown' }).nth(2).click();
    await page.locator('[class*="Dropdown_dropdownItem"]', { hasText: listInProgress }).click();
    await page.getByRole('button', { name: 'Move' }).click();

    await expect(page.locator(`div[title="${listInProgress}"]`).last()).toBeVisible();
    await expect(listWrapper(page, listInProgress).locator(`div[title="${updatedCardTitle}"]`)).toBeVisible();
    await expect(listWrapper(page, listTodo).locator(`div[title="${updatedCardTitle}"]`)).toHaveCount(0);

    await page.reload();
    await expect(listWrapper(page, listInProgress).locator(`div[title="${updatedCardTitle}"]`)).toBeVisible();
    await expect(listWrapper(page, listTodo).locator(`div[title="${updatedCardTitle}"]`)).toHaveCount(0);
  });

  await test.step('Delete the card and verify absence after refresh', async () => {
    await page.getByRole('button', { name: new RegExp(updatedCardTitle) }).click();
    await page.getByRole('button', { name: 'Delete Card' }).first().click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete card' }).click();

    await expect(page).toHaveURL(/\/boards\/[^/]+$/);
    await expect(listWrapper(page, listInProgress).locator(`div[title="${updatedCardTitle}"]`)).toHaveCount(0);

    await page.reload();
    await expect(listWrapper(page, listInProgress).locator(`div[title="${updatedCardTitle}"]`)).toHaveCount(0);
  });
});
