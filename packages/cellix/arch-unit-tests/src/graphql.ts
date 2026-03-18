// GraphQL-specific checks and test suites
export {
	checkGraphqlResolverDependencies,
	checkGraphqlResolverContent,
	checkGraphqlFlatStructure,
	type GraphqlResolverConventionsConfig,
	type GraphqlFlatStructureConfig,
} from './checks/graphql-resolver-conventions.js';

export {
	checkGraphqlSchemaFileNaming,
	checkGraphqlSchemaTypePrefixing,
	checkGraphqlSchemaMutationResults,
	checkGraphqlSchemaInputNaming,
	checkGraphqlSchemaOrdering,
	checkGraphqlSchemaConventions,
	type GraphqlSchemaConventionsConfig,
} from './checks/graphql-schema-conventions.js';

export {
	describeGraphqlResolverConventionsTests,
	type GraphqlResolverConventionsTestsConfig,
	type GraphqlFlatStructureTestsConfig,
} from './test-suites/graphql-resolver-conventions.js';

export {
	describeGraphqlSchemaConventionsTests,
	type GraphqlSchemaConventionsTestsConfig,
} from './test-suites/graphql-schema-conventions.js';
