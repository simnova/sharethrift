import { describeGraphqlSchemaConventionsTests } from '@cellix/arch-unit-tests';

describeGraphqlSchemaConventionsTests({
	graphqlGlob: '../graphql/src/schema/types/**/*.graphql',
	// shared-types.graphql has no top-level type (just shared inputs like SorterInput)
	// listing.graphql is a union definition only
	// appeal-request.graphql is enum-only (shared enums used by other files)
	excludeFiles: ['shared-types.graphql', 'listing.graphql', 'appeal-request.graphql'],
});
