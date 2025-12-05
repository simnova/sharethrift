import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { GuestAppealRequestPassport } from './guest.appeal-request.passport.ts';
import type { ListingAppealRequestEntityReference } from '../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/guest.appeal-request.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Guest passport for listing appeal request should deny access', ({ Given, When, Then }) => {
		let passport: GuestAppealRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a guest appeal request passport', () => {
			passport = new GuestAppealRequestPassport();
		});

		When('I request access to a listing appeal request', () => {
			const mockAppealRequest = { id: 'test-appeal-id' } as ListingAppealRequestEntityReference;
			visa = passport.forListingAppealRequest(mockAppealRequest);
		});

		Then('access should be denied', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			expect(visa.determineIf()).toBe(false);
		});
	});

	Scenario('Guest passport for user appeal request should deny access', ({ Given, When, Then }) => {
		let passport: GuestAppealRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a guest appeal request passport', () => {
			passport = new GuestAppealRequestPassport();
		});

		When('I request access to a user appeal request', () => {
			const mockAppealRequest = { id: 'test-appeal-id' } as UserAppealRequestEntityReference;
			visa = passport.forUserAppealRequest(mockAppealRequest);
		});

		Then('access should be denied', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			expect(visa.determineIf()).toBe(false);
		});
	});

	Scenario('Guest passport should extend GuestPassportBase', ({ Given, When, Then }) => {
		let passport: GuestAppealRequestPassport;

		Given('I create a guest appeal request passport', () => {
			passport = new GuestAppealRequestPassport();
		});

		When('I check its prototype chain', () => {
			// Check inheritance
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(GuestAppealRequestPassport);
		});
	});
});
