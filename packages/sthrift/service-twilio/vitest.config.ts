import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@cellix/vitest-config';

export default mergeConfig(
	nodeConfig,
	defineConfig({
		test: {
			// Increase timeout for integration tests with mock server
			testTimeout: 10000,
		},
	}),
);
