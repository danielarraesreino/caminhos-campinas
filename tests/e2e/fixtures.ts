import { test as base, type Page } from '@playwright/test';

export const test = base.extend<{ page: Page }>({
    page: async ({ page }, use) => {
        // 1. Strict Console Error Monitoring
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Allow some noisy but harmless errors if absolutely necessary (list exceptions here)
                if (text.includes('404 (Not Found)')) return; // Ignore missing assets for now

                // For now: Zero Tolerance for JS errors.
                throw new Error(`🛑 STRICT TEST FAILED: Console Error Detected: "${text}"`);
            }
        });

        // 2. Strict Uncaught Exception Monitoring
        page.on('pageerror', err => {
            throw new Error(`🛑 STRICT TEST FAILED: Uncaught Exception: "${err.message}"`);
        });

        await use(page);
    },
});

export { expect } from '@playwright/test';
