import { test, expect } from '@playwright/test';

test.describe('Dashboard (requires auth)', () => {
  test('dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login|register/, { timeout: 10000 });
  });

  test('scanner page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/scanner');
    await expect(page).toHaveURL(/login|register/, { timeout: 10000 });
  });

  test('documents page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/documents');
    await expect(page).toHaveURL(/login|register/, { timeout: 10000 });
  });

  test('settings page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/login|register/, { timeout: 10000 });
  });

  test('monitoring page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/monitoring');
    await expect(page).toHaveURL(/login|register/, { timeout: 10000 });
  });
});
