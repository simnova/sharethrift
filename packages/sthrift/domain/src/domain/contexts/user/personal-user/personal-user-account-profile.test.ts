import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserProfile } from './personal-user-account-profile.ts';
import { PersonalUserAccountProfileLocation } from './personal-user-account-profile-location.ts';
import { PersonalUserAccountProfileBilling } from './personal-user-account-profile-billing.ts';
import type { PersonalUserProfileProps } from './personal-user-account-profile.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account-profile.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeProfileProps(overrides?: Partial<PersonalUserProfileProps>): any {
	return {
		firstName: 'John',
		lastName: 'Doe',
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

// biome-ignore lint/suspicious/noExplicitAny: Test mock
function createMockVisa(canEdit: boolean): any {
	return {
		determineIf: (fn: (permissions: { isEditingOwnAccount: boolean }) => boolean) =>
			fn({ isEditingOwnAccount: canEdit }),
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Test mock
function createMockRoot(isNew: boolean): any {
	return { isNew };
}

test.for(feature, ({ Scenario }) => {
	Scenario('Profile value object can be created with valid props', ({ Given, When, Then }) => {
		let props: PersonalUserProfileProps;
		let profile: PersonalUserProfile;

		Given('I have profile props with all fields', () => {
			props = makeProfileProps();
		});

		When('I create a PersonalUserProfile instance', () => {
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		Then('it should be created successfully', () => {
			expect(profile).toBeDefined();
			expect(profile).toBeInstanceOf(PersonalUserProfile);
		});
	});

	Scenario('Profile firstName getter returns correct value', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;
		let value: string;

		Given('I have a profile instance with firstName', () => {
			const props = makeProfileProps({ firstName: 'Alice' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I access the firstName property', () => {
			value = profile.firstName;
		});

		Then('it should return the correct firstName value', () => {
			expect(value).toBe('Alice');
		});
	});

	Scenario('Profile lastName getter returns correct value', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;
		let value: string;

		Given('I have a profile instance with lastName', () => {
			const props = makeProfileProps({ lastName: 'Smith' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I access the lastName property', () => {
			value = profile.lastName;
		});

		Then('it should return the correct lastName value', () => {
			expect(value).toBe('Smith');
		});
	});

	Scenario('Profile aboutMe getter returns correct value', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;
		let value: string;

		Given('I have a profile instance with aboutMe', () => {
			const props = makeProfileProps({ aboutMe: 'Software developer' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I access the aboutMe property', () => {
			value = profile.aboutMe;
		});

		Then('it should return the correct aboutMe value', () => {
			expect(value).toBe('Software developer');
		});
	});

	Scenario('Profile location getter returns Location value object', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;
		let location: PersonalUserAccountProfileLocation;

		Given('I have a profile instance with location data', () => {
			const props = makeProfileProps();
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I access the location property', () => {
			location = profile.location;
		});

		Then('it should return a PersonalUserAccountProfileLocation instance', () => {
			expect(location).toBeDefined();
			expect(location).toBeInstanceOf(PersonalUserAccountProfileLocation);
			expect(location.city).toBe('Test City');
		});
	});

	Scenario('Profile billing getter returns Billing value object', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;
		let billing: PersonalUserAccountProfileBilling;

		Given('I have a profile instance with billing data', () => {
			const props = makeProfileProps();
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I access the billing property', () => {
			billing = profile.billing;
		});

		Then('it should return a PersonalUserAccountProfileBilling instance', () => {
			expect(billing).toBeDefined();
			expect(billing).toBeInstanceOf(PersonalUserAccountProfileBilling);
			expect(billing.paymentState).toBe('none');
		});
	});

	Scenario('Profile firstName setter requires valid visa', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;
		let error: Error | undefined;

		Given('I have a profile instance with a restrictive visa', () => {
			const props = makeProfileProps();
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I attempt to set firstName without permission', () => {
			try {
				profile.firstName = 'NewName';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set account profile details');
		});
	});

	Scenario('Profile firstName setter works with valid visa', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;

		Given('I have a profile instance with a permissive visa', () => {
			const props = makeProfileProps({ firstName: 'OldName' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I set the firstName property', () => {
			profile.firstName = 'NewName';
		});

		Then('the firstName should be updated', () => {
			expect(profile.firstName).toBe('NewName');
		});
	});

	Scenario('Profile allows setters when entity is new', ({ Given, When, Then }) => {
		let profile: PersonalUserProfile;

		Given('I have a profile instance for a new entity', () => {
			const props = makeProfileProps({ lastName: 'OldLastName' });
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(true) as PersonalUserAggregateRoot;
			profile = new PersonalUserProfile(props, visa, root);
		});

		When('I set the lastName property', () => {
			profile.lastName = 'NewLastName';
		});

		Then('the lastName should be updated without visa check', () => {
			expect(profile.lastName).toBe('NewLastName');
		});
	});
});
