import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserListingVisa } from './personal-user.listing.visa.ts';
import type { ItemListingEntityReference } from '../../../../contexts/listing/item/index.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.listing.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can view any listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-456', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockSharer,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canView: boolean;

		Given('I have a personal user listing visa', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can view the listing', () => {
			canView = visa.determineIf((p) => p.canViewItemListing);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Personal user can create listings', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockUser,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canCreate: boolean;

		Given('I have a personal user listing visa', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can create a listing', () => {
			canCreate = visa.determineIf((p) => p.canCreateItemListing);
		});

		Then('permission should be granted', () => {
			expect(canCreate).toBe(true);
		});
	});

	Scenario('Personal user can update own listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockUser,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canUpdate: boolean;

		Given('I have a listing owned by the personal user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can update the listing', () => {
			canUpdate = visa.determineIf((p) => p.canUpdateItemListing);
		});

		Then('permission should be granted', () => {
			expect(canUpdate).toBe(true);
		});
	});

	Scenario('Personal user cannot update other\'s listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-456', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockSharer,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canUpdate: boolean;

		Given('I have a listing owned by another user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can update the listing', () => {
			canUpdate = visa.determineIf((p) => p.canUpdateItemListing);
		});

		Then('permission should be denied', () => {
			expect(canUpdate).toBe(false);
		});
	});

	Scenario('Personal user can delete own listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockUser,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canDelete: boolean;

		Given('I have a listing owned by the personal user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can delete the listing', () => {
			canDelete = visa.determineIf((p) => p.canDeleteItemListing);
		});

		Then('permission should be granted', () => {
			expect(canDelete).toBe(true);
		});
	});

	Scenario('Personal user cannot delete other\'s listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-456', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockSharer,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canDelete: boolean;

		Given('I have a listing owned by another user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can delete the listing', () => {
			canDelete = visa.determineIf((p) => p.canDeleteItemListing);
		});

		Then('permission should be denied', () => {
			expect(canDelete).toBe(false);
		});
	});

	Scenario('Personal user can publish own listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockUser,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canPublish: boolean;

		Given('I have a listing owned by the personal user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can publish the listing', () => {
			canPublish = visa.determineIf((p) => p.canPublishItemListing);
		});

		Then('permission should be granted', () => {
			expect(canPublish).toBe(true);
		});
	});

	Scenario('Personal user cannot publish other\'s listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-456', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockSharer,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canPublish: boolean;

		Given('I have a listing owned by another user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can publish the listing', () => {
			canPublish = visa.determineIf((p) => p.canPublishItemListing);
		});

		Then('permission should be denied', () => {
			expect(canPublish).toBe(false);
		});
	});

	Scenario('Personal user can unpublish own listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockUser,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canUnpublish: boolean;

		Given('I have a listing owned by the personal user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can unpublish the listing', () => {
			canUnpublish = visa.determineIf((p) => p.canUnpublishItemListing);
		});

		Then('permission should be granted', () => {
			expect(canUnpublish).toBe(true);
		});
	});

	Scenario('Personal user cannot unpublish other\'s listing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-456', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockSharer,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;
		let canUnpublish: boolean;

		Given('I have a listing owned by another user', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check if user can unpublish the listing', () => {
			canUnpublish = visa.determineIf((p) => p.canUnpublishItemListing);
		});

		Then('permission should be denied', () => {
			expect(canUnpublish).toBe(false);
		});
	});

	Scenario('Listing visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-789',
			sharer: mockUser,
		} as ItemListingEntityReference;
		let visa: PersonalUserListingVisa<ItemListingEntityReference>;

		Given('I create a listing visa', () => {
			visa = new PersonalUserListingVisa(mockListing, mockUser);
		});

		When('I check the visa', () => {
			// Visa instance is ready for verification
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});
});
