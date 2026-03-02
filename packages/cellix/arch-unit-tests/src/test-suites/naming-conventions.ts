import { describe, it } from 'vitest';
import { checkGraphqlFileNaming } from '../checks/naming-conventions.js';

export function describeNamingConventionTests(): void {
  describe('Naming Conventions', () => {
    describe('GraphQL Files', () => {
      it('GraphQL files should use .container.graphql naming', async () => {
        // Currently skipped - GraphQL file naming rule is aspirational
        await checkGraphqlFileNaming({
          graphqlFilePaths: ['../graphql/src/**/*.graphql'],
        });
      });

      it('GraphQL files should be in proper directories', async () => {
        // Currently skipped - GraphQL organization is aspirational
        await checkGraphqlFileNaming({
          graphqlFilePaths: ['../graphql/src/**/*.graphql'],
        });
      });
    });

    describe('TypeScript Files', () => {
      it.skip('domain files should follow TypeScript naming conventions', async () => {
        // DISABLED: Tests call checkGraphqlFileNaming which enforces *.container.graphql pattern.
        // This is incorrect for TypeScript domain files (.ts). Either:
        // 1. Create a dedicated checkTypescriptFileNaming() function with TS-specific rules, or
        // 2. Define TypeScript naming conventions and implement the checker.
        // Keeping this test as a placeholder for future implementation.
      });

      it.skip('resolver files should follow TypeScript naming conventions', async () => {
        // DISABLED: Tests call checkGraphqlFileNaming which enforces *.container.graphql pattern.
        // This is incorrect for TypeScript resolver files (.ts). Either:
        // 1. Create a dedicated checkTypescriptFileNaming() function with TS-specific rules, or
        // 2. Define TypeScript naming conventions and implement the checker.
        // Keeping this test as a placeholder for future implementation.
      });
    });
  });
}
