import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { PersonalUserAccountProps } from './personal-user-account.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makePersonalUserAccountProps(overrides?: Partial<PersonalUserAccountProps>): any {
	return {
		accountType: 'standard',
		email: 'test@example.com',
		username: 'testuser',
		profile: {
			firstName: 'Test',
			lastName: 'User',
			aboutMe: 'Test bio',
			location: {},
			billing: {},
		},
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a personal user account props object', () => {
			props = makePersonalUserAccountProps();
		});
	});

	Scenario('Personal user account type should be a string', ({ When, Then }) => {
		When('I access the accountType property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const accountProps: PersonalUserAccountProps = props;
			expect(typeof accountProps.accountType).toBe('string');
			expect(accountProps.accountType).toBe('standard');
		});
	});

	Scenario('Personal user account email should be a string', ({ When, Then }) => {

		When('I access the email property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const accountProps: PersonalUserAccountProps = props;
			expect(typeof accountProps.email).toBe('string');
			expect(accountProps.email).toBe('test@example.com');
		});
	});

	Scenario('Personal user account username should be a string', ({ When, Then }) => {

		When('I access the username property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const accountProps: PersonalUserAccountProps = props;
			expect(typeof accountProps.username).toBe('string');
			expect(accountProps.username).toBe('testuser');
		});
	});

	Scenario('Personal user account profile should be readonly', ({ When, Then }) => {

		When('I access the profile property', () => {
			// Access the property
		});

		Then('it should be an object', () => {
			const accountProps: PersonalUserAccountProps = props;
			expect(typeof accountProps.profile).toBe('object');
			expect(accountProps.profile).toHaveProperty('firstName');
			expect(accountProps.profile).toHaveProperty('lastName');
		});
	});
});
