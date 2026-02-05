import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	// Run your local dev server before starting the tests
	/*
	webServer: {
		command: "npm run start",
		url: "http://127.0.0.1:3000",
		reuseExistingServer: !process.env.CI,
	},
	*/
	use: {
		baseURL: "http://127.0.0.1:3000",
		trace: "on-first-retry",
		actionTimeout: 15000,
		navigationTimeout: 45000,
	},
	timeout: 60000,
	expect: {
		timeout: 10000,
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
	],
});
