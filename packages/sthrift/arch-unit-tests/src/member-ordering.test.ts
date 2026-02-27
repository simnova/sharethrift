import { describeMemberOrderingTests } from '@cellix/arch-unit-tests';

describeMemberOrderingTests({
  domainSourcePath: '../domain/src',
  persistenceSourcePath: '../persistence/src',
  graphqlSourcePath: '../graphql/src/schema/types',
});
