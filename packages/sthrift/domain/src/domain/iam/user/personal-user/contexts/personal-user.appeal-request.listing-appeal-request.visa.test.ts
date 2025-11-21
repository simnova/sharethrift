import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAppealRequestListingAppealRequestVisa } from './personal-user.appeal-request.listing-appeal-request.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ListingAppealRequestEntityReference } from '../../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.appeal-request.listing-appeal-request.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Listing appeal request visa evaluates permissions', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAppeal = { id: 'appeal-1', user: { id: 'user-123' } } as ListingAppealRequestEntityReference;
		let visa: PersonalUserAppealRequestListingAppealRequestVisa<ListingAppealRequestEntityReference>;
		let canCreate: boolean;

		Given('I have a listing appeal request visa', () => {
			visa = new PersonalUserAppealRequestListingAppealRequestVisa(mockAppeal, mockUser);
		});

		When('I check create permission', () => {
			canCreate = visa.determineIf((p) => p.canCreateAppealRequest);
		});

		Then('permission should be based on user blocked status', () => {
			expect(canCreate).toBe(true);
		});
	});

	Scenario('Listing appeal visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAppeal = { id: 'appeal-1', user: { id: 'user-123' } } as ListingAppealRequestEntityReference;
		let visa: PersonalUserAppealRequestListingAppealRequestVisa<ListingAppealRequestEntityReference>;

		Given('I create a listing appeal request visa', () => {
			visa = new PersonalUserAppealRequestListingAppealRequestVisa(mockAppeal, mockUser);
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
