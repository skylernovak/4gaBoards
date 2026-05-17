import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';

test('admin user logs in successfully', async ({ page }) => {
  await page.goto('/login');
  await loginAsAdmin(page);

  await expect(page).toHaveURL('/');
  await expect(page.locator("div[title='Dashboard']")).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/invalid|incorrect/i)).toHaveCount(0);
});
