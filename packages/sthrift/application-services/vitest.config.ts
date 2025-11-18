import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import { baseConfig } from '@cellix/vitest-config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			globals: true,
			environment: 'node',
			include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
			coverage: {
				exclude: [
					'**/*.test.ts',
					'**/*.spec.ts',
					'**/*.d.ts',
					'**/*.config.*',
					'**/node_modules/**',
					'**/dist/**',
					'**/coverage/**',
					'**/index.ts', // Re-export files
				],
			},
		},
	}),
);
