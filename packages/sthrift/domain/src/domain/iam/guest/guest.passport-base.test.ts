import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { GuestPassportBase } from './guest.passport-base.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/guest.passport-base.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('GuestPassportBase should be an abstract class', ({ Given, When, Then }) => {
		let passportClass: typeof GuestPassportBase;

		Given('I have the GuestPassportBase class', () => {
			passportClass = GuestPassportBase;
		});

		When('I check the class type', () => {
			// Verify class is defined and is a constructor function
		});

		Then('it should be defined', () => {
			expect(passportClass).toBeDefined();
			expect(typeof passportClass).toBe('function');
		});
	});

	Scenario('GuestPassportBase should be extendable', ({ Given, When, Then }) => {
		class TestGuestPassport extends GuestPassportBase {}
		let instance: TestGuestPassport;

		Given('I create a class extending GuestPassportBase', () => {
			instance = new TestGuestPassport();
		});

		When('I instantiate the extended class', () => {
			// Instance is created in Given step and ready for verification
		});

		Then('it should be an instance of GuestPassportBase', () => {
			expect(instance).toBeInstanceOf(GuestPassportBase);
		});
	});
});
