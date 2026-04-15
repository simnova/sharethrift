import { describe, expect, it } from 'vitest';
import { checkShareThriftSchemaFilesHaveResolvers } from '../checks/graphql-conventions.js';

export interface GraphqlSchemaConventionsTestsConfig {
	graphqlGlob: string;
	excludeFiles?: string[];
}

export function describeGraphqlSchemaConventionsTests(
	config: GraphqlSchemaConventionsTestsConfig,
): void {
	describe('ShareThrift GraphQL Schema Conventions', () => {
		it('schema files must have sibling resolver files unless explicitly excluded', async () => {
			const violations = await checkShareThriftSchemaFilesHaveResolvers(config);
			expect(violations).toStrictEqual([]);
		}, 30000);
	});
}
