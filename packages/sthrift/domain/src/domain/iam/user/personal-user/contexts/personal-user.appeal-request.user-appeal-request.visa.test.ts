import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAppealRequestUserAppealRequestVisa } from './personal-user.appeal-request.user-appeal-request.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.appeal-request.user-appeal-request.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('User appeal request visa evaluates permissions', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAppeal = { id: 'appeal-1', user: { id: 'user-123' } } as UserAppealRequestEntityReference;
		let visa: PersonalUserAppealRequestUserAppealRequestVisa<UserAppealRequestEntityReference>;
		let canView: boolean;

		Given('I have a user appeal request visa', () => {
			visa = new PersonalUserAppealRequestUserAppealRequestVisa(mockAppeal, mockUser);
		});

		When('I check view permission', () => {
			canView = visa.determineIf((p) => p.canViewAppealRequest);
		});

		Then('user can view their own appeal', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('User appeal visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAppeal = { id: 'appeal-1', user: { id: 'user-123' } } as UserAppealRequestEntityReference;
		let visa: PersonalUserAppealRequestUserAppealRequestVisa<UserAppealRequestEntityReference>;

		Given('I create a user appeal request visa', () => {
			visa = new PersonalUserAppealRequestUserAppealRequestVisa(mockAppeal, mockUser);
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
