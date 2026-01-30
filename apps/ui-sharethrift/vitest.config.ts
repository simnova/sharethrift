import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStorybookVitestConfig } from '@cellix/vitest-config';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname === 'undefined'
		? path.dirname(fileURLToPath(import.meta.url))
		: __dirname;

// Storybook+Vitest config for ui-sharethrift app
export default defineConfig(
	createStorybookVitestConfig(dirname, {
		additionalCoverageExclude: [
			'**/index.ts',
			'**/index.tsx',
			'**/Index.tsx',
			'src/main.tsx',
			'src/test-utils/**/*.stories.*',
			'src/config/**',
			'src/test/**',
			'**/*.d.ts',
			'src/generated/**',
			'eslint.config.js',
		],
	}),
);
