import {
	describeGraphqlResolverConventionsTests,
	type GraphqlResolverConventionsTestsConfig,
	type GraphqlFlatStructureTestsConfig,
} from '@cellix/arch-unit-tests/graphql';

import {
	describeGraphqlResolverConventionsTests as describeShareThriftGraphqlResolverConventionsTests,
	type GraphqlResolverConventionsTestsConfig as ShareThriftGraphqlResolverConventionsTestsConfig,
	type GraphqlFlatStructureTestsConfig as ShareThriftGraphqlFlatStructureTestsConfig,
} from '@sthrift-verification/arch-unit-tests/graphql';

const cellixResolverConfig: GraphqlResolverConventionsTestsConfig = {
	resolversGlob: '../graphql/src/schema/types/**',
	entityFilesPattern: '../domain/src/domain/contexts/**/*.entity.ts',
	repositoryFilesPattern: '../domain/src/domain/contexts/**/*.repository.ts',
	uowFilesPattern: '../domain/src/domain/contexts/**/*.uow.ts',
	infrastructureServicesPattern: '../../cellix/service-*/**',
	persistenceFolder: '../persistence/**',
};

const shareThriftResolverConfig: ShareThriftGraphqlResolverConventionsTestsConfig = {
	resolversGlob: '../graphql/src/schema/types/**',
	entityFilesPattern: '../domain/src/domain/contexts/**/*.entity.ts',
	repositoryFilesPattern: '../domain/src/domain/contexts/**/*.repository.ts',
	uowFilesPattern: '../domain/src/domain/contexts/**/*.uow.ts',
	infrastructureServicesPattern: '../../cellix/service-*/**',
	persistenceFolder: '../persistence/**',
};

const cellixFlatStructureConfig: GraphqlFlatStructureTestsConfig = {
	typesDirectoryPath: '../graphql/src/schema/types',
	allowedSubdirectories: ['features'],
};

const shareThriftFlatStructureConfig: ShareThriftGraphqlFlatStructureTestsConfig = {
	typesDirectoryPath: '../graphql/src/schema/types',
	allowedSubdirectories: ['features'],
};

describeGraphqlResolverConventionsTests(cellixResolverConfig, cellixFlatStructureConfig);
describeShareThriftGraphqlResolverConventionsTests(
	shareThriftResolverConfig,
	shareThriftFlatStructureConfig,
);
