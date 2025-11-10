import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { PersonalUserProps } from './personal-user.entity.ts';
import { PersonalUser } from './personal-user.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.feature'),
);

function makePassport(canCreateUser = false): Passport {
	return vi.mocked({
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: (
					fn: (p: {
						isEditingOwnAccount: boolean;
						canCreateUser: boolean;
					}) => boolean,
				) => fn({ isEditingOwnAccount: true, canCreateUser }),
			})),
		},
	} as unknown as Passport);
}

function makeBaseProps(
	overrides: Partial<PersonalUserProps> = {},
): PersonalUserProps {
	return {
		userType: 'end-user',
		id: 'user-1',
		isBlocked: false,
		schemaVersion: '1.0.0',
		hasCompletedOnboarding: false,
		account: {
			accountType: 'standard',
			email: 'john@example.com',
			username: 'johndoe',
			profile: {
				firstName: 'John',
				lastName: 'Doe',
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
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let passport: Passport;
	let baseProps: PersonalUserProps;
	let user: PersonalUser<PersonalUserProps>;
	let newUser: PersonalUser<PersonalUserProps>;

	BeforeEachScenario(() => {
		passport = makePassport(true);
		baseProps = makeBaseProps();
		user = new PersonalUser(baseProps, passport);
		newUser = undefined as unknown as PersonalUser<PersonalUserProps>;
	});

	Background(({ Given, And }) => {
		Given('a valid Passport with user permissions', () => {
			passport = makePassport(true);
		});
		And('a valid UserVisa allowing account creation and self-editing', () => {
			// Already handled in makePassport
		});
		And(
			'base user properties with email "john@example.com", firstName "John", lastName "Doe"',
			() => {
				baseProps = makeBaseProps();
				user = new PersonalUser(baseProps, passport);
			},
		);
	});

	Scenario('Creating a new personal user instance', ({ When, Then, And }) => {
		When('I create a new PersonalUser aggregate using getNewInstance', () => {
			newUser = PersonalUser.getNewInstance(
				makeBaseProps(),
				passport,
				'john@example.com',
				'John',
				'Doe',
			);
		});
		Then('it should have correct email "john@example.com"', () => {
			expect(newUser.account.email).toBe('john@example.com');
		});
		And('firstName should be "John"', () => {
			expect(newUser.account.profile.firstName).toBe('John');
		});
		And('lastName should be "Doe"', () => {
			expect(newUser.account.profile.lastName).toBe('Doe');
		});
		And('isNew should be false after creation', () => {
			expect(newUser.isNew).toBe(false);
		});
		And('it should expose a valid PersonalUserAccount instance', () => {
			expect(newUser.account).toBeDefined();
			expect(newUser.account.email).toBe('john@example.com');
		});
	});

	Scenario(
		'Updating userType with valid permission',
		({ Given, And, When, Then }) => {
			Given('an existing PersonalUser aggregate', () => {
				passport = makePassport(true);
				user = new PersonalUser(makeBaseProps(), passport);
			});
			And('the user has permission to edit their account', () => {
				// Already handled in makePassport with isEditingOwnAccount: true
			});
			When('I set userType to "Sharer"', () => {
				user.userType = 'Sharer';
			});
			Then('userType should update successfully', () => {
				expect(user.userType).toBe('Sharer');
			});
		},
	);

	Scenario(
		'Blocking a user without permission',
		({ Given, And, When, Then }) => {
			let blockUserWithoutPermission: () => void;
			Given('an existing PersonalUser aggregate', () => {
				// Create user with no permission (by setting isEditingOwnAccount to false)
				passport = vi.mocked({
					user: {
						forPersonalUser: vi.fn(() => ({
							determineIf: () => false,
						})),
					},
				} as unknown as Passport);
				user = new PersonalUser(makeBaseProps(), passport);
			});
			And('the user lacks permission to edit their account', () => {
				// Already handled above with false permission
			});
			When('I attempt to set isBlocked to true', () => {
				blockUserWithoutPermission = () => {
					user.isBlocked = true;
				};
			});
			Then('it should throw a PermissionError', () => {
				expect(blockUserWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(blockUserWithoutPermission).throws(
					'Unauthorized to modify user',
				);
			});
		},
	);

	Scenario('Completing onboarding', ({ Given, When, Then }) => {
		Given('a PersonalUser that has not completed onboarding', () => {
			passport = makePassport(true);
			baseProps = makeBaseProps({ hasCompletedOnboarding: false });
			user = new PersonalUser(baseProps, passport);
		});
		When('I set hasCompletedOnboarding to true', () => {
			user.hasCompletedOnboarding = true;
		});
		Then('the property should update successfully', () => {
			expect(user.hasCompletedOnboarding).toBe(true);
		});
	});

	Scenario(
		'Attempting to complete onboarding twice',
		({ Given, When, Then }) => {
			let completeOnboardingAgain: () => void;
			Given('a PersonalUser that has already completed onboarding', () => {
				passport = makePassport(true);
				baseProps = makeBaseProps({ hasCompletedOnboarding: true });
				user = new PersonalUser(baseProps, passport);
			});
			When('I set hasCompletedOnboarding to true again', () => {
				completeOnboardingAgain = () => {
					user.hasCompletedOnboarding = true;
				};
			});
			Then('it should throw a PermissionError', () => {
				expect(completeOnboardingAgain).toThrow(DomainSeedwork.PermissionError);
				expect(completeOnboardingAgain).throws(
					'Users can only be onboarded once.',
				);
			});
		},
	);
});
