import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@cellix/vitest-config';

export default mergeConfig(
	baseConfig,
	defineConfig({
		// Add package-specific overrides here if needed
		test: {
			...baseConfig.test,
			include: ['src/**/*.test.ts', 'tests/integration/**/*.test.ts'],
			retry: 0,
		},
	}),
);
