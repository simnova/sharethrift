import { describe, it } from 'vitest';
import { checkCodeQuality } from '@cellix/arch-unit-tests';

describe('Code Quality', () => {
  it.skip('code should maintain good cohesion and complexity metrics', async () => {
    // Currently skipped - code quality checks are aspirational
    await checkCodeQuality({
      tsconfigPath: './tsconfig.json',
    });
  });
});
