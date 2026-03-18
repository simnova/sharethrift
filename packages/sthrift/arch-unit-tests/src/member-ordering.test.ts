import { describeMemberOrderingTests, type MemberOrderingTestsConfig } from '@cellix/arch-unit-tests';

const config: MemberOrderingTestsConfig = {
  domainSourcePath: '../domain/src',
  persistenceSourcePath: '../persistence/src',
  graphqlSourcePath: '../graphql/src/schema/types',
};

describeMemberOrderingTests(config);
