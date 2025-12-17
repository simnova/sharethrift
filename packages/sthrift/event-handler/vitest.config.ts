import { defineConfig, mergeConfig } from 'vitest/config';
import { nodeConfig } from '@cellix/vitest-config';

export default mergeConfig(
	nodeConfig,
	defineConfig({
		// Add package-specific overrides here if needed
	}),
);
