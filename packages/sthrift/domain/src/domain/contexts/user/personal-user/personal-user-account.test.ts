import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccount } from './personal-user-account.ts';
import { PersonalUserProfile } from './personal-user-account-profile.ts';
import type { PersonalUserAccountProps } from './personal-user-account.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.aggregate.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-account.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeAccountProps(overrides?: Partial<PersonalUserAccountProps>): any {
	return {
		accountType: 'standard',
		email: 'test@example.com',
		username: 'testuser',
		profile: {
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
	Scenario('Account value object can be created with valid props', ({ Given, When, Then }) => {
		let props: PersonalUserAccountProps;
		let account: PersonalUserAccount;

		Given('I have account props with all fields', () => {
			props = makeAccountProps();
		});

		When('I create a PersonalUserAccount instance', () => {
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		Then('it should be created successfully', () => {
			expect(account).toBeDefined();
			expect(account).toBeInstanceOf(PersonalUserAccount);
		});
	});

	Scenario('Account accountType getter returns correct value', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;
		let value: string;

		Given('I have an account instance with accountType', () => {
			const props = makeAccountProps({ accountType: 'premium' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I access the accountType property', () => {
			value = account.accountType;
		});

		Then('it should return the correct accountType value', () => {
			expect(value).toBe('premium');
		});
	});

	Scenario('Account email getter returns correct value', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;
		let value: string;

		Given('I have an account instance with email', () => {
			const props = makeAccountProps({ email: 'user@example.com' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I access the email property', () => {
			value = account.email;
		});

		Then('it should return the correct email value', () => {
			expect(value).toBe('user@example.com');
		});
	});

	Scenario('Account username getter returns correct value', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;
		let value: string;

		Given('I have an account instance with username', () => {
			const props = makeAccountProps({ username: 'johndoe123' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I access the username property', () => {
			value = account.username;
		});

		Then('it should return the correct username value', () => {
			expect(value).toBe('johndoe123');
		});
	});

	Scenario('Account profile getter returns Profile value object', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;
		let profile: PersonalUserProfile;

		Given('I have an account instance with profile data', () => {
			const props = makeAccountProps();
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I access the profile property', () => {
			profile = account.profile;
		});

		Then('it should return a PersonalUserProfile instance', () => {
			expect(profile).toBeDefined();
			expect(profile).toBeInstanceOf(PersonalUserProfile);
			expect(profile.firstName).toBe('Test');
		});
	});

	Scenario('Account accountType setter requires valid visa', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;
		let error: Error | undefined;

		Given('I have an account instance with a restrictive visa', () => {
			const props = makeAccountProps();
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I attempt to set accountType without permission', () => {
			try {
				account.accountType = 'premium';
			} catch (e) {
				error = e as Error;
			}
		});

		Then('it should throw a PermissionError', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Unauthorized to set account details');
		});
	});

	Scenario('Account email setter works with valid visa', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;

		Given('I have an account instance with a permissive visa', () => {
			const props = makeAccountProps({ email: 'old@example.com' });
			const visa = createMockVisa(true) as UserVisa;
			const root = createMockRoot(false) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I set the email property', () => {
			account.email = 'new@example.com';
		});

		Then('the email should be updated', () => {
			expect(account.email).toBe('new@example.com');
		});
	});

	Scenario('Account allows setters when entity is new', ({ Given, When, Then }) => {
		let account: PersonalUserAccount;

		Given('I have an account instance for a new entity', () => {
			const props = makeAccountProps({ username: 'oldusername' });
			const visa = createMockVisa(false) as UserVisa;
			const root = createMockRoot(true) as PersonalUserAggregateRoot;
			account = new PersonalUserAccount(props, visa, root);
		});

		When('I set the username property', () => {
			account.username = 'newusername';
		});

		Then('the username should be updated without visa check', () => {
			expect(account.username).toBe('newusername');
		});
	});
});
