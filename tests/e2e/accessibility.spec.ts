import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility (WCAG)", () => {
	test("landing page should not have any automatically detectable accessibility issues", async ({
		page,
	}) => {
		await page.goto("/");

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test("game HUD should be accessible", async ({ page }) => {
		// [FIX 2] Skip tutorial by setting localStorage BEFORE page loads
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// Navigate to game
		await page.goto("/jogar");

		// [FIX 3] Wait for game initialization
		await page.waitForSelector('body[data-game-ready="true"]', {
			timeout: 15000,
		});

		// If avatar creation is present, fill it securely to get to HUD
		const avatarHeader = page.getByText("Identidade", { exact: false });
		if (await avatarHeader.isVisible()) {
			// [FIX] Aguardar formulário de Avatar estar visível
			await expect(page.locator("#avatar-name")).toBeVisible({
				timeout: 10000,
			});

			await page.fill("#avatar-name", "A11y Tester");

			// [FIX] Usar data-testid em vez de role="combobox"
			await page.selectOption(
				'[data-testid="avatar-gender-select"]',
				"masculino",
			);

			await page.click('button:has-text("Próximo Passo")');
		}

		// Wait for HUD
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 20000,
		});

		// Scan HUD
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
			// Exclude third-party maps if they cause issues (Leaflet often has specific a11y challenges)
			// .exclude('.leaflet-container')
			.analyze();

		// Log violations for debugging if any
		if (accessibilityScanResults.violations.length > 0) {
			console.log(
				"A11y Violations:",
				JSON.stringify(accessibilityScanResults.violations, null, 2),
			);
		}

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
