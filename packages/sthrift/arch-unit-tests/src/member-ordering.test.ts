import { describeMemberOrderingTests, type MemberOrderingTestsConfig } from '@cellix/arch-unit-tests/general';

const config: MemberOrderingTestsConfig = {
  domainSourcePath: '../domain/src',
  persistenceSourcePath: '../persistence/src',
  graphqlSourcePath: '../graphql/src/schema/types',
  memberOrderingTimeoutMs: 120000,
};

describeMemberOrderingTests(config);
