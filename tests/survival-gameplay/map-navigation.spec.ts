// spec: specs/survival-gameplay.md
// seed: tests/seed.spec.ts
import { expect, test } from "../fixtures/game-state";

test.describe("Map Navigation & Interaction", () => {
	test("Map loads successfully with Leaflet container", async ({
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

		// Verify Leaflet map container is visible
		const mapContainer = page.locator(".leaflet-container");
		await expect(mapContainer).toBeVisible({ timeout: 10000 });

		// Verify zoom controls are present
		const zoomIn = page.locator(".leaflet-control-zoom-in");
		const zoomOut = page.locator(".leaflet-control-zoom-out");
		await expect(zoomIn).toBeVisible();
		await expect(zoomOut).toBeVisible();
	});

	test("Map zoom controls work correctly", async ({ page, gameState }) => {
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

		// Wait for map to load
		await expect(page.locator(".leaflet-container")).toBeVisible({
			timeout: 10000,
		});

		// Get initial zoom level
		const initialZoom = await page.evaluate(() => {
			const map = (window as any).gameMap;
			return map ? map.getZoom() : null;
		});

		// Click zoom in
		const zoomIn = page.locator(".leaflet-control-zoom-in");
		await zoomIn.click({ force: true });
		await page.waitForTimeout(500); // Wait for zoom animation

		// Verify zoom increased
		const newZoom = await page.evaluate(() => {
			const map = (window as any).gameMap;
			return map ? map.getZoom() : null;
		});

		if (initialZoom !== null && newZoom !== null) {
			expect(newZoom).toBeGreaterThan(initialZoom);
		}
	});
});
