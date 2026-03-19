import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserListingItemListingVisa } from './personal-user.listing.item-listing.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.listing.item-listing.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Item listing visa evaluates owner permissions', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-1',
			sharer: { id: 'user-123' },
			title: 'Test',
		} as ItemListingEntityReference;
		let visa: PersonalUserListingItemListingVisa<ItemListingEntityReference>;
		let canUpdate: boolean;

		Given('I have an item listing visa for my listing', () => {
			visa = new PersonalUserListingItemListingVisa(mockListing, mockUser);
		});

		When('I check update permission', () => {
			canUpdate = visa.determineIf((p) => p.canUpdateItemListing);
		});

		Then('owner can update listing', () => {
			expect(canUpdate).toBe(true);
		});
	});

	Scenario('Item listing visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockListing = {
			id: 'listing-1',
			sharer: { id: 'user-123' },
			title: 'Test',
		} as ItemListingEntityReference;
		let visa: PersonalUserListingItemListingVisa<ItemListingEntityReference>;

		Given('I create an item listing visa', () => {
			visa = new PersonalUserListingItemListingVisa(mockListing, mockUser);
		});

		When('I check the visa', () => {
			// Check visa
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});
});
