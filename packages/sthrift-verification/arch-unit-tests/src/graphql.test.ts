import { afterEach, describe, expect, it } from 'vitest';
import {
	checkShareThriftResolversHaveSchemaFiles,
	checkShareThriftSchemaFilesHaveResolvers,
} from './checks/graphql-conventions.js';
import {
	createTempWorkspace,
	removeTempWorkspace,
	writeFile,
} from './test-helpers.js';

const workspaces: string[] = [];

afterEach(() => {
	for (const workspace of workspaces.splice(0)) {
		removeTempWorkspace(workspace);
	}
});

describe('ShareThrift graphql checks', () => {
	it('returns no violations for a fully compliant workspace', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'schema/types/user.resolvers.ts', 'export default {};\n');
		writeFile(workspace, 'schema/types/user.graphql', 'type User { id: ID! }\n');
		writeFile(workspace, 'schema/types/listing.resolvers.ts', 'export default {};\n');
		writeFile(workspace, 'schema/types/listing.graphql', 'type Listing { id: ID! }\n');

		const resolverViolations = await checkShareThriftResolversHaveSchemaFiles({
			resolversGlob: `${workspace}/schema/types/**`,
		});
		const schemaViolations = await checkShareThriftSchemaFilesHaveResolvers({
			graphqlGlob: `${workspace}/schema/types/**/*.graphql`,
		});

		expect(resolverViolations).toEqual([]);
		expect(schemaViolations).toEqual([]);
	});

	it('pairs resolver files with schema files in both directions', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'schema/types/user.resolvers.ts', 'export default {};\n');
		writeFile(workspace, 'schema/types/user.graphql', 'type User { id: ID! }\n');
		writeFile(workspace, 'schema/types/listing.resolvers.ts', 'export default {};\n');
		writeFile(
			workspace,
			'schema/types/account.graphql',
			'extend type Query { account: Account }\n\ntype Account { id: ID! }\n',
		);

		const resolverViolations = await checkShareThriftResolversHaveSchemaFiles({
			resolversGlob: `${workspace}/schema/types/**`,
		});
		const schemaViolations = await checkShareThriftSchemaFilesHaveResolvers({
			graphqlGlob: `${workspace}/schema/types/**/*.graphql`,
		});

		expect(resolverViolations).toHaveLength(1);
		expect(resolverViolations[0]).toContain('listing.resolvers.ts');
		expect(schemaViolations).toHaveLength(1);
		expect(schemaViolations[0]).toContain('account.graphql');
	});
});
