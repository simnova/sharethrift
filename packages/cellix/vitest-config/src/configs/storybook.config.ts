import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vite';
import { baseConfig } from './base.config.ts';
import { playwright } from '@vitest/browser-playwright';

export type StorybookVitestConfigOptions = {
	storybookDirRelativeToPackage?: string; // default: '.storybook'
	setupFiles?: string[]; // default: ['.storybook/vitest.setup.ts']
	browsers?: { browser: 'chromium' | 'firefox' | 'webkit' }[]; // default: [{ browser: 'chromium' }]
	additionalCoverageExclude?: string[];
};

export function createStorybookVitestConfig(
	pkgDirname: string,
	opts: StorybookVitestConfigOptions = {},
): UserConfig {
	const STORYBOOK_DIR = opts.storybookDirRelativeToPackage ?? '.storybook';
	const setupFiles = opts.setupFiles ?? ['.storybook/vitest.setup.ts'];
	const instances = opts.browsers ?? [{ browser: 'chromium' }];

	const isCI = process.env['TF_BUILD'] === 'True';

	const storybookConfig = defineConfig({
		// Use export conditions to resolve workspace packages to src/ during testing
		resolve: {
			conditions: ['vitest', 'development', 'import', 'default'],
		},
		// Explicitly tell Vite's file watcher to ignore dist and coverage directories
		// This prevents Vite from opening files in these directories during scan/watch
		server: {
			watch: {
				ignored: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
			},
		},
		test: {
			// Prevent Vite/Vitest from scanning/transpiling build artifacts and coverage temp files.
			// This greatly reduces the number of open files during coverage runs in CI.
			exclude: ['**/dist/**', '**/coverage/**', '**/coverage/.tmp/**'],
			globals: true,
			// Retry tests on failure to handle flaky browser tests due to race conditions
			// in @storybook/addon-vitest + Playwright browser provider
			retry: isCI ? 3 : 1,
			testTimeout: isCI ? 30000 : 10000,
			// Serialize file execution in CI to avoid "Vitest failed to find the runner" race condition
			// when using Storybook + Vitest browser mode with Playwright
			// Local development benefits from parallel execution for faster feedback
			fileParallelism: !isCI,
			projects: [
				{
					extends: true,
					plugins: [
						storybookTest({
							configDir: path.join(pkgDirname, STORYBOOK_DIR),
						}),
					],
					test: {
						name: 'storybook',
						browser: {
							enabled: true,
							headless: true,
							provider: playwright(),
							instances,
						},
						setupFiles,
					},
				},
			],
			coverage: {
				exclude: [
					'**/*.config.ts',
					'**/tsconfig.json',
					'**/.storybook/**',
					'**/*.stories.ts',
					'**/*.stories.tsx',
					'**/*.test.ts',
					'**/*.test.tsx',
					'**/generated.ts',
					'**/generated.tsx',
					'**/coverage/**',
					'**/*.d.ts',
					'dist/**',
					...(opts.additionalCoverageExclude ?? []),
				],
			},
			// Enable watch mode in local dev for faster iteration; disable in CI for stability
			watch: !isCI,
			isolate: true,
		},
	});

	return mergeConfig(baseConfig, storybookConfig);
}
