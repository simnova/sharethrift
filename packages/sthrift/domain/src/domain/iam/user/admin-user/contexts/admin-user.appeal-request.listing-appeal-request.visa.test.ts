import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserAppealRequestListingAppealRequestVisa } from './admin-user.appeal-request.listing-appeal-request.visa.ts';
import type { ListingAppealRequestEntityReference } from '../../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user.appeal-request.listing-appeal-request.visa.feature',
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

function makeListingAppealRequestRoot(
	userId: string,
): ListingAppealRequestEntityReference {
	return vi.mocked({
		id: 'appeal-1',
		user: {
			id: userId,
		},
	} as unknown as ListingAppealRequestEntityReference);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let admin: AdminUserEntityReference;
	let appealRoot: ListingAppealRequestEntityReference;
	let visa: AdminUserAppealRequestListingAppealRequestVisa<ListingAppealRequestEntityReference>;
	let result: boolean;

	BeforeEachScenario(() => {
		admin = makeAdminUser('admin-1', false);
		appealRoot = makeListingAppealRequestRoot('user-1');
		visa = new AdminUserAppealRequestListingAppealRequestVisa(
			appealRoot,
			admin,
		);
		result = false;
	});

	Background(({ Given, And }) => {
		Given('an admin user', () => {
			admin = makeAdminUser('admin-1', false);
		});
		And('a listing appeal request entity reference', () => {
			appealRoot = makeListingAppealRequestRoot('user-1');
		});
	});

	Scenario(
		'Non-blocked admin can create appeal request',
		({ Given, When, Then }) => {
			Given('the admin is not blocked', () => {
				admin = makeAdminUser('admin-1', false);
				visa = new AdminUserAppealRequestListingAppealRequestVisa(
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
				visa = new AdminUserAppealRequestListingAppealRequestVisa(
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
				appealRoot = makeListingAppealRequestRoot('admin-1');
				visa = new AdminUserAppealRequestListingAppealRequestVisa(
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
				appealRoot = makeListingAppealRequestRoot('other-user');
				visa = new AdminUserAppealRequestListingAppealRequestVisa(
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
				appealRoot = makeListingAppealRequestRoot('admin-1');
				visa = new AdminUserAppealRequestListingAppealRequestVisa(
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
				visa = new AdminUserAppealRequestListingAppealRequestVisa(
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
