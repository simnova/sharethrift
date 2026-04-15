export {
	checkShareThriftResolversHaveSchemaFiles,
	checkShareThriftSchemaFilesHaveResolvers,
} from './checks/graphql-conventions.js';

export {
	describeGraphqlResolverConventionsTests,
	type GraphqlResolverConventionsTestsConfig,
	type GraphqlFlatStructureTestsConfig,
} from './test-suites/graphql-resolver-conventions.js';

export {
	describeGraphqlSchemaConventionsTests,
	type GraphqlSchemaConventionsTestsConfig,
} from './test-suites/graphql-schema-conventions.js';
