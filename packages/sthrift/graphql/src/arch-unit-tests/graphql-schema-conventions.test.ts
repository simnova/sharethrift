import {
	describeGraphqlSchemaConventionsTests,
	type GraphqlSchemaConventionsTestsConfig,
} from '@cellix/arch-unit-tests/graphql';

import {
	describeGraphqlSchemaConventionsTests as describeShareThriftGraphqlSchemaConventionsTests,
	type GraphqlSchemaConventionsTestsConfig as ShareThriftGraphqlSchemaConventionsTestsConfig,
} from '@sthrift-verification/arch-unit-tests/graphql';

const cellixSchemaConfig: GraphqlSchemaConventionsTestsConfig = {
	graphqlGlob: '../graphql/src/schema/types/**/*.graphql',
	excludeFiles: ['shared-types.graphql', 'listing.graphql', 'appeal-request.graphql'],
};

const shareThriftSchemaConfig: ShareThriftGraphqlSchemaConventionsTestsConfig = {
	graphqlGlob: '../graphql/src/schema/types/**/*.graphql',
	excludeFiles: ['shared-types.graphql', 'listing.graphql', 'appeal-request.graphql'],
};

describeGraphqlSchemaConventionsTests(cellixSchemaConfig);
describeShareThriftGraphqlSchemaConventionsTests(shareThriftSchemaConfig);
