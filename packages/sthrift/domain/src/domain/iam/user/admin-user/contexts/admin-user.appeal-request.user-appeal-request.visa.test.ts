import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserAppealRequestUserAppealRequestVisa } from './admin-user.appeal-request.user-appeal-request.visa.ts';
import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user.appeal-request.user-appeal-request.visa.feature',
	),
);

function makeAdminUser(
	adminId: string,
	isBlocked = false,
): AdminUserEntityReference {
	return vi.mocked({
		id: adminId,
		isBlocked,
	} as unknown as AdminUserEntityReference);
}

function makeUserAppealRequestRoot(
	userId: string,
): UserAppealRequestEntityReference {
	return vi.mocked({
		id: 'appeal-1',
		user: {
			id: userId,
		},
	} as unknown as UserAppealRequestEntityReference);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let admin: AdminUserEntityReference;
	let appealRoot: UserAppealRequestEntityReference;
	let visa: AdminUserAppealRequestUserAppealRequestVisa<UserAppealRequestEntityReference>;
	let result: boolean;

	BeforeEachScenario(() => {
		admin = makeAdminUser('admin-1', false);
		appealRoot = makeUserAppealRequestRoot('user-1');
		visa = new AdminUserAppealRequestUserAppealRequestVisa(appealRoot, admin);
		result = false;
	});

	Background(({ Given, And }) => {
		Given('an admin user', () => {
			admin = makeAdminUser('admin-1', false);
		});
		And('a user appeal request entity reference', () => {
			appealRoot = makeUserAppealRequestRoot('user-1');
		});
	});

	Scenario(
		'Non-blocked admin can create appeal request',
		({ Given, When, Then }) => {
			Given('the admin is not blocked', () => {
				admin = makeAdminUser('admin-1', false);
				visa = new AdminUserAppealRequestUserAppealRequestVisa(
					appealRoot,
					admin,
				);
			});

			When('I check if admin can create appeal request', () => {
				result = visa.determineIf((p) => p.canCreateAppealRequest);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Blocked admin cannot create appeal request',
		({ Given, When, Then }) => {
			Given('the admin is blocked', () => {
				admin = makeAdminUser('admin-1', true);
				visa = new AdminUserAppealRequestUserAppealRequestVisa(
					appealRoot,
					admin,
				);
			});

			When('I check if admin can create appeal request', () => {
				result = visa.determineIf((p) => p.canCreateAppealRequest);
			});

			Then('the permission should be denied', () => {
				expect(result).toBe(false);
			});
		},
	);

	Scenario(
		'Admin can update appeal request state if they own it',
		({ Given, When, Then }) => {
			Given('the admin is the owner of the appeal request', () => {
				admin = makeAdminUser('admin-1', false);
				appealRoot = makeUserAppealRequestRoot('admin-1');
				visa = new AdminUserAppealRequestUserAppealRequestVisa(
					appealRoot,
					admin,
				);
			});

			When('I check if admin can update appeal request state', () => {
				result = visa.determineIf((p) => p.canUpdateAppealRequestState);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		"Admin cannot update appeal request state if they don't own it",
		({ Given, When, Then }) => {
			Given('the admin is not the owner of the appeal request', () => {
				admin = makeAdminUser('admin-1', false);
				appealRoot = makeUserAppealRequestRoot('other-user');
				visa = new AdminUserAppealRequestUserAppealRequestVisa(
					appealRoot,
					admin,
				);
			});

			When('I check if admin can update appeal request state', () => {
				result = visa.determineIf((p) => p.canUpdateAppealRequestState);
			});

			Then('the permission should be denied', () => {
				expect(result).toBe(false);
			});
		},
	);

	Scenario(
		'Admin can view their own appeal request',
		({ Given, When, Then }) => {
			Given('the admin is the owner of the appeal request', () => {
				admin = makeAdminUser('admin-1', false);
				appealRoot = makeUserAppealRequestRoot('admin-1');
				visa = new AdminUserAppealRequestUserAppealRequestVisa(
					appealRoot,
					admin,
				);
			});

			When('I check if admin can view appeal request', () => {
				result = visa.determineIf((p) => p.canViewAppealRequest);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin cannot view all appeal requests',
		({ Given, When, Then }) => {
			Given('any admin user', () => {
				admin = makeAdminUser('admin-1', false);
				visa = new AdminUserAppealRequestUserAppealRequestVisa(
					appealRoot,
					admin,
				);
			});

			When('I check if admin can view all appeal requests', () => {
				result = visa.determineIf((p) => p.canViewAllAppealRequests);
			});

			Then('the permission should be denied', () => {
				expect(result).toBe(false);
			});
		},
	);
});
