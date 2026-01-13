import { expect } from "@playwright/test";
import { test } from "./fixtures/game-state";

test.describe("Exclusão Digital e Resiliência", () => {
	// Override default test with fixture usage
	test("Cenário 1: Navegabilidade Offline (Service Worker)", async ({
		page,
		context,
		gameState, // custom fixture
	}) => {
		// Inject state and reload (at root)
		await gameState.injectGameState();

		// Navigate to game page where HUD is visible
		await page.goto("/jogar");

		// [FIX 3] Wait for game initialization (critical for fixtures)
		await page.waitForSelector('body[data-game-ready="true"]', {
			timeout: 15000,
		});

		// 1. Garante que o mapa carregou
		// Wait for HUD to ensure game is totally loaded
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 15000,
		});

		// 2. Corta a internet
		await context.setOffline(true);

		// 3. Verifica indicador (WifiOff red icon)
		// Use :visible to find the one currently rendered (Mobile or Desktop)
		await expect(page.locator("header svg.text-red-500:visible")).toBeVisible({
			timeout: 10000,
		});

		// 4. Mapa ainda visível
		await expect(page.locator(".leaflet-container")).toBeVisible();
	});

	test("Cenário 2: Bateria Baixa (Bloqueio de Chat)", async ({
		page,
		gameState,
	}) => {
		// Inject state
		await gameState.injectGameState();
		await page.goto("/jogar");

		// [FIX 3] Wait for game initialization (critical for fixtures)
		await page.waitForSelector('body[data-game-ready="true"]', {
			timeout: 15000,
		});

		// 1. Verifica estado inicial (Chat disponível)
		await expect(page.locator('[data-testid="stat-saúde"]')).toBeVisible({
			timeout: 15000,
		});
		await page.waitForTimeout(2000);

		const chatButton = page.locator('button[aria-label="Abrir Chat de Ação"]');
		await expect(chatButton).toBeEnabled();

		// 2. Simula Bateria 0%
		await page.evaluate(() => {
			// biome-ignore lint/suspicious/noExplicitAny: testing/mocking
			(window as any).debugSetBattery(0);
		});

		// 3. Verifica bloqueio
		await expect(page.getByText("Sem bateria")).toBeVisible();
		await expect(
			page.getByText("Você está digitalmente invisível"),
		).toBeVisible();
		await expect(chatButton).toBeDisabled();
	});
});
