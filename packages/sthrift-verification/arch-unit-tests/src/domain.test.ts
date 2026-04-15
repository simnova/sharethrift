import { afterEach, describe, expect, it } from 'vitest';
import { checkShareThriftDomainContextAuthorizationFiles } from './checks/domain-conventions.js';
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

describe('ShareThrift domain checks', () => {
	it('requires passport, domain-permissions, and visa files for each context', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(workspace, 'contexts/listing/index.ts');
		writeFile(workspace, 'contexts/listing/listing.passport.ts');
		writeFile(workspace, 'contexts/listing/listing.domain-permissions.ts');
		writeFile(workspace, 'contexts/listing/listing.visa.ts');
		writeFile(workspace, 'contexts/user/index.ts');
		writeFile(workspace, 'contexts/user/user.passport.ts');

		const violations = await checkShareThriftDomainContextAuthorizationFiles({
			domainContextsGlob: `${workspace}/contexts/**`,
		});

		expect(violations).toHaveLength(2);
		expect(violations[0]).toContain('user.domain-permissions.ts');
	});
});
