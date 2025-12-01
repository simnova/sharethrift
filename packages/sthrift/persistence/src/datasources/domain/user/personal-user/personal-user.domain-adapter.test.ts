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
					subscriptionId: null,
					cybersourceCustomerId: null,
					paymentState: '',
					lastTransactionId: null,
					lastPaymentAmount: null,
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
});
