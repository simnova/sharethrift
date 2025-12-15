import path from 'node:path';
import { createRequire } from 'module';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';
import type { Plugin, UserConfig } from 'vite';
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

	const isCI =
		process.env['CI'] === 'true' || process.env['TF_BUILD'] === 'True';

	// Build a map of workspace packages to their src directories
	// This prevents Vite from following package exports into `dist/` during tests
	const workspacePackagesToAlias = [
		'@sthrift/ui-components',
		'@sthrift/service-mongoose',
		'@sthrift/graphql',
		'@sthrift/domain',
		'@cellix/ui-core',
		'@cellix/messaging-service',
		'@sthrift/ui-sharethrift',
	];
	const packageSrcMap = new Map<string, string>();
	for (const pkgName of workspacePackagesToAlias) {
		try {
			const require = createRequire(import.meta.url);
			const pkgJsonPath = require.resolve(`${pkgName}/package.json`, {
				paths: [pkgDirname],
			});
			const pkgDir = path.dirname(pkgJsonPath);
			const pkgSrcDir = path.join(pkgDir, 'src');
			packageSrcMap.set(pkgName, pkgSrcDir);
		} catch (e) {
			// ignore missing packages
		}
	}

	// Create a custom plugin to intercept and redirect workspace package imports
	// This runs before Vite's alias resolution and prevents opening dist/ files
	const workspaceRedirectPlugin: Plugin = {
		name: 'workspace-redirect-to-src',
		enforce: 'pre', // Run before other plugins
		resolveId(id) {
			// Check if this is a workspace package import
			for (const [pkgName, srcDir] of packageSrcMap.entries()) {
				if (id === pkgName) {
					// Exact package import: @sthrift/ui-components
					return path.join(srcDir, 'index.ts');
				}
				if (id.startsWith(`${pkgName}/`)) {
					// Subpath import: @sthrift/ui-components/src/styles/theme.css
					const subpath = id.substring(pkgName.length + 1);
					return path.join(srcDir, subpath);
				}
			}
			return null; // Let Vite handle other imports
		},
	};

	const storybookConfig = defineConfig({
		plugins: [workspaceRedirectPlugin],
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
						workspaceRedirectPlugin,
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
	});

	return mergeConfig(baseConfig, storybookConfig);
}
