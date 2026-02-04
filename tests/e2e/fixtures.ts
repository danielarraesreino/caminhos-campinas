import { test as base, type Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Define the type for our custom fixtures
type MyFixtures = {
	page: Page;
	checkAccessibility: (path: string) => Promise<void>;
};

export const test = base.extend<MyFixtures>({
	page: async ({ page }, use) => {
		// 1. Strict Console Error Monitoring
		page.on("console", (msg) => {
			if (msg.type() === "error") {
				const text = msg.text();
				if (text.includes("404 (Not Found)")) return;
				if (text.includes("GeolocationPositionError")) return;
				if (text.includes("SpeechSynthesis Error")) {
					throw new Error(`🛑 CRITICAL AUDIO FAILURE: "${text}"`);
				}

				throw new Error(
					`🛑 STRICT TEST FAILED: Console Error Detected: "${text}"`,
				);
			}
		});

		// 2. Strict Uncaught Exception Monitoring
		page.on("pageerror", (err) => {
			throw new Error(
				`🛑 STRICT TEST FAILED: Uncaught Exception: "${err.message}"`,
			);
		});

		await use(page);
	},
	checkAccessibility: async ({ page }, use) => {
		const check = async (path: string) => {
			await page.goto(path);
			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
				.analyze();
			expect(accessibilityScanResults.violations).toEqual([]);
		};
		await use(check);
	},
});

export { expect } from "@playwright/test";
