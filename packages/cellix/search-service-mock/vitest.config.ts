import { defineConfig, mergeConfig } from 'vitest/config';
import { baseConfig } from '@cellix/vitest-config';

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			coverage: {
				exclude: [
					'node_modules/',
					'dist/',
					'examples/**',
					'**/*.test.ts',
					'**/__tests__/**',
					'**/types/**',
				],
			},
		},
	}),
);
