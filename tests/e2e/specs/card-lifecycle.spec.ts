import { test, expect } from '../fixtures/test';
import { listWrapper } from '../helpers/boardFixture';
import { uniqueName } from '../helpers/testData';

const editCardNamePlaceholder = 'Enter card name...';
const descriptionPlaceholder = 'Enter description...';
const descriptionText = 'This card was created by Playwright to validate card detail persistence.';

test('admin user can open, edit, move, and delete a card', async ({ adminPage: page, boardWithCard }) => {
  const { listTodo, listInProgress, cardTitle } = boardWithCard;
  const updatedCardTitle = uniqueName('Validate user authentication flow');

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
