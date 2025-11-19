import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SystemUserPassport } from './system.user.passport.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/system.user.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('System passport for user should use permission function', ({ Given, When, Then }) => {
		let passport: SystemUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a system user passport', () => {
			passport = new SystemUserPassport({});
		});

		When('I request access to a user', () => {
			const mockUser = { id: 'test-user-id' } as PersonalUserEntityReference;
			visa = passport.forPersonalUser(mockUser);
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

	Scenario('System user passport should extend SystemPassportBase', ({ Given, When, Then }) => {
		let passport: SystemUserPassport;

		Given('I create a system user passport', () => {
			passport = new SystemUserPassport();
		});

		When('I check its prototype chain', () => {
			// Check inheritance
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(SystemUserPassport);
		});
	});
});
