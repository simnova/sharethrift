import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const UI_APP_PATH = path.resolve(__dirname, '../../apps/ui-sharethrift');
const UI_PORT = 3000;

/**
 * Playwright configuration for DOM-level Serenity/JS tests.
 * 
 * This config enables SELF-CONTAINED testing:
 * - Automatically starts the UI dev server before tests
 * - Waits for it to be ready
 * - Cleans up after tests complete
 * 
 * No manual steps required - just run `pnpm test:dom`!
 */
export default defineConfig({
	testDir: './features',
	fullyParallel: false, // Run scenarios sequentially for Cucumber
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1, // Cucumber runs scenarios sequentially
	reporter: 'list',
	
	use: {
		baseURL: `http://localhost:${UI_PORT}`,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},

	/**
	 * AUTO-START UI DEV SERVER
	 * 
	 * Playwright will:
	 * 1. Run `pnpm start` in apps/ui-sharethrift
	 * 2. Wait for localhost:3000 to respond
	 * 3. Then start running tests
	 * 4. Kill the server when tests finish
	 */
	webServer: {
		command: 'pnpm start',
		cwd: UI_APP_PATH,
		url: `http://localhost:${UI_PORT}`,
		timeout: 120_000, // 2 minutes for initial build
		reuseExistingServer: !process.env.CI,
		stdout: 'pipe',
		stderr: 'pipe',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
