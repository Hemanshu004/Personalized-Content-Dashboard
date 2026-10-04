import { test, expect } from '@playwright/test';

test.describe('Image Fallback', () => {
  test('Fallback image renders when image is broken', async ({ page }) => {
    // Intercept image requests and force them to fail to trigger fallback
    await page.route('**/*.jpg', route => route.abort());
    await page.route('**/*.png', route => route.abort());
    await page.route('**/*.webp', route => route.abort());

    await page.goto('/');
    
    // Go to feed
    await page.click('button:has-text("Personalized Feed")');

    // Wait for the feed to load
    await page.waitForSelector('article');

    // Verify the fallback component is visible ("No image available" text or specific aria-label)
    const fallbacks = page.locator('[aria-label="No image available"]');
    await expect(fallbacks.first()).toBeVisible();
  });
});
