import { expect, Page } from '@playwright/test';

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.locator("input[name='emailOrUsername']").fill('demo');
  await page.locator("input[name='password']").fill('demo');
  await page.locator("button[title='Log in']").click();

  await expect(page).toHaveURL('/');
  await expect(page.locator("div[title='Dashboard']")).toBeVisible({ timeout: 15000 });
}
