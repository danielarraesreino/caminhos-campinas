import { test, expect } from '@playwright/test';
test('localStorage error', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    try {
      localStorage.getItem('test');
    } catch (e) {
      console.log("Found error:", e);
    }
  });
});
