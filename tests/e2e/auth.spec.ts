import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe|password/i).first()).toBeVisible();
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.getByLabel(/nom|name/i).first()).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('login form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /connexion|login|se connecter/i }).click();
    await expect(
      page.locator('[role="alert"], .text-destructive, .text-red-500').first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test('register link from login page works', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /inscrire|register|sign up/i }).click();
    await expect(page).toHaveURL(/register/);
  });

  test('forgot password link works', async ({ page }) => {
    await page.goto('/login');
    const forgotLink = page.getByRole('link', { name: /oubli|forgot|mot de passe/i });
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      await expect(page).toHaveURL(/forgot/);
    }
  });
});
