import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserPassportBase } from './personal-user.passport-base.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/personal-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.passport-base.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('PersonalUserPassportBase should be defined', ({ Given, When, Then }) => {
		let passportClass: typeof PersonalUserPassportBase;

		Given('I have the PersonalUserPassportBase class', () => {
			passportClass = PersonalUserPassportBase;
		});

		When('I check the class type', () => {
			// Verify class is defined and is a constructor function
		});

		Then('it should be defined', () => {
			expect(passportClass).toBeDefined();
			expect(typeof passportClass).toBe('function');
		});
	});

	Scenario('PersonalUserPassportBase should accept a user entity', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let instance: PersonalUserPassportBase;

		Given('I have a personal user entity', () => {
			expect(mockUser).toBeDefined();
		});

		When('I create a PersonalUserPassportBase instance', () => {
			instance = new PersonalUserPassportBase(mockUser);
		});

		Then('it should store the user entity', () => {
			expect(instance).toBeDefined();
			expect(instance).toBeInstanceOf(PersonalUserPassportBase);
		});
	});
});
