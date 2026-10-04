import { test, expect } from '@playwright/test';

test.describe('Personalization Features', () => {
  test('Tune My Feed settings persist', async ({ page }) => {
    await page.goto('/');
    
    // Open Settings view
    await page.click('button:has-text("Settings")');
    await expect(page.locator('h1', { hasText: 'Settings' })).toBeVisible();

    // Toggle 'AI' and 'Gaming' categories
    await page.click('button:has-text("AI")');
    await page.click('button:has-text("Gaming")');

    // Verify they have aria-pressed="true"
    const aiBtn = page.locator('button:has-text("AI")');
    await expect(aiBtn).toHaveAttribute('aria-pressed', 'true');
    const gamingBtn = page.locator('button:has-text("Gaming")');
    await expect(gamingBtn).toHaveAttribute('aria-pressed', 'true');

    // Reload page to ensure persistence
    await page.reload();
    await page.click('button:has-text("Settings")');

    await expect(page.locator('button:has-text("AI")')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('button:has-text("Gaming")')).toHaveAttribute('aria-pressed', 'true');
  });

  test('Read Later saves and displays items', async ({ page }) => {
    await page.goto('/');

    // Go to feed
    await page.click('button:has-text("Personalized Feed")');

    // Find the first read later button and click it
    const readLaterBtn = page.locator('button[aria-label="Read later"]').first();
    await readLaterBtn.click();
    await expect(readLaterBtn).toHaveAttribute('aria-pressed', 'true');

    // Go to Read Later view
    await page.click('button:has-text("Read Later")');
    await expect(page.locator('h1', { hasText: 'Read Later' })).toBeVisible();

    // Verify there is at least one item
    const articles = page.locator('article');
    await expect(articles).toHaveCount(1);
  });
});
