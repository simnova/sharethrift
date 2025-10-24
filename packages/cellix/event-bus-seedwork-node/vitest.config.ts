import { nodeConfig } from '@cellix/vitest-config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
	nodeConfig,
	defineConfig({
		test: {
			coverage: {
				exclude: ['**/index.ts'],
			},
		},
	}),
);
