import { describe, expect, it } from 'vitest';
import { checkMemberOrdering } from '../checks/member-ordering.js';

export function describeMemberOrderingTests(config: { domainSourcePath: string; persistenceSourcePath: string; graphqlSourcePath: string }): void {
  describe('Member Ordering Conventions', () => {
    describe('Domain Layer Classes', () => {
      it('domain classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.domainSourcePath}/**/*.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 10000);

      it('aggregate root classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.domainSourcePath}/contexts/**/*.aggregate.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 10000);

      it('entity classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.domainSourcePath}/contexts/**/*.entity.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 10000);
    });

    describe('Persistence Layer Classes', () => {
      it('persistence classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.persistenceSourcePath}/**/*.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 10000);
    });

    describe('GraphQL Layer Classes', () => {
      it('resolver classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.graphqlSourcePath}/**/*.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 10000);
    });
  });
}
