import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAppealRequestPassport } from './personal-user.appeal-request.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ListingAppealRequestEntityReference } from '../../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.appeal-request.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access listing appeal requests', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserAppealRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user appeal request passport', () => {
			passport = new PersonalUserAppealRequestPassport(mockUser);
		});

		When('I request access to a listing appeal request', () => {
			const mockAppeal = { id: 'appeal-1', user: { id: 'user-123' } } as ListingAppealRequestEntityReference;
			visa = passport.forListingAppealRequest(mockAppeal);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user can access user appeal requests', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserAppealRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user appeal request passport', () => {
			passport = new PersonalUserAppealRequestPassport(mockUser);
		});

		When('I request access to a user appeal request', () => {
			const mockAppeal = { id: 'appeal-1', user: { id: 'user-123' } } as UserAppealRequestEntityReference;
			visa = passport.forUserAppealRequest(mockAppeal);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user passport extends base passport', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserAppealRequestPassport;

		Given('I create a personal user appeal request passport', () => {
			passport = new PersonalUserAppealRequestPassport(mockUser);
		});

		When('I check its type', () => {
			// Check instance
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserAppealRequestPassport);
		});
	});
});
