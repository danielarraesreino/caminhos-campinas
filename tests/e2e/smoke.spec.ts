import { expect, test } from "./fixtures";

test.describe("Sanity Check (Smoke Tests)", () => {
	test("Landing Page loads without errors", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Caminhos/);
	});

	test("Hub Page loads without errors", async ({ page }) => {
		await page.goto("/hub");
		await expect(page.getByRole("heading", { name: /Hub/i })).toBeVisible();
	});

	test("Impact Dashboard loads without errors", async ({ page }) => {
		await page.goto("/impacto");
		await expect(
			page.locator('h1:has-text("Painel de Inteligência Social")'),
		).toBeVisible();
	});

	test("Game Interface loads without errors", async ({ page }) => {
		await page.goto("/jogar");
		// [FIX 3] Wait for game initialization
		await page.waitForSelector('body[data-game-ready="true"]', {
			timeout: 15000,
		});
		// Wait for hydration and basic UI. Use exact heading to avoid header/link ambiguity
		await expect(
			page.getByRole("heading", { name: "Caminhos Campinas", exact: true }),
		).toBeVisible();
	});
});
