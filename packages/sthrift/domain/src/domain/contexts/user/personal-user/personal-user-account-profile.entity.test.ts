import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { PersonalUserProfileProps } from './personal-user-account-profile.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makePersonalUserProfileProps(overrides?: Partial<PersonalUserProfileProps>): any {
	return {
		firstName: 'Test',
		lastName: 'User',
		aboutMe: 'Test bio',
		location: {
			address1: '123 Main St',
			address2: null,
			city: 'Test City',
			state: 'TS',
			country: 'Test Country',
			zipCode: '12345',
		},
		billing: {
			subscriptionId: null,
			cybersourceCustomerId: null,
			paymentState: 'none',
			lastTransactionId: null,
			lastPaymentAmount: null,
		},
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a personal user profile props object', () => {
			props = makePersonalUserProfileProps();
		});
	});

	Scenario('Personal user profile firstName should be a string', ({ When, Then }) => {
		When('I access the firstName property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const profileProps: PersonalUserProfileProps = props;
			expect(typeof profileProps.firstName).toBe('string');
			expect(profileProps.firstName).toBe('Test');
		});
	});

	Scenario('Personal user profile lastName should be a string', ({ When, Then }) => {

		When('I access the lastName property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const profileProps: PersonalUserProfileProps = props;
			expect(typeof profileProps.lastName).toBe('string');
			expect(profileProps.lastName).toBe('User');
		});
	});

	Scenario('Personal user profile aboutMe should be a string', ({ When, Then }) => {

		When('I access the aboutMe property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const profileProps: PersonalUserProfileProps = props;
			expect(typeof profileProps.aboutMe).toBe('string');
			expect(profileProps.aboutMe).toBe('Test bio');
		});
	});

	Scenario('Personal user profile location should be readonly', ({ When, Then }) => {

		When('I access the location property', () => {
			// Access the property
		});

		Then('it should be an object', () => {
			const profileProps: PersonalUserProfileProps = props;
			expect(typeof profileProps.location).toBe('object');
			expect(profileProps.location).toHaveProperty('address1');
			expect(profileProps.location).toHaveProperty('city');
		});
	});

	Scenario('Personal user profile billing should be readonly', ({ When, Then }) => {

		When('I access the billing property', () => {
			// Access the property
		});

		Then('it should be an object', () => {
			const profileProps: PersonalUserProfileProps = props;
			expect(typeof profileProps.billing).toBe('object');
			expect(profileProps.billing).toHaveProperty('paymentState');
		});
	});
});
