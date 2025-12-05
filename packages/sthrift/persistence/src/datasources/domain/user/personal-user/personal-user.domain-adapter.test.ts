import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { PersonalUserDomainAdapter } from './personal-user.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.domain-adapter.feature'),
);

function makeUserDoc(
	overrides: Partial<Models.User.PersonalUser> = {},
): Models.User.PersonalUser {
	const base = {
		id: new MongooseSeedwork.ObjectId(),
		userType: 'personal-users',
		isBlocked: false,
		hasCompletedOnboarding: false,
		account: {
			accountType: 'standard',
			email: 'test@example.com',
			username: 'testuser',
			profile: {
				firstName: 'Test',
				lastName: 'User',
				aboutMe: 'Hello',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Test City',
					state: 'TS',
					country: 'Testland',
					zipCode: '12345',
				},
				billing: {
					cybersourceCustomerId: null,
					subscription: {
						subscriptionId: 'sub-123',
						planCode: 'free',
						status: 'active',
						startDate: new Date('2024-01-01'),
					},
					transactions: [],
				},
			},
		},
		set(key: keyof Models.User.PersonalUser, value: unknown) {
			(this as Models.User.PersonalUser)[key] = value as never;
		},
		populate: vi.fn(function (this: Models.User.PersonalUser) {
			return this;
		}),
		...overrides,
	} as Models.User.PersonalUser;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.User.PersonalUser;
	let adapter: PersonalUserDomainAdapter;
	let result: unknown;

	BeforeEachScenario(() => {
		doc = makeUserDoc();
		vi.spyOn(doc, 'set');
		adapter = new PersonalUserDomainAdapter(doc);
		result = undefined;
	});

	Background(({ Given }) => {
		Given('a valid PersonalUser document', () => {
			doc = makeUserDoc();
			adapter = new PersonalUserDomainAdapter(doc);
		});
	});

	Scenario('Getting the userType property', ({ When, Then }) => {
		When('I get the userType property', () => {
			result = adapter.userType;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe('personal-users');
		});
	});

	Scenario('Setting the userType property', ({ When, Then }) => {
		When('I set the userType property to "Sharer"', () => {
			adapter.userType = 'Sharer';
		});
		Then('the document\'s userType should be "Sharer"', () => {
			expect(doc.userType).toBe('Sharer');
		});
	});

	Scenario('Getting the isBlocked property', ({ When, Then }) => {
		When('I get the isBlocked property', () => {
			result = adapter.isBlocked;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Setting the isBlocked property', ({ When, Then }) => {
		When('I set the isBlocked property to true', () => {
			adapter.isBlocked = true;
		});
		Then("the document's isBlocked should be true", () => {
			expect(doc.isBlocked).toBe(true);
		});
	});

	Scenario('Getting the account property', ({ When, Then }) => {
		When('I get the account property', () => {
			result = adapter.account;
		});
		Then(
			'it should return a PersonalUserAccountDomainAdapter with the correct data',
			() => {
				expect(result).toBeDefined();
				expect((result as { email: string }).email).toBe('test@example.com');
			},
		);
	});

	Scenario('Getting the hasCompletedOnboarding property', ({ When, Then }) => {
		When('I get the hasCompletedOnboarding property', () => {
			result = adapter.hasCompletedOnboarding;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Setting the hasCompletedOnboarding property', ({ When, Then }) => {
		When('I set the hasCompletedOnboarding property to true', () => {
			adapter.hasCompletedOnboarding = true;
		});
		Then("the document's hasCompletedOnboarding should be true", () => {
			expect(doc.hasCompletedOnboarding).toBe(true);
		});
	});

	Scenario('Getting account when not initialized', ({ When, Then }) => {
		When('the document account is undefined', () => {
			doc.account = undefined as never;
		});

		Then('getting account should initialize it with empty object', () => {
			const account = adapter.account;
			expect(account).toBeDefined();
			expect(doc.account).toEqual({});
		});
	});

	Scenario('Accessing account profile property', ({ When, Then, And }) => {
		When('I access the account profile property', () => {
			result = adapter.account.profile;
		});

		Then('it should return a PersonalUserAccountProfileDomainAdapter', () => {
			expect(result).toBeDefined();
		});

		And('the profile should have firstName and lastName', () => {
			expect((result as { firstName: string }).firstName).toBe('Test');
		});
	});

	Scenario('Accessing profile location property', ({ When, Then, And }) => {
		When('I access the profile location property', () => {
			result = adapter.account.profile.location;
		});

		Then('it should return a PersonalUserAccountProfileLocationDomainAdapter', () => {
			expect(result).toBeDefined();
		});

		And('the location should have address and city', () => {
			expect((result as { address1: string }).address1).toBe('123 Main St');
			expect((result as { city: string }).city).toBe('Test City');
		});
	});

	Scenario('Accessing profile billing property', ({ When, Then, And }) => {
		When('I access the profile billing property', () => {
			result = adapter.account.profile.billing;
		});

		Then('it should return a PersonalUserAccountProfileBillingDomainAdapter', () => {
			expect(result).toBeDefined();
		});

		And('the billing should have subscription data', () => {
			expect((result as { subscription: { subscriptionId: string } }).subscription).toBeDefined();
			expect((result as { subscription: { subscriptionId: string } }).subscription.subscriptionId).toBe('sub-123');
		});
	});

	Scenario('Setting account email through adapter', ({ When, Then }) => {
		When('I set the account email to "newemail@test.com"', () => {
			adapter.account.email = 'newemail@test.com';
		});

		Then('the account email should be "newemail@test.com"', () => {
			expect(adapter.account.email).toBe('newemail@test.com');
		});
	});

	Scenario('Setting account username through adapter', ({ When, Then }) => {
		When('I set the account username to "newusername"', () => {
			adapter.account.username = 'newusername';
		});

		Then('the account username should be "newusername"', () => {
			expect(adapter.account.username).toBe('newusername');
		});
	});

	Scenario('Setting profile firstName through adapter', ({ When, Then }) => {
		When('I set the profile firstName to "John"', () => {
			adapter.account.profile.firstName = 'John';
		});

		Then('the profile firstName should be "John"', () => {
			expect(adapter.account.profile.firstName).toBe('John');
		});
	});

	Scenario('Setting profile lastName through adapter', ({ When, Then }) => {
		When('I set the profile lastName to "Doe"', () => {
			adapter.account.profile.lastName = 'Doe';
		});

		Then('the profile lastName should be "Doe"', () => {
			expect(adapter.account.profile.lastName).toBe('Doe');
		});
	});

	Scenario('Setting profile location address through adapter', ({ When, Then }) => {
		When('I set the profile location address1 to "456 New St"', () => {
			adapter.account.profile.location.address1 = '456 New St';
		});

		Then('the profile location address1 should be "456 New St"', () => {
			expect(adapter.account.profile.location.address1).toBe('456 New St');
		});
	});

	Scenario('Setting profile billing subscription data', ({ When, Then }) => {
		When('I set the profile billing subscription subscriptionId to "sub-active-123"', () => {
			adapter.account.profile.billing.subscription.subscriptionId = 'sub-active-123';
		});

		Then('the profile billing subscription subscriptionId should be "sub-active-123"', () => {
			expect(adapter.account.profile.billing.subscription.subscriptionId).toBe('sub-active-123');
		});
	});

	Scenario('Getting profile when not initialized', ({ When, Then }) => {
		When('the account profile is undefined', () => {
			doc.account.profile = undefined as never;
		});

		Then('getting profile should initialize it with empty object', () => {
			const profile = adapter.account.profile;
			expect(profile).toBeDefined();
		});
	});

	Scenario('Getting location when not initialized', ({ When, Then }) => {
		When('the profile location is undefined', () => {
			doc.account.profile.location = undefined as never;
		});

		Then('getting location should initialize it with empty object', () => {
			const location = adapter.account.profile.location;
			expect(location).toBeDefined();
		});
	});

	Scenario('Getting billing when not initialized', ({ When, Then }) => {
		When('the profile billing is undefined', () => {
			doc.account.profile.billing = undefined as never;
		});

		Then('getting billing should initialize it with empty object', () => {
			const billing = adapter.account.profile.billing;
			expect(billing).toBeDefined();
		});
	});
});
