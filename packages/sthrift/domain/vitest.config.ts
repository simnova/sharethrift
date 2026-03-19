import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@cellix/vitest-config';

export default mergeConfig(
	nodeConfig,
	defineConfig({
		// Add package-specific overrides here if needed
		test: {
			include: ['src/**/*.test.ts', 'tests/integration/**/*.test.ts'],
			exclude: ['src/arch-unit-tests/**'],
			retry: 0,
			coverage: {
				exclude: ['tests/**', 'src/arch-unit-tests/**'],
			},
		},
	}),
);
