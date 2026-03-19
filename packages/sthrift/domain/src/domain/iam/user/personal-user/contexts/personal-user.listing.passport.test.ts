import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserListingPassport } from './personal-user.listing.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.listing.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access item listings', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserListingPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user listing passport', () => {
			passport = new PersonalUserListingPassport(mockUser);
		});

		When('I request access to an item listing', () => {
			const mockListing = {
				id: 'listing-1',
				sharer: { id: 'user-123' },
				title: 'Test Listing',
			} as ItemListingEntityReference;
			visa = passport.forItemListing(mockListing);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user listing passport is defined', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserListingPassport;

		Given('I create a personal user listing passport', () => {
			passport = new PersonalUserListingPassport(mockUser);
		});

		When('I check the passport', () => {
			// Passport instance is ready for verification
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserListingPassport);
		});
	});
});
