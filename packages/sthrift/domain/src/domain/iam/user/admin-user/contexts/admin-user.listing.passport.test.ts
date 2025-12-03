import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserListingPassport } from './admin-user.listing.passport.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';
import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.listing.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Admin user can access item listings', ({ Given, When, Then }) => {
		const mockUser = {
			id: 'admin-user-123',
			isBlocked: false,
		} as AdminUserEntityReference;
		let passport: AdminUserListingPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have an admin user listing passport', () => {
			passport = new AdminUserListingPassport(mockUser);
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

	Scenario('Admin user listing passport is defined', ({ Given, When, Then }) => {
		const mockUser = {
			id: 'admin-user-123',
			isBlocked: false,
		} as AdminUserEntityReference;
		let passport: AdminUserListingPassport;

		Given('I create an admin user listing passport', () => {
			passport = new AdminUserListingPassport(mockUser);
		});

		When('I check the passport', () => {
			// Passport instance is ready for verification
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(AdminUserListingPassport);
		});
	});
});
