import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		// Matches archConfig in @cellix/vitest-config; arch checks scan the filesystem and exceed 5s under parallel load
		testTimeout: 30000,
	},
});
