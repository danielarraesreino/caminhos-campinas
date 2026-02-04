import { test } from "./fixtures";

test.describe("Accessibility Audit (WCAG AA)", () => {
	test("Landing Page should have no violations", async ({ checkAccessibility }) => {
		await checkAccessibility("/");
	});

	test("Game Page should have no violations", async ({ checkAccessibility }) => {
		await checkAccessibility("/jogar");
	});

	test("Impact Dashboard should have no violations", async ({ checkAccessibility }) => {
		await checkAccessibility("/impacto");
	});

	test("News (Jornal) should have no violations", async ({ checkAccessibility }) => {
		await checkAccessibility("/jornal");
	});
});
