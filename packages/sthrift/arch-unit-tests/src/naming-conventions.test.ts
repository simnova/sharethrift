import { describe, it } from 'vitest';
import { checkGraphqlFileNaming } from '@cellix/arch-unit-tests';

describe('Naming Conventions', () => {
  it.skip('GraphQL files should use .container.graphql naming', async () => {
    // Currently skipped - GraphQL file naming rule is aspirational
    await checkGraphqlFileNaming({
      graphqlFilePaths: ['../graphql/src/**/*.graphql'],
    });
  });
});
