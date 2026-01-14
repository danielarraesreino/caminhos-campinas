import { expect, test } from "../fixtures/game-state";

test.describe("Critical Path: Game Initialization", () => {
	test("should navigate from landing to simulation and load HUD", async ({
		page,
		gameState,
	}) => {
		// [FIX 2] Skip tutorial by setting localStorage BEFORE page loads
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// 1. Landing Page
		await page.goto("/");
		await expect(page).toHaveTitle(/Caminhos Campinas/);

		const startButton = page
			.getByRole("link", { name: /Defrontar|Iniciar|Começar/i })
			.first();
		if (await startButton.isVisible()) {
			await startButton.click();
		} else {
			await page.goto("/jogar");
		}

		// 2. Inject Game State (Bypass Avatar Creation)
		// This fixes the "AuthJS Strict Mode" blocker and flakiness
		await page.waitForURL(/.*\/jogar/);

		await gameState.injectGameState({
			avatar: {
				name: "Testador Fixture",
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

		// 3. Verify HUD
		// Wait for HUD elements to appear
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 10000,
		});
		await expect(page.locator('[data-testid="stat-mente"]')).toBeVisible();
		await expect(page.locator('[data-testid="stat-caixa"]')).toBeVisible();

		// Verify Map is present (Leaflet)
		await expect(page.locator(".leaflet-container")).toBeVisible();

		console.log("✅ Critical Path Passed: HUD Loaded via Fixture Injection");
	});
});
