import { describeGraphqlSchemaConventionsTests, type GraphqlSchemaConventionsTestsConfig } from '@cellix/arch-unit-tests';

const config: GraphqlSchemaConventionsTestsConfig = {
	graphqlGlob: '../graphql/src/schema/types/**/*.graphql',
	excludeFiles: ['shared-types.graphql', 'listing.graphql', 'appeal-request.graphql'],
};

describeGraphqlSchemaConventionsTests(config);
