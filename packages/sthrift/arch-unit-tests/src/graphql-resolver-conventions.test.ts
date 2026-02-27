import { describe, expect, it } from 'vitest';
import {
  checkGraphqlResolverDependencies,
  checkGraphqlResolverContent,
} from '@cellix/arch-unit-tests';

const RESOLVERS_GLOB = '../graphql/src/schema/types/**';

describe('GraphQL Resolver Conventions', () => {
  describe('Dependency Rules', () => {
    it('resolver files should not import domain entities directly', async () => {
      const violations = await checkGraphqlResolverDependencies({
        resolversGlob: RESOLVERS_GLOB,
        entityFilesPattern: '../domain/src/domain/contexts/**/*.entity.ts',
      });
      expect(violations).toStrictEqual([]);
    });

    it('resolver files should not import repositories directly', async () => {
      const violations = await checkGraphqlResolverDependencies({
        resolversGlob: RESOLVERS_GLOB,
        repositoryFilesPattern: '../domain/src/domain/contexts/**/*.repository.ts',
      });
      expect(violations).toStrictEqual([]);
    });

    it('resolver files should not import Unit of Work classes directly', async () => {
      const violations = await checkGraphqlResolverDependencies({
        resolversGlob: RESOLVERS_GLOB,
        uowFilesPattern: '../domain/src/domain/contexts/**/*.uow.ts',
      });
      expect(violations).toStrictEqual([]);
    });

    it('resolver files should not import infrastructure services directly', async () => {
      const violations = await checkGraphqlResolverDependencies({
        resolversGlob: RESOLVERS_GLOB,
        infrastructureServicesPattern: '../../cellix/service-*/**',
      });
      expect(violations).toStrictEqual([]);
    });

    it('resolver files should not import persistence layer directly', async () => {
      const violations = await checkGraphqlResolverDependencies({
        resolversGlob: RESOLVERS_GLOB,
        persistenceFolder: '../persistence/**',
      });
      expect(violations).toStrictEqual([]);
    });
  });

  describe('Content Patterns', () => {
    it('resolver files must export a default object', async () => {
      const violations = await checkGraphqlResolverContent({
        resolversGlob: RESOLVERS_GLOB,
      });
      expect(violations.filter((v) => v.includes('default'))).toStrictEqual([]);
    });

    it('resolver files should not define extra interfaces, types, classes, or enums', async () => {
      const violations = await checkGraphqlResolverContent({
        resolversGlob: RESOLVERS_GLOB,
      });
      expect(violations.filter((v) => v.includes('disallowed'))).toStrictEqual([]);
    });

    it('resolver objects should be typed as Resolvers', async () => {
      const violations = await checkGraphqlResolverContent({
        resolversGlob: RESOLVERS_GLOB,
      });
      expect(violations.filter((v) => v.includes('Resolvers'))).toStrictEqual([]);
    });

    it('resolver context parameter must be typed as GraphContext', async () => {
      const violations = await checkGraphqlResolverContent({
        resolversGlob: RESOLVERS_GLOB,
      });
      expect(violations.filter((v) => v.includes('GraphContext'))).toStrictEqual([]);
    });

    it('resolver functions should be declared as async', async () => {
      const violations = await checkGraphqlResolverContent({
        resolversGlob: RESOLVERS_GLOB,
      });
      expect(violations.filter((v) => v.includes('async'))).toStrictEqual([]);
    });
  });
});
