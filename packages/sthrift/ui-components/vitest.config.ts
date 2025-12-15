import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStorybookVitestConfig } from '@cellix/vitest-config';
import { defineConfig, mergeConfig } from 'vitest/config';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

const base = createStorybookVitestConfig(dirname, {
	additionalCoverageExclude: [
		'**/index.ts',
		'src/components/molecules/index.tsx',
		'src/components/organisms/index.tsx',
	],
});

// Ensure tests resolve the package name to local source during testing so Vite
// doesn't follow the package "exports" to built `dist/` files.
// This prevents Vite from opening/transpiling dist/src/index.js which causes
// many open files (EMFILE) in CI coverage runs.
export default defineConfig(
	mergeConfig(base, {
		resolve: {
			alias: [
				{
					find: '@sthrift/ui-components',
					replacement: path.join(dirname, 'src'),
				},
			],
		},
	}),
);
