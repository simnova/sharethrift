import { nodeConfig } from '@cellix/vitest-config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(nodeConfig, defineConfig({
  test: {
    globals: true,
    testTimeout: 30000, // 30 seconds for archunit tests that do complex file analysis
  },
}));
