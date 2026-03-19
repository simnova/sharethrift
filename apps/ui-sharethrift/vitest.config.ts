import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStorybookVitestConfig } from '@cellix/vitest-config';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname === 'undefined'
		? path.dirname(fileURLToPath(import.meta.url))
		: __dirname;

// Storybook+Vitest config for ui-sharethrift app
// Arch-unit-tests are run via vitest.arch.config.ts (test:arch script)
export default defineConfig(
	createStorybookVitestConfig(dirname, {
		additionalCoverageExclude: [
			'src/arch-unit-tests/**',
			'**/index.ts',
			'**/index.tsx',
            '**/Index.tsx',
			'src/main.tsx',
			'src/test-utils/**',
            'src/config/**',
            'src/test/**',
			'**/*.d.ts',
			'src/generated/**',
            'eslint.config.js'
		],
		testTimeout: 60000,
		hookTimeout: 60000,
	}),
);
