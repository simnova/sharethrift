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
	it('requires page story files, container placement, and container component pairs', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'src/components/pages/home/pages/home-page.tsx', 'export const HomePage = () => null;\n');
		writeFile(workspace, 'src/components/pages/home/pages/home-page.stories.tsx', 'export default {};\n');
		writeFile(
			workspace,
			'src/components/pages/account/profile/pages/profile-page.tsx',
			'export const ProfilePage = () => null;\n',
		);
		writeFile(workspace, 'src/components/pages/home/components/home.container.graphql', 'query Home { home }\n');
		writeFile(workspace, 'src/components/pages/home/components/home.container.tsx', 'export const HomeContainer = () => null;\n');
		writeFile(workspace, 'src/components/pages/account/components/profile.container.graphql', 'query Profile { profile }\n');
		writeFile(workspace, 'src/pages/rogue.container.tsx', 'export const RogueContainer = () => null;\n');

		const pageViolations = await checkShareThriftPageStoryCoverage({
			uiSourcePath: `${workspace}/src`,
		});
		const placementViolations = await checkShareThriftContainerPlacement({
			uiSourcePath: `${workspace}/src`,
		});
		const containerViolations = await checkShareThriftContainerGraphqlPairing({
			uiSourcePath: `${workspace}/src`,
		});

		expect(pageViolations).toHaveLength(1);
		expect(pageViolations[0]).toContain('profile-page.tsx');
		expect(placementViolations).toHaveLength(1);
		expect(placementViolations[0]).toContain('rogue.container.tsx');
		expect(containerViolations).toHaveLength(1);
		expect(containerViolations[0]).toContain('profile.container.graphql');
	});
});
