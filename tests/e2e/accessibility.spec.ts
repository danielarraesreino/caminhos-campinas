import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../fixtures/game-state";

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

	test("game HUD should be accessible", async ({ page, gameState }) => {
		// [FIX 2] Skip tutorial by setting localStorage BEFORE page loads
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// Navigate to game
		await page.goto("/jogar");

		// [FIX 3] Inject Game State (Bypass Avatar Creation)
		await page.waitForURL(/.*\/jogar/);

		await gameState.injectGameState({
			avatar: {
				name: "A11y Tester",
				gender: "masculino",
				ethnicity: "pardo",
				ageRange: "adulto",
				timeOnStreet: "recente",
				startingSkill: "nenhuma",
				avatarImage: "/avatars/avatar_1.png",
			},
			day: 1,
			time: 8,
			health: 100,
			sanity: 100,
			money: 20,
		});

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
