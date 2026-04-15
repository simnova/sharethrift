import { afterEach, describe, expect, it } from 'vitest';
import {
	checkShareThriftContainerPlacement,
	checkShareThriftContainerGraphqlPairing,
	checkShareThriftPageStoryCoverage,
} from './checks/frontend-architecture.js';
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

describe('ShareThrift frontend checks', () => {
	it('requires page story files', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'src/components/pages/home/pages/home-page.tsx', 'export const HomePage = () => null;\n');
		writeFile(workspace, 'src/components/pages/home/pages/home-page.stories.tsx', 'export default {};\n');
		writeFile(
			workspace,
			'src/components/pages/account/profile/pages/profile-page.tsx',
			'export const ProfilePage = () => null;\n',
		);

		const violations = await checkShareThriftPageStoryCoverage({
			uiSourcePath: `${workspace}/src`,
		});

		expect(violations).toHaveLength(1);
		expect(violations[0]).toContain('profile-page.tsx');
	});

	it('requires containers inside page component directories', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'src/components/pages/home/components/home.container.tsx', 'export const HomeContainer = () => null;\n');
		writeFile(workspace, 'src/pages/rogue.container.tsx', 'export const RogueContainer = () => null;\n');

		const violations = await checkShareThriftContainerPlacement({
			uiSourcePath: `${workspace}/src`,
		});

		expect(violations).toHaveLength(1);
		expect(violations[0]).toContain('rogue.container.tsx');
	});

	it('requires container components to have matching graphql files', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'src/components/pages/home/components/home.container.graphql', 'query Home { home }\n');
		writeFile(workspace, 'src/components/pages/home/components/home.container.tsx', 'export const HomeContainer = () => null;\n');
		writeFile(workspace, 'src/components/pages/account/components/profile.container.graphql', 'query Profile { profile }\n');

		const violations = await checkShareThriftContainerGraphqlPairing({
			uiSourcePath: `${workspace}/src`,
		});

		expect(violations).toHaveLength(1);
		expect(violations[0]).toContain('profile.container.graphql');
	});
});
