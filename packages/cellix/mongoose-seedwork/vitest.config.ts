import { nodeConfig } from '@cellix/vitest-config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
	nodeConfig,
	defineConfig({
		// Add package-specific overrides here if needed
		test: {
			include: ['src/**/*.test.ts'],
			exclude: ['tests/integration/**/*.test.ts'],
			retry: 0,
			testTimeout: 30000, // Increase timeout for integration tests
			coverage: {
				exclude: ['**/index.ts', '**/base.ts'],
			},
		},
	}),
);
