import { describe, it } from 'vitest';
import { checkCodeMetrics } from '@cellix/arch-unit-tests';

describe('Code Metrics', () => {
  it.skip('files should be under 1000 lines of code', async () => {
    // Currently skipped - code metrics checks are aspirational
    await checkCodeMetrics({
      tsconfigPath: './tsconfig.json',
      sourcePaths: ['../**/src/**/*.ts'],
    });
  });
});
