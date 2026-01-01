import { expect, test } from "@playwright/test";

test.describe("Exclusão Digital e Resiliência", () => {
	test.beforeEach(async ({ page }) => {
		// Acessa o jogo
		await page.goto("/jogar");

		// Flow: Avatar Creation (if present)
		const avatarHeader = page.getByText("Quem é você nesta jornada?");
		if (await avatarHeader.isVisible({ timeout: 5000 })) {
			// Step 1: Name & Demographics
			await page.locator("#avatar-name").fill("Tester Playwright");
			await page
				.locator('select[title="Selecione o gênero"]')
				.selectOption("masculino");
			await page
				.locator('select[title="Selecione a faixa etária"]')
				.selectOption("adulto");
			await page.getByRole("button", { name: "Próximo Passo" }).click();

			// Step 2: Avatar Image (Select first option)
			// Code defaults to avatar_1. So just click Next.
			await page.getByRole("button", { name: "Próximo Passo" }).click();

			// Step 3: Ethnicity
			// Code has buttons with text "branco", "preto", etc.
			await page
				.getByRole("button", { name: "preto", exact: false })
				.first()
				.click();
			// Step 3 has no internal transition, so we click Next
			await page.getByRole("button", { name: "Próximo Passo" }).click();

			// Step 4: Time on Street
			await page.getByRole("button", { name: "Recém-chegado" }).click();
			// Click Next
			await page.getByRole("button", { name: "Próximo Passo" }).click();

			// Step 5: Review
			// Button changes to "Iniciar Jornada"
			await page.getByRole("button", { name: "Iniciar Jornada" }).click();

			// Wait for transition (resetGame + delay)
			await page.waitForTimeout(2000);
		}

		// Flow: Tutorial (if present)
		const tutorialHeader = page.getByText("Bem-vindo às Ruas");
		if (await tutorialHeader.isVisible({ timeout: 5000 })) {
			await page.locator('button[aria-label="Fechar tutorial"]').click();
		}
	});

	test("Cenário 1: Navegabilidade Offline (Service Worker)", async ({
		page,
		context,
	}) => {
		// 1. Garante que o mapa carregou
		await expect(page.locator(".leaflet-container")).toBeVisible({
			timeout: 10000,
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

	test("Cenário 2: Bateria Baixa (Bloqueio de Chat)", async ({ page }) => {
		// 1. Verifica estado inicial (Chat disponível)
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
