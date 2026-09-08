import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
	test('home page loads', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('body')).toBeVisible();
	});

	test('learning collection loads', async ({ page }) => {
		await page.goto('/learning');
		await expect(page.locator('body')).toBeVisible();
	});

	test('articles collection loads', async ({ page }) => {
		await page.goto('/articles');
		await expect(page.locator('body')).toBeVisible();
	});

	test('practice collection loads', async ({ page }) => {
		await page.goto('/practice');
		await expect(page.locator('body')).toBeVisible();
	});

	test('profile page loads', async ({ page }) => {
		await page.goto('/profile');
		await expect(page.locator('body')).toBeVisible();
	});
});
