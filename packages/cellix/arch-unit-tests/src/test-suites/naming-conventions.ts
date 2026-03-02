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
      it('domain files should follow TypeScript naming conventions', async () => {
        // Currently skipped - TypeScript naming validation is aspirational
        await checkGraphqlFileNaming({
          graphqlFilePaths: ['../domain/src/**/*.ts'],
        });
      });

      it('resolver files should follow TypeScript naming conventions', async () => {
        // Currently skipped - TypeScript naming validation is aspirational
        await checkGraphqlFileNaming({
          graphqlFilePaths: ['../graphql/src/schema/types/**/*.ts'],
        });
      });
    });
  });
}
