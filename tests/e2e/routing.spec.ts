import { expect, test } from "./fixtures"; // Use strict fixture

test.describe("Routing Health Check", () => {
	const routes = [
		"/",
		"/jogar",
		"/impacto",
		"/recursos",
		// '/sobre' // If it exists
	];

	for (const route of routes) {
		test(`should load ${route} without console errors or crash`, async ({
			page,
		}) => {
			console.log(`Testing route: ${route}`);
			await page.goto(route);

			// Basic sanity check: Page loaded
			// We check for some common element like 'main', 'header', or just not empty body
			await expect(page.locator("body")).toBeVisible();

			// Check title is not empty (a sign of successful React hydration usually)
			const title = await page.title();
			expect(title.length).toBeGreaterThan(0);

			// Wait a bit to catch delayed runtime errors (like useEffects)
			await page.waitForTimeout(1000);

			console.log(`✅ ${route} PASSED pure render check`);
		});
	}
});
