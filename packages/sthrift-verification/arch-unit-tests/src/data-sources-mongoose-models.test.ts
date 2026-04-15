import { afterEach, describe, expect, it } from 'vitest';
import { checkShareThriftModelExportNaming } from './checks/data-sources-mongoose-models-conventions.js';
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

describe('ShareThrift data-sources-mongoose-models checks', () => {
	it('matches exported model names to the model file name', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(
			workspace,
			'models/listing/item-listing.model.ts',
			[
				'export const ItemListingModelFactory = () => ({});',
				'export type ItemListingModelType = {};',
				'export const ItemListingModelName = "ItemListing";',
			].join('\n'),
		);
		writeFile(
			workspace,
			'models/user/personal-user.model.ts',
			[
				'export const UserModelFactory = () => ({});',
				'export type UserModelType = {};',
				'export const UserModelName = "User";',
			].join('\n'),
		);

		const violations = await checkShareThriftModelExportNaming({
			modelsGlob: `${workspace}/models/**`,
		});

		expect(violations).toHaveLength(3);
		expect(violations[0]).toContain('PersonalUser');
	});
});
