import { expect, test } from '../fixtures/test';

test('admin user logs in successfully', async ({ adminPage }) => {
  await expect(adminPage).toHaveURL('/');
  await expect(adminPage.locator("div[title='Dashboard']")).toBeVisible({ timeout: 15000 });
  await expect(adminPage.getByText(/invalid|incorrect/i)).toHaveCount(0);
});
