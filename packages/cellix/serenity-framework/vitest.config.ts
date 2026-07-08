import { nodeConfig } from '@cellix/vitest-config';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(nodeConfig, {
	test: {
		exclude: ['dist/**', 'node_modules/**'],
	},
});
