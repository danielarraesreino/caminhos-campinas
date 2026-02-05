import { expect, test } from "./fixtures/game-state";

/**
 * Seed Test for Playwright Test Agents
 *
 * This test sets up the Caminhos Campinas game environment for all agent-generated tests.
 * It handles:
 * - Tutorial skip via localStorage
 * - Game state injection to bypass avatar creation
 * - Basic environment verification
 *
 * The Planner agent will use this as a starting point to explore the app.
 * The Generator agent will use this as a template for all generated tests.
 *
 * Note: We skip the landing page to avoid AuthJS console errors in strict mode.
 * The gameState fixture already navigates to "/" to initialize the context.
 */
test("seed", async ({ page, gameState }) => {
	// Skip tutorial by setting localStorage BEFORE page loads
	await page.addInitScript(() => {
		window.localStorage.setItem("pop_rua_tutorial_seen", "true");
	});

	// Navigate directly to game (gameState fixture already loaded "/" for context)
	await page.goto("/jogar");
	await page.waitForURL(/.*\/jogar/);

	// Inject game state to bypass avatar creation
	// This allows agents to test gameplay directly
	await gameState.injectGameState({
		avatar: {
			name: "Agente Teste",
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

	// Verify game environment is ready
	await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
		timeout: 10000,
	});
	await expect(page.locator('[data-testid="stat-mente"]')).toBeVisible();
	await expect(page.locator('[data-testid="stat-caixa"]')).toBeVisible();

	// Verify map is present
	await expect(page.locator(".leaflet-container")).toBeVisible();

	console.log(
		"✅ Seed Test Passed: Game environment ready for agent exploration",
	);
});
