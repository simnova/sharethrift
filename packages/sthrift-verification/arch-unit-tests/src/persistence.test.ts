import { afterEach, describe, expect, it } from 'vitest';
import { checkShareThriftPersistenceFactoryExports } from './checks/persistence-conventions.js';
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

describe('ShareThrift persistence checks', () => {
	it('requires expected factory exports in domain and readonly entity indexes', async () => {
		const workspace = createTempWorkspace();
		workspaces.push(workspace);

		writeFile(
			workspace,
			'datasources/domain/listing/item/index.ts',
			'export const ItemListingPersistence = () => ({ ItemListingUnitOfWork: {} });\n',
		);
		writeFile(
			workspace,
			'datasources/domain/user/personal-user/index.ts',
			[
				'import { getPersonalUserUnitOfWork } from "./personal-user.uow.ts";',
				'export const WrongPersistence = () => ({',
				'\tPersonalUserUnitOfWork: getPersonalUserUnitOfWork(),',
				'});',
			].join('\n'),
		);
		writeFile(
			workspace,
			'datasources/readonly/listing/item/index.ts',
			'export const ItemListingReadRepositoryImpl = () => ({ ItemListingReadRepo: {} });\n',
		);
		writeFile(
			workspace,
			'datasources/readonly/user/personal-user/index.ts',
			[
				'import { getPersonalUserReadRepository } from "./personal-user.read-repository.ts";',
				'export const WrongReadRepository = () => ({',
				'\tPersonalUserReadRepo: getPersonalUserReadRepository(),',
				'});',
			].join('\n'),
		);

		const violations = await checkShareThriftPersistenceFactoryExports({
			persistenceDomainGlob: `${workspace}/datasources/domain/**`,
			persistenceReadonlyGlob: `${workspace}/datasources/readonly/**`,
		});

		expect(violations).toHaveLength(2);
		expect(violations).toEqual(
			expect.arrayContaining([
				expect.stringContaining('PersonalUserPersistence'),
				expect.stringContaining('PersonalUserReadRepositoryImpl'),
			]),
		);
	});
});
