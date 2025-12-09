import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { PersonalUserAccountProfileLocationProps } from './personal-user-account-profile-location.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile-location.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makePersonalUserAccountProfileLocationProps(overrides?: Partial<PersonalUserAccountProfileLocationProps>): any {
	return {
		address1: '123 Main St',
		address2: 'Apt 4B',
		city: 'Test City',
		state: 'TS',
		country: 'Test Country',
		zipCode: '12345',
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a location props object', () => {
			props = makePersonalUserAccountProfileLocationProps();
		});
	});

	Scenario('Location address1 should be a string', ({ When, Then }) => {
		When('I access the address1 property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const locationProps: PersonalUserAccountProfileLocationProps = props;
			expect(typeof locationProps.address1).toBe('string');
			expect(locationProps.address1).toBe('123 Main St');
		});
	});

	Scenario('Location address2 can be string or null', ({ When, Then }) => {

		When('I access the address2 property', () => {
			// Access the property
		});

		Then('it should be null or a string', () => {
			const locationProps: PersonalUserAccountProfileLocationProps = props;
			expect(locationProps.address2 === null || typeof locationProps.address2 === 'string').toBe(true);
		});
	});

	Scenario('Location city should be a string', ({ When, Then }) => {

		When('I access the city property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const locationProps: PersonalUserAccountProfileLocationProps = props;
			expect(typeof locationProps.city).toBe('string');
			expect(locationProps.city).toBe('Test City');
		});
	});

	Scenario('Location state should be a string', ({ When, Then }) => {

		When('I access the state property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const locationProps: PersonalUserAccountProfileLocationProps = props;
			expect(typeof locationProps.state).toBe('string');
			expect(locationProps.state).toBe('TS');
		});
	});

	Scenario('Location country should be a string', ({ When, Then }) => {

		When('I access the country property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const locationProps: PersonalUserAccountProfileLocationProps = props;
			expect(typeof locationProps.country).toBe('string');
			expect(locationProps.country).toBe('Test Country');
		});
	});

	Scenario('Location zipCode should be a string', ({ When, Then }) => {

		When('I access the zipCode property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const locationProps: PersonalUserAccountProfileLocationProps = props;
			expect(typeof locationProps.zipCode).toBe('string');
			expect(locationProps.zipCode).toBe('12345');
		});
	});
});
