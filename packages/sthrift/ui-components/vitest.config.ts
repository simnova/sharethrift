import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStorybookVitestConfig } from '@cellix/vitest-config';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
	createStorybookVitestConfig(dirname, {
		additionalCoverageExclude: [
			'**/index.ts',
			'src/components/molecules/index.tsx',
			'src/components/organisms/index.tsx',
		],
	}),
);
