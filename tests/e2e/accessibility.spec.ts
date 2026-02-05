import { test } from "./fixtures";

const routes = [
	"/",
	"/jogar",
	"/impacto",
	"/jornal",
	"/transparencia",
	"/auditoria",
	"/auditoria/validar",
	"/sobre",
	"/sobre/demo-mode",
	"/curso",
	"/apoie",
	"/login",
	"/parceiros",
	"/parcerias",
	"/sugerir",
	"/recursos",
];

test.describe("Accessibility Audit (WCAG AA)", () => {
	for (const route of routes) {
		test(`Route ${route} should have no violations`, async ({
			checkAccessibility,
		}) => {
			await checkAccessibility(route);
		});
	}
});
