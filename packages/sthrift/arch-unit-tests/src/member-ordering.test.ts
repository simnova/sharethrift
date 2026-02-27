import { describe, expect, it } from 'vitest';
import { checkMemberOrdering } from '@cellix/arch-unit-tests';

describe('Member Ordering', () => {
  it('domain classes should follow member ordering convention', async () => {
    const violations = await checkMemberOrdering({
      sourceGlobs: ['../domain/src/**/*.ts'],
    });
    expect(violations).toStrictEqual([]);
  }, 10000);
});
