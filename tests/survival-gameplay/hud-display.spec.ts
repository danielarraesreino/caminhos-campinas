// spec: specs/survival-gameplay.md
// seed: tests/seed.spec.ts
import { expect, test } from "../fixtures/game-state";

test.describe("Game Initialization & HUD Display", () => {
	test("HUD elements are visible with correct initial values", async ({
		page,
		gameState,
	}) => {
		// Skip tutorial
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// Navigate to game FIRST
		await page.goto("/jogar");
		await page.waitForURL(/.*\/jogar/);

		// Inject game state
		await gameState.injectGameState({
			avatar: {
				name: "Test Player",
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

		// Verify HUD elements are visible
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 10000,
		});
		await expect(page.locator('[data-testid="stat-mente"]')).toBeVisible();
		await expect(page.locator('[data-testid="stat-caixa"]')).toBeVisible();

		// Verify initial values are displayed
		const healthStat = page.locator('[data-testid="stat-saúde"]');
		const sanityStat = page.locator('[data-testid="stat-mente"]');
		const moneyStat = page.locator('[data-testid="stat-caixa"]');

		// Check that stats contain expected values
		await expect(healthStat).toContainText("100");
		await expect(sanityStat).toContainText("100");
		await expect(moneyStat).toContainText("20");
	});

	test("HUD displays custom stat values accurately", async ({
		page,
		gameState,
	}) => {
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// Navigate to game FIRST
		await page.goto("/jogar");
		await page.waitForURL(/.*\/jogar/);

		// Inject custom values
		await gameState.injectGameState({
			avatar: {
				name: "Test Player",
				gender: "masculino",
				ethnicity: "pardo",
				ageRange: "adulto",
				timeOnStreet: "recente",
				startingSkill: "nenhuma",
				avatarImage: "/avatars/avatar_1.png",
			},
			day: 5,
			time: 14,
			health: 75,
			sanity: 50,
			money: 15,
		});

		// Verify custom values are displayed
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible();
		await expect(page.locator('[data-testid="stat-mente"]')).toBeVisible();
		await expect(page.locator('[data-testid="stat-caixa"]')).toBeVisible();

		const healthStat = page.locator('[data-testid="stat-saúde"]');
		const sanityStat = page.locator('[data-testid="stat-mente"]');
		const moneyStat = page.locator('[data-testid="stat-caixa"]');

		await expect(healthStat).toContainText("75");
		await expect(sanityStat).toContainText("50");
		await expect(moneyStat).toContainText("15");
	});
});
