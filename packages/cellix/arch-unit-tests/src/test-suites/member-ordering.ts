import { describe, expect, it } from 'vitest';
import { checkMemberOrdering } from '../checks/member-ordering.js';

export interface MemberOrderingTestsConfig {
  domainSourcePath: string;
  persistenceSourcePath: string;
  graphqlSourcePath: string;
  fixturesSourcePath?: string;
}

export function describeMemberOrderingTests(config: MemberOrderingTestsConfig): void {
  describe('Member Ordering Conventions', () => {
    describe('Domain Layer Classes', () => {
      it('domain classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.domainSourcePath}/**/*.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 30000);

      it('aggregate root classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.domainSourcePath}/contexts/**/*.aggregate.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 30000);

      it('entity classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.domainSourcePath}/contexts/**/*.entity.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 30000);
    });

    describe('Persistence Layer Classes', () => {
      it('persistence classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.persistenceSourcePath}/**/*.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 30000);
    });

    describe('GraphQL Layer Classes', () => {
      it('resolver classes should follow member ordering convention', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [`${config.graphqlSourcePath}/**/*.ts`],
        });
        expect(violations).toStrictEqual([]);
      }, 30000);
    });

    describe('member-ordering rule semantics', () => {
      // Note: These tests use fixture files to directly validate the member-ordering rule semantics.
      // The fixtures are located in the arch-unit-tests package and serve as unit tests for
      // the rule itself, separate from production code validation.

      it('allows mixing instance methods and accessors within the same instance-member group', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [
            '../../cellix/arch-unit-tests/src/fixtures/member-ordering/instance-mixed-ok.ts',
          ],
        });

        // The relaxed rule should not report any violations for the mixed instance members.
        expect(violations).toStrictEqual([]);
      });

      it('still enforces grouping of static vs instance members', async () => {
        const violations = await checkMemberOrdering({
          sourceGlobs: [
            '../../cellix/arch-unit-tests/src/fixtures/member-ordering/static-instance-misordered.ts',
          ],
        });

        // Misordered static vs instance members should still produce at least one violation.
        expect(violations.length).toBeGreaterThan(0);
      });
    });
  });
}
