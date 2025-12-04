import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserUserVisa } from './personal-user.user.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.user.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('User visa recognizes own account editing', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let visa: PersonalUserUserVisa<PersonalUserEntityReference>;
		let isOwnAccount: boolean;

		Given('I have a user visa for my own account', () => {
			visa = new PersonalUserUserVisa(mockUser, mockUser);
		});

		When('I check own account flag', () => {
			isOwnAccount = visa.determineIf((p) => p.isEditingOwnAccount);
		});

		Then('flag should be true', () => {
			expect(isOwnAccount).toBe(true);
		});
	});

	Scenario('User visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockTargetUser = { id: 'user-456', isBlocked: false } as PersonalUserEntityReference;
		let visa: PersonalUserUserVisa<PersonalUserEntityReference>;

		Given('I create a user visa', () => {
			visa = new PersonalUserUserVisa(mockTargetUser, mockUser);
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
