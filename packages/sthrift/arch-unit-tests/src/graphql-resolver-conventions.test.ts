import { describeGraphqlResolverConventionsTests } from '@cellix/arch-unit-tests';

describeGraphqlResolverConventionsTests({
  resolversGlob: '../graphql/src/schema/types/**',
  entityFilesPattern: '../domain/src/domain/contexts/**/*.entity.ts',
  repositoryFilesPattern: '../domain/src/domain/contexts/**/*.repository.ts',
  uowFilesPattern: '../domain/src/domain/contexts/**/*.uow.ts',
  infrastructureServicesPattern: '../../cellix/service-*/**',
  persistenceFolder: '../persistence/**',
});
