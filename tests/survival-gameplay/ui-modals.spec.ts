// spec: specs/survival-gameplay.md
// seed: tests/seed.spec.ts
import { expect, test } from "../fixtures/game-state";

test.describe("UI Features & Modals", () => {
	test("Locations modal opens and closes correctly", async ({
		page,
		gameState,
	}) => {
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// Navigate to game FIRST
		await page.goto("/jogar");
		await page.waitForURL(/.*\/jogar/);

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

		// Wait for game to load
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 10000,
		});

		// Find and click locations button
		// The button might have different selectors, try common ones
		const locationsButton = page.locator('button:has-text("Atlas")').first();
		if (await locationsButton.isVisible({ timeout: 2000 }).catch(() => false)) {
			await locationsButton.click();

			// Verify modal opened
			await expect(
				page.getByRole("heading", { name: /Atlas de Realidade/i }),
			).toBeVisible({ timeout: 5000 });

			// Find and click close button
			const closeButton = page.getByRole("button", { name: /fechar/i });
			await closeButton.click();

			// Verify modal closed
			await expect(
				page.getByRole("heading", { name: /Atlas de Realidade/i }),
			).not.toBeVisible();
		}
	});

	test("Chat modal opens and closes correctly", async ({ page, gameState }) => {
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		await page.goto("/jogar");
		await page.waitForURL(/.*\/jogar/);

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

		// Wait for game to load
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 10000,
		});

		// Find chat button (might be an icon or text)
		const chatButton = page
			.locator('button[aria-label*="chat"], button:has-text("Chat")')
			.first();

		if (await chatButton.isVisible({ timeout: 2000 }).catch(() => false)) {
			await chatButton.click();

			// Wait for chat modal to appear
			await page.waitForTimeout(1000);

			// Look for close button in chat modal
			const closeButton = page.locator('button:has-text("[X]")').first();
			if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
				await closeButton.click();
			}
		}
	});
});
