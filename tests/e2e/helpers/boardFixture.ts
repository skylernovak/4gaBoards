import { expect, Page } from '@playwright/test';
import { loginAsAdmin } from './auth';

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

export function listWrapper(page: Page, listName: string) {
  return page.locator(`xpath=//div[@title=${xpathLiteral(listName)}]/ancestor::div[contains(@class, 'List_outerWrapper')][1]`);
}

export async function createBoardFixtureOnAuthenticatedPage(
  page: Page,
  projectName: string,
  boardName: string,
  listTodo: string,
  listInProgress: string,
  listDone: string,
  cardTitle: string,
): Promise<void> {
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

export async function createBoardFixture(
  page: Page,
  projectName: string,
  boardName: string,
  listTodo: string,
  listInProgress: string,
  listDone: string,
  cardTitle: string,
): Promise<void> {
  await page.goto('/login');
  await loginAsAdmin(page);

  await createBoardFixtureOnAuthenticatedPage(page, projectName, boardName, listTodo, listInProgress, listDone, cardTitle);
}
