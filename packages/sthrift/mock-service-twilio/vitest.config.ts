import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@cellix/vitest-config';

export default mergeConfig(
	nodeConfig,
	defineConfig({
		test: {
			testTimeout: 10000,
		},
	}),
);
