import { afterEach, describe, expect, it } from 'vitest';
import {
	checkShareThriftApplicationServicesFactoryExports,
} from './checks/application-services-conventions.js';
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

describe('ShareThrift application-services checks', () => {
	it('enforces entity index factory names from the folder name', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(
			workspace,
			'contexts/listing/item/index.ts',
			'export const ItemListing = () => ({ queryAll: async () => [] });\n',
		);
		writeFile(
			workspace,
			'contexts/user/personal-user/index.ts',
			[
				'export interface PersonalUserApplicationService {',
				'\tqueryById: () => Promise<null>;',
				'}',
				'export const WrongFactory = () => ({ queryById: async () => null });',
			].join('\n'),
		);

		const violations =
			await checkShareThriftApplicationServicesFactoryExports({
				applicationServicesGlob: `${workspace}/contexts/**`,
			});

		expect(violations).toHaveLength(1);
		expect(violations[0]).toContain('PersonalUser');
	});
});
