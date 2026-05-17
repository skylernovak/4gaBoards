import { expect, Page, test } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';
import { uniqueName } from '../helpers/testData';

const projectNamePlaceholder = 'Enter project name...';
const boardNamePlaceholder = 'Enter board name...';
const listNamePlaceholder = 'Enter list name...';
const cardNamePlaceholder = 'Enter card name... [Ctrl+Enter] - open';

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

test('admin user can create project, board, lists, and card that persist after refresh', async ({ page }) => {
  const projectName = uniqueName('QE E2E Project');
  const boardName = uniqueName('QE Automation Board');
  const listTodo = uniqueName('To Do');
  const listInProgress = uniqueName('In Progress');
  const listDone = uniqueName('Done');
  const cardTitle = uniqueName('Validate login behavior');

  await test.step('Log in as admin', async () => {
    await page.goto('/login');
    await loginAsAdmin(page);
  });

  await test.step('Create a new project', async () => {
    await page.getByRole('button', { name: 'Add Project' }).last().click();

    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder(projectNamePlaceholder).fill(projectName);
    await dialog.getByRole('button', { name: 'Add Project' }).click();

    await expect(page).toHaveURL(/\/projects\/[^/]+$/);
    await expect(page.locator(`div[title="${projectName}"]`).first()).toBeVisible();
  });

  await test.step('Create a board inside the project', async () => {
    await page.getByRole('button', { name: 'Add Board' }).first().click();

    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder(boardNamePlaceholder).fill(boardName);
    await dialog.getByRole('button', { name: 'Add Board' }).click();

    await expect(page).toHaveURL(/\/boards\/[^/]+$/);
    await expect(page.locator(`[title="${boardName}"]`).first()).toBeVisible();
  });

  await test.step('Create workflow lists', async () => {
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
  });

  await test.step('Create a card in the To Do list', async () => {
    const todoList = listWrapper(page, listTodo);

    await todoList.getByRole('button', { name: /add card/i }).click();
    await todoList.getByPlaceholder(cardNamePlaceholder).fill(cardTitle);
    await todoList.getByPlaceholder(cardNamePlaceholder).press('Enter');

    await expect(todoList.locator(`div[title="${cardTitle}"]`)).toBeVisible();
  });

  await test.step('Verify created board data persists after refresh', async () => {
    await page.reload();

    await expect(page).toHaveURL(/\/boards\/[^/]+$/);
    await expect(page.locator(`[title="${boardName}"]`).first()).toBeVisible();
    await expect(page.locator(`div[title="${listTodo}"]`)).toBeVisible();
    await expect(page.locator(`div[title="${listInProgress}"]`)).toBeVisible();
    await expect(page.locator(`div[title="${listDone}"]`)).toBeVisible();
    await expect(listWrapper(page, listTodo).locator(`div[title="${cardTitle}"]`)).toBeVisible();
  });
});
