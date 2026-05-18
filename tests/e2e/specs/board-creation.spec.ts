import { test, expect } from '../fixtures/test';
import { listWrapper } from '../helpers/boardFixture';

const projectNamePlaceholder = 'Enter project name...';
const boardNamePlaceholder = 'Enter board name...';
const listNamePlaceholder = 'Enter list name...';
const cardNamePlaceholder = 'Enter card name... [Ctrl+Enter] - open';

test('admin user can create project, board, lists, and card that persist after refresh', async ({ adminPage: page, boardData }) => {
  const { projectName, boardName, listTodo, listInProgress, listDone, cardTitle } = boardData;

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
