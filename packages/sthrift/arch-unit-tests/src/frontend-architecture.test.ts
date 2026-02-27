import { describe, expect, it } from 'vitest';
import { checkFrontendArchitecture } from '@cellix/arch-unit-tests';

describe('Frontend Architecture - UI ShareThrift', () => {
  it('should pass frontend architecture checks', () => {
    const violations = checkFrontendArchitecture({
      uiSourcePath: '../../apps/ui-sharethrift/src',
    });
    expect(violations).toStrictEqual([]);
  });
});
