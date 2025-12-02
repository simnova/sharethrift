import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserListingItemListingVisa } from './admin-user.listing.item-listing.visa.ts';
import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user.listing.item-listing.visa.feature',
	),
);

function makeAdminUser(
	canEditUsers = false,
	canModerateListings = false,
	canDeleteContent = false,
): AdminUserEntityReference {
	return vi.mocked({
		id: 'admin-1',
		isBlocked: false,
		role: {
			permissions: {
				userPermissions: {
					canEditUsers,
					canDeleteContent,
				},
				listingPermissions: {
					canModerateListings,
				},
			},
		},
	} as unknown as AdminUserEntityReference);
}

function makeListingRoot(): ItemListingEntityReference {
	return vi.mocked({
		id: 'listing-1',
	} as unknown as ItemListingEntityReference);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let admin: AdminUserEntityReference;
	let listingRoot: ItemListingEntityReference;
	let visa: AdminUserListingItemListingVisa<ItemListingEntityReference>;
	let result: boolean;

	BeforeEachScenario(() => {
		admin = makeAdminUser();
		listingRoot = makeListingRoot();
		visa = new AdminUserListingItemListingVisa(listingRoot, admin);
		result = false;
	});

	Background(({ Given, And }) => {
		Given('an admin user with role permissions', () => {
			admin = makeAdminUser();
		});
		And('an item listing entity reference', () => {
			listingRoot = makeListingRoot();
		});
	});

	Scenario(
		'Admin can view all listings by default',
		({ Given, When, Then }) => {
			Given('an admin user', () => {
				admin = makeAdminUser(false, false, false);
				visa = new AdminUserListingItemListingVisa(listingRoot, admin);
			});

			When('I check if admin can view item listing', () => {
				result = visa.determineIf((p) => p.canViewItemListing);
			});

			Then('the permission should always be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin can create listing with edit users permission',
		({ Given, When, Then }) => {
			Given('the admin has canEditUsers permission', () => {
				admin = makeAdminUser(true, false, false);
				visa = new AdminUserListingItemListingVisa(listingRoot, admin);
			});

			When('I check if admin can create item listing', () => {
				result = visa.determineIf((p) => p.canCreateItemListing);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin can update listing with moderation permission',
		({ Given, When, Then }) => {
			Given('the admin has canModerateListings permission', () => {
				admin = makeAdminUser(false, true, false);
				visa = new AdminUserListingItemListingVisa(listingRoot, admin);
			});

			When('I check if admin can update item listing', () => {
				result = visa.determineIf((p) => p.canUpdateItemListing);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin can delete listing with delete content permission',
		({ Given, When, Then }) => {
			Given('the admin has canDeleteContent permission', () => {
				admin = makeAdminUser(false, false, true);
				visa = new AdminUserListingItemListingVisa(listingRoot, admin);
			});

			When('I check if admin can delete item listing', () => {
				result = visa.determineIf((p) => p.canDeleteItemListing);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin can publish listing with moderation permission',
		({ Given, When, Then }) => {
			Given('the admin has canModerateListings permission', () => {
				admin = makeAdminUser(false, true, false);
				visa = new AdminUserListingItemListingVisa(listingRoot, admin);
			});

			When('I check if admin can publish item listing', () => {
				result = visa.determineIf((p) => p.canPublishItemListing);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin can unpublish listing with moderation permission',
		({ Given, When, Then }) => {
			Given('the admin has canModerateListings permission', () => {
				admin = makeAdminUser(false, true, false);
				visa = new AdminUserListingItemListingVisa(listingRoot, admin);
			});

			When('I check if admin can unpublish item listing', () => {
				result = visa.determineIf((p) => p.canUnpublishItemListing);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);
});
