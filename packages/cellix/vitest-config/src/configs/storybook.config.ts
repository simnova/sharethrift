import path from 'node:path';
import { createRequire } from 'module';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config';
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
): ViteUserConfig {
	const STORYBOOK_DIR = opts.storybookDirRelativeToPackage ?? '.storybook';
	const setupFiles = opts.setupFiles ?? ['.storybook/vitest.setup.ts'];
	const instances = opts.browsers ?? [{ browser: 'chromium' }];

	const isCI =
		process.env['CI'] === 'true' || process.env['TF_BUILD'] === 'True';

	// Build a single alias list for workspace packages that should resolve to
	// their source (`src/`) during tests. This prevents Vite from following
	// package exports into `dist/` and opening built files during coverage runs.
	const aliases: { find: string | RegExp; replacement: string }[] = [];
	const workspacePackagesToAlias = [
		'@sthrift/ui-components',
		'@sthrift/service-mongoose',
		'@sthrift/graphql',
		'@sthrift/domain',
		'@cellix/ui-core',
		'@cellix/messaging-service',
	];
	for (const pkgName of workspacePackagesToAlias) {
		try {
			const require = createRequire(import.meta.url);
			const pkgJsonPath = require.resolve(`${pkgName}/package.json`, {
				paths: [pkgDirname],
			});
			const pkgDir = path.dirname(pkgJsonPath);
			aliases.push({ find: pkgName, replacement: path.join(pkgDir, 'src') });
		} catch (e) {
			// ignore missing packages
		}
	}

	const storybookConfig = defineConfig({
		test: {
			// Prevent Vite/Vitest from scanning/transpiling build artifacts and coverage temp files.
			// This greatly reduces the number of open files during coverage runs in CI.
			exclude: ['dist/**', 'coverage/**', 'coverage/.tmp/**'],
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
			// Disable watch mode and isolate tests to reduce file watchers and improve stability.
			watch: false,
			isolate: true,
		},
		resolve: {
			alias: aliases,
		},
	});

	return mergeConfig(baseConfig, storybookConfig);
}
