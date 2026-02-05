import { expect, test } from "@playwright/test";

test.describe("Memory Performance Audit", () => {
	test("Game loop heap usage should stay within limits", async ({ page }) => {
		test.setTimeout(120000); // Allow 2 minutes for profiling
		// Debug logging to console
		page.on("console", (msg) => console.log(`[Browser] ${msg.text()}`));

		// 1. Skip tutorial
		await page.addInitScript(() => {
			window.localStorage.setItem("pop_rua_tutorial_seen", "true");
		});

		// 2. Navigate to game
		console.log("Navigating to /jogar...");
		await page.goto("/jogar", { timeout: 60000 });
		console.log("Waiting for HUD...");
		await page.waitForSelector('[data-testid="hud-time"]', { timeout: 60000 });
		console.log("HUD found!");

		// 3. Establish CDP Session (Chrome only)
		const client = await page.context().newCDPSession(page);
		await client.send("Performance.enable");

		// 4. Baseline Measurement
		let metrics = await client.send("Performance.getMetrics");
		let usedHeap = metrics.metrics.find(
			(m) => m.name === "JSHeapUsedSize",
		)?.value;
		const baselineMB = usedHeap ? usedHeap / 1024 / 1024 : 0;
		console.log(`[Memory] Baseline Heap: ${baselineMB.toFixed(2)} MB`);

		expect(baselineMB).toBeLessThan(100); // Initial load budget

		// 5. Simulate Gameplay Activity (Advance time, open modals)
		// Advance time faster
		await page.evaluate(() => {
			// @ts-expect-error - Accessing game context hook if possible or just waiting
			// Since we can't easily access hook, we wait for ticks
		});

		// Wait for 10 seconds of gameplay (approx 1 tick in normal mode, or 1/3 in demo)
		await page.waitForTimeout(10000);

		// Open/Close Inventory (force re-renders)
		const menuBtn = page.getByTitle("Guia de Recursos"); // Using existing button
		if (await menuBtn.isVisible()) {
			await menuBtn.click();
			await page.waitForTimeout(1000);
			// Close it (click outside or toggle)
			await menuBtn.click(); // Assuming toggle
		}

		// Force Garbage Collection (if exposed, usually requires flag.
		// In standard mode we can't force GC, so we measure "active" usage)

		// 6. Post-Activity Measurement
		metrics = await client.send("Performance.getMetrics");
		usedHeap = metrics.metrics.find((m) => m.name === "JSHeapUsedSize")?.value;
		const activeMB = usedHeap ? usedHeap / 1024 / 1024 : 0;
		console.log(`[Memory] Active Heap (10s): ${activeMB.toFixed(2)} MB`);

		// Check for runaway memory (leak detection would require longer run)
		// But for audit, we enforce a strict budget
		expect(activeMB).toBeLessThan(120); // Active gameplay budget
	});
});
