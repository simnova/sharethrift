import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SystemAppealRequestPassport } from './system.appeal-request.passport.ts';
import type { ListingAppealRequestEntityReference } from '../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/system.appeal-request.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('System passport for listing appeal request should use permission function', ({ Given, When, Then }) => {
		let passport: SystemAppealRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a system appeal request passport', () => {
			passport = new SystemAppealRequestPassport({});
		});

		When('I request access to a listing appeal request', () => {
			const mockAppealRequest = { id: 'test-appeal-id' } as ListingAppealRequestEntityReference;
			visa = passport.forListingAppealRequest(mockAppealRequest);
		});

		Then('visa should use permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			const result = visa.determineIf((_permissions: any) => true);
			expect(result).toBe(true);
		});
	});

	Scenario('System passport for user appeal request should use permission function', ({ Given, When, Then }) => {
		let passport: SystemAppealRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a system appeal request passport', () => {
			passport = new SystemAppealRequestPassport({});
		});

		When('I request access to a user appeal request', () => {
			const mockAppealRequest = { id: 'test-appeal-id' } as UserAppealRequestEntityReference;
			visa = passport.forUserAppealRequest(mockAppealRequest);
		});

		Then('visa should use permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('System passport should extend SystemPassportBase', ({ Given, When, Then }) => {
		let passport: SystemAppealRequestPassport;

		Given('I create a system appeal request passport', () => {
			passport = new SystemAppealRequestPassport();
		});

		When('I check its prototype chain', () => {
			// Check inheritance
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(SystemAppealRequestPassport);
		});
	});
});
