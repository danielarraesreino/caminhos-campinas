import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (WCAG)', () => {
    test('landing page should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('game HUD should be accessible', async ({ page }) => {
        // Navigate to game
        await page.goto('/jogar');

        // If avatar creation is present, fill it securely to get to HUD
        const avatarHeader = page.getByText('Identidade', { exact: false });
        if (await avatarHeader.isVisible()) {
            await page.fill('input[placeholder*="Nome"]', 'A11y Tester');
            await page.click('button[role="combobox"]');
            await page.click('div[role="option"] >> text=Homem Cis');
            await page.click('button:has-text("Confirmar Identidade")');
        }

        // Wait for HUD
        await expect(page.getByRole('status', { name: 'SAÚDE' })).toBeVisible({ timeout: 20000 });

        // Scan HUD
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            // Exclude third-party maps if they cause issues (Leaflet often has specific a11y challenges)
            // .exclude('.leaflet-container') 
            .analyze();

        // Log violations for debugging if any
        if (accessibilityScanResults.violations.length > 0) {
            console.log('A11y Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
        }

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
