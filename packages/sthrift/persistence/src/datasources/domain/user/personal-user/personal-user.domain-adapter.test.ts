import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { PersonalUserRoleDomainAdapter } from '../../role/personal-user-role/personal-user-role.domain-adapter.ts';
import { PersonalUserDomainAdapter } from './personal-user.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.domain-adapter.feature'),
);

function makeRoleDoc(
	overrides: Partial<Models.Role.PersonalUserRole> = {},
): Models.Role.PersonalUserRole {
	return {
		id: new MongooseSeedwork.ObjectId(),
		...overrides,
	} as Models.Role.PersonalUserRole;
}

function makeUserDoc(
	overrides: Partial<Models.User.PersonalUser> = {},
): Models.User.PersonalUser {
	const base = {
		id: new MongooseSeedwork.ObjectId(),
		userType: 'end-user',
		isBlocked: false,
		hasCompletedOnboarding: false,
		role: null,
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
	let roleDoc: Models.Role.PersonalUserRole;
	let result: unknown;

	BeforeEachScenario(() => {
		roleDoc = makeRoleDoc();
		doc = makeUserDoc({ role: roleDoc });
		adapter = new PersonalUserDomainAdapter(doc);
		result = undefined;
	});

	Background(({ Given }) => {
		Given('a valid PersonalUser document with populated role', () => {
			roleDoc = makeRoleDoc();
			doc = makeUserDoc({ role: roleDoc });
			adapter = new PersonalUserDomainAdapter(doc);
		});
	});

	Scenario('Getting the userType property', ({ When, Then }) => {
		When('I get the userType property', () => {
			result = adapter.userType;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe('end-user');
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

	Scenario('Getting the role property when populated', ({ When, Then }) => {
		When('I get the role property', () => {
			result = adapter.role;
		});
		Then(
			'it should return a PersonalUserRoleDomainAdapter with the correct doc',
			() => {
				expect(result).toBeInstanceOf(PersonalUserRoleDomainAdapter);
				expect((result as PersonalUserRoleDomainAdapter).doc).toBe(roleDoc);
			},
		);
	});

	Scenario('Getting the role property when not populated', ({ When, Then }) => {
		When('I get the role property on a doc with no role', () => {
			doc = makeUserDoc({ role: undefined });
			adapter = new PersonalUserDomainAdapter(doc);
		});
		Then('an error should be thrown indicating role is not populated', () => {
			expect(() => adapter.role).toThrow(/role is not populated/);
		});
	});

	Scenario(
		'Getting the role property when it is an ObjectId',
		({ When, Then }) => {
			const roleId = new MongooseSeedwork.ObjectId();

			When('I get the role property on a doc with role as ObjectId', () => {
				doc = makeUserDoc({ role: roleId });
				adapter = new PersonalUserDomainAdapter(doc);
			});
			Then(
				'it should return a PersonalUserRoleEntityReference with the correct id',
				() => {
					expect(adapter.role.id).toBe(roleId.toString());
				},
			);
		},
	);

	Scenario('Setting the role property', ({ When, Then }) => {
		let roleAdapter: PersonalUserRoleDomainAdapter;
		When(
			'I set the role property to a valid PersonalUserRoleDomainAdapter',
			() => {
				roleAdapter = new PersonalUserRoleDomainAdapter(roleDoc);
				adapter.role = roleAdapter;
			},
		);
		Then("the document's role should be set to the role doc", () => {
			expect(doc.role).toBe(roleAdapter.doc);
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
