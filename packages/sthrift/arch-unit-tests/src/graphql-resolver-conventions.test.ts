import { describeGraphqlResolverConventionsTests, type GraphqlFlatStructureTestsConfig, type GraphqlResolverConventionsTestsConfig } from '@cellix/arch-unit-tests';

const resolverConfig: GraphqlResolverConventionsTestsConfig = {
  resolversGlob: '../graphql/src/schema/types/**',
  entityFilesPattern: '../domain/src/domain/contexts/**/*.entity.ts',
  repositoryFilesPattern: '../domain/src/domain/contexts/**/*.repository.ts',
  uowFilesPattern: '../domain/src/domain/contexts/**/*.uow.ts',
  infrastructureServicesPattern: '../../cellix/service-*/**',
  persistenceFolder: '../persistence/**',
};

const flatStructureConfig: GraphqlFlatStructureTestsConfig = {
  typesDirectoryPath: '../graphql/src/schema/types',
  allowedSubdirectories: ['features'],
};

describeGraphqlResolverConventionsTests(resolverConfig, flatStructureConfig);
