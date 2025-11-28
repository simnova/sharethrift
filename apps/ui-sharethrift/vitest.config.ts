import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStorybookVitestConfig } from '@cellix/vitest-config';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname === 'undefined'
		? path.dirname(fileURLToPath(import.meta.url))
		: __dirname;

// Storybook+Vitest config for ui-sharethrift app
const storybookConfig = createStorybookVitestConfig(dirname, {
	additionalCoverageExclude: [
		'**/index.ts',
		'**/index.tsx',
		'src/main.tsx',
		'src/test-utils/**',
		'**/*.d.ts',
		'src/generated/**',
	],
});

const disableStorybook =
	process.env.VITEST_DISABLE_STORYBOOK?.toLowerCase() === 'true' ||
	process.env.VITEST_DISABLE_STORYBOOK === '1';

if (disableStorybook && storybookConfig.test) {
	const testConfig = storybookConfig.test as Record<string, unknown>;
	delete testConfig.projects;
	delete testConfig.browser;
}

export default defineConfig(storybookConfig);
