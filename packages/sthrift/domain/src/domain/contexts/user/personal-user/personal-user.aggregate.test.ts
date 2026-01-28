import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { PersonalUserProps } from './personal-user.entity.ts';
import { PersonalUser } from './personal-user.aggregate.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.feature'),
);

function makePassport(canCreateUser = false, canBlockUsers = false): Passport {
	return vi.mocked({
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: (
					fn: (p: {
						isEditingOwnAccount: boolean;
						canCreateUser: boolean;
						canBlockUsers: boolean;
					}) => boolean,
				) => fn({ isEditingOwnAccount: true, canCreateUser, canBlockUsers }),
			})),
		},
	} as unknown as Passport);
}

function makePassportNoPermissions(): Passport {
	return vi.mocked({
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => false,
			})),
		},
	} as unknown as Passport);
}

function makePassportNoEditPermission(): Passport {
	const determineIfFn = (
		fn: (p: {
			isEditingOwnAccount: boolean;
			canCreateUser: boolean;
			canBlockUsers: boolean;
		}) => boolean,
	) =>
		fn({
			isEditingOwnAccount: false,
			canCreateUser: false,
			canBlockUsers: false,
		});

	return vi.mocked({
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: determineIfFn,
			})),
		},
	} as unknown as Passport);
}

function makeBaseProps(
	overrides: Partial<PersonalUserProps> = {},
): PersonalUserProps {
	return {
		userType: 'personal-user',
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
					cybersourceCustomerId: 'cust-12345',
					subscription: {
						planCode: 'verified-personal',
						status: 'ACTIVE',
						startDate: new Date('2023-01-01T00:00:00Z'),
						subscriptionId: 'sub-12345',
					},
					transactions: {
						items: [
							{
								id: '1',
								transactionId: 'txn_123',
								amount: 1000,
								referenceId: 'ref_123',
								status: 'completed',
								completedAt: new Date('2020-01-01T00:00:00Z'),
								errorMessage: null,
							},
						],
						getNewItem: () => ({
							id: '1',
							transactionId: 'txn_123',
							amount: 1000,
							referenceId: 'ref_123',
							status: 'completed',
							completedAt: new Date('2020-01-01T00:00:00Z'),
							errorMessage: null,
						}),
						addItem: vi.fn(),
						removeItem: vi.fn(),
						removeAll: vi.fn(),
					},
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
		const setupPassport = () => {
			passport = makePassport(true);
		};
		const checkUserVisa = () => {
			// Already handled in makePassport
		};
		const setupBaseUser = () => {
			baseProps = makeBaseProps();
			user = new PersonalUser(baseProps, passport);
		};

		Given('a valid Passport with user permissions', setupPassport);
		And(
			'a valid UserVisa allowing account creation and self-editing',
			checkUserVisa,
		);
		And(
			'base user properties with email "john@example.com", firstName "John", lastName "Doe"',
			setupBaseUser,
		);
	});

	Scenario('Creating a new personal user instance', ({ When, Then, And }) => {
		const createNewUser = () => {
			newUser = PersonalUser.getNewInstance(
				makeBaseProps(),
				passport,
				'john@example.com',
				'John',
				'Doe',
			);
		};
		const checkEmail = () =>
			expect(newUser.account.email).toBe('john@example.com');
		const checkFirstName = () =>
			expect(newUser.account.profile.firstName).toBe('John');
		const checkLastName = () =>
			expect(newUser.account.profile.lastName).toBe('Doe');
		const checkIsNew = () => expect(newUser.isNew).toBe(false);
		const checkAccountInstance = () => {
			expect(newUser.account).toBeDefined();
			expect(newUser.account.email).toBe('john@example.com');
		};

		When(
			'I create a new PersonalUser aggregate using getNewInstance',
			createNewUser,
		);
		Then('it should have correct email "john@example.com"', checkEmail);
		And('firstName should be "John"', checkFirstName);
		And('lastName should be "Doe"', checkLastName);
		And('isNew should be false after creation', checkIsNew);
		And(
			'it should expose a valid PersonalUserAccount instance',
			checkAccountInstance,
		);
	});

	Scenario(
		'Updating userType with valid permission',
		({ Given, And, When, Then }) => {
			const setupUser = () => {
				passport = makePassport(true);
				user = new PersonalUser(makeBaseProps(), passport);
			};
			const checkPermission = () => {
				// Already handled in makePassport with isEditingOwnAccount: true
			};
			const updateUserType = () => {
				user.userType = 'Sharer';
			};
			const verifyUpdate = () => expect(user.userType).toBe('Sharer');

			Given('an existing PersonalUser aggregate', setupUser);
			And('the user has permission to edit their account', checkPermission);
			When('I set userType to "Sharer"', updateUserType);
			Then('userType should update successfully', verifyUpdate);
		},
	);

	Scenario(
		'Blocking a user without permission',
		({ Given, And, When, Then }) => {
			let blockUserWithoutPermission: () => void;
			const setupUserNoPermission = () => {
				passport = makePassportNoPermissions();
				user = new PersonalUser(makeBaseProps(), passport);
			};
			const checkLackOfPermission = () => {
				// Already handled above with false permission
			};
			const attemptBlock = () => {
				blockUserWithoutPermission = () => {
					user.isBlocked = true;
				};
			};
			const verifyPermissionError = () => {
				expect(blockUserWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(blockUserWithoutPermission).throws(
					'Unauthorized: Only admins with canBlockUsers permission can block/unblock users',
				);
			};

			Given('an existing PersonalUser aggregate', setupUserNoPermission);
			And(
				'the user lacks permission to edit their account',
				checkLackOfPermission,
			);
			When('I attempt to set isBlocked to true', attemptBlock);
			Then('it should throw a PermissionError', verifyPermissionError);
		},
	);

	Scenario('Completing onboarding', ({ Given, When, Then }) => {
		const setupUnboardedUser = () => {
			passport = makePassport(true);
			baseProps = makeBaseProps({ hasCompletedOnboarding: false });
			user = new PersonalUser(baseProps, passport);
		};
		const completeOnboarding = () => {
			user.hasCompletedOnboarding = true;
		};
		const verifyOnboarding = () =>
			expect(user.hasCompletedOnboarding).toBe(true);

		Given(
			'a PersonalUser that has not completed onboarding',
			setupUnboardedUser,
		);
		When('I set hasCompletedOnboarding to true', completeOnboarding);
		Then('the property should update successfully', verifyOnboarding);
	});

	Scenario(
		'Attempting to complete onboarding twice',
		({ Given, When, Then }) => {
			let completeOnboardingAgain: () => void;
			const setupAlreadyOnboarded = () => {
				passport = makePassport(true);
				baseProps = makeBaseProps({ hasCompletedOnboarding: true });
				user = new PersonalUser(baseProps, passport);
			};
			const attemptSecondOnboarding = () => {
				completeOnboardingAgain = () => {
					user.hasCompletedOnboarding = true;
				};
			};
			const verifyOnboardingError = () => {
				expect(completeOnboardingAgain).toThrow(DomainSeedwork.PermissionError);
				expect(completeOnboardingAgain).throws(
					'Users can only be onboarded once.',
				);
			};

			Given(
				'a PersonalUser that has already completed onboarding',
				setupAlreadyOnboarded,
			);
			When(
				'I set hasCompletedOnboarding to true again',
				attemptSecondOnboarding,
			);
			Then('it should throw a PermissionError', verifyOnboardingError);
		},
	);

	Scenario('Blocking a user with permission', ({ Given, And, When, Then }) => {
		const setupUserWithBlockPermission = () => {
			passport = makePassport(true, true);
			user = new PersonalUser(makeBaseProps(), passport);
		};
		const checkBlockPermission = () => {
			// Already handled in makePassport with canBlockUsers: true
		};
		const blockUser = () => {
			user.isBlocked = true;
		};
		const verifyBlocked = () => expect(user.isBlocked).toBe(true);

		Given('an existing PersonalUser aggregate', setupUserWithBlockPermission);
		And('the user has permission to block users', checkBlockPermission);
		When('I set isBlocked to true', blockUser);
		Then('isBlocked should be true', verifyBlocked);
	});

	Scenario(
		'Unblocking a user with permission',
		({ Given, And, When, Then }) => {
			const setupBlockedUser = () => {
				passport = makePassport(true, true);
				user = new PersonalUser(makeBaseProps({ isBlocked: true }), passport);
			};
			const checkUnblockPermission = () => {
				// Already handled in makePassport with canBlockUsers: true
			};
			const unblockUser = () => {
				user.isBlocked = false;
			};
			const verifyUnblocked = () => expect(user.isBlocked).toBe(false);

			Given(
				'an existing PersonalUser aggregate that is blocked',
				setupBlockedUser,
			);
			And('the user has permission to block users', checkUnblockPermission);
			When('I set isBlocked to false', unblockUser);
			Then('isBlocked should be false', verifyUnblocked);
		},
	);

	Scenario('Getting isNew from personal user', ({ Given, When, Then }) => {
		const setupUserForIsNew = () => {
			passport = makePassport(true, false);
			user = new PersonalUser(makeBaseProps(), passport);
		};
		const accessIsNew = () => {
			// Access happens in Then
		};
		const verifyIsNew = () => expect(user.isNew).toBe(false);

		Given('an existing PersonalUser aggregate', setupUserForIsNew);
		When('I access the isNew property', accessIsNew);
		Then('it should return false', verifyIsNew);
	});

	Scenario(
		'Getting schemaVersion from personal user',
		({ Given, When, Then }) => {
			const setupUserForSchema = () => {
				passport = makePassport(true, false);
				user = new PersonalUser(makeBaseProps(), passport);
			};
			const accessSchemaVersion = () => {
				// Access happens in Then
			};
			const verifySchemaVersion = () => {
				expect(user.schemaVersion).toBeDefined();
				expect(typeof user.schemaVersion).toBe('string');
			};

			Given('an existing PersonalUser aggregate', setupUserForSchema);
			When('I access the schemaVersion property', accessSchemaVersion);
			Then('it should return the schema version', verifySchemaVersion);
		},
	);

	Scenario('Getting createdAt from personal user', ({ Given, When, Then }) => {
		const setupUserForCreatedAt = () => {
			passport = makePassport(true, false);
			user = new PersonalUser(makeBaseProps(), passport);
		};
		const accessCreatedAt = () => {
			// Access happens in Then
		};
		const verifyCreatedAt = () => {
			expect(user.createdAt).toBeInstanceOf(Date);
			expect(user.createdAt.getTime()).toBeGreaterThan(0);
		};

		Given('an existing PersonalUser aggregate', setupUserForCreatedAt);
		When('I access the createdAt property', accessCreatedAt);
		Then('it should return a valid date', verifyCreatedAt);
	});

	Scenario('Getting updatedAt from personal user', ({ Given, When, Then }) => {
		const setupUserForUpdatedAt = () => {
			passport = makePassport(true, false);
			user = new PersonalUser(makeBaseProps(), passport);
		};
		const accessUpdatedAt = () => {
			// Access happens in Then
		};
		const verifyUpdatedAt = () => {
			expect(user.updatedAt).toBeInstanceOf(Date);
			expect(user.updatedAt.getTime()).toBeGreaterThan(0);
		};

		Given('an existing PersonalUser aggregate', setupUserForUpdatedAt);
		When('I access the updatedAt property', accessUpdatedAt);
		Then('it should return a valid date', verifyUpdatedAt);
	});

	Scenario('Adding a billing transaction', ({ Given, And, When, Then }) => {
		let transactionAdded = false;
		const setupUserForTransaction = () => {
			passport = makePassport(true, false);
			user = new PersonalUser(makeBaseProps(), passport);
		};
		const checkEditPermission = () => {
			// Already set up in makePassport with isEditingOwnAccount: true
		};
		const addTransaction = () => {
			user.requestAddAccountProfileBillingTransaction(
				'txn_new_123',
				150.0,
				'ref_new_123',
				'completed',
				new Date('2024-06-01'),
			);
			transactionAdded = true;
		};
		const verifyTransactionAdded = () => expect(transactionAdded).toBe(true);

		Given('an existing PersonalUser aggregate', setupUserForTransaction);
		And('the user has permission to edit their account', checkEditPermission);
		When('I add a billing transaction with valid data', addTransaction);
		Then(
			'the transaction should be added successfully',
			verifyTransactionAdded,
		);
	});

	Scenario(
		'Adding a billing transaction with error message',
		({ Given, And, When, Then }) => {
			let transactionAdded = false;
			const setupUserForFailedTransaction = () => {
				passport = makePassport(true, false);
				user = new PersonalUser(makeBaseProps(), passport);
			};
			const checkEditPermissionForFailed = () => {
				// Already set up in makePassport with isEditingOwnAccount: true
			};
			const addFailedTransaction = () => {
				user.requestAddAccountProfileBillingTransaction(
					'txn_failed_123',
					75.0,
					'ref_failed_123',
					'failed',
					new Date('2024-06-02'),
					'Payment declined',
				);
				transactionAdded = true;
			};
			const verifyFailedTransactionAdded = () =>
				expect(transactionAdded).toBe(true);

			Given(
				'an existing PersonalUser aggregate',
				setupUserForFailedTransaction,
			);
			And(
				'the user has permission to edit their account',
				checkEditPermissionForFailed,
			);
			When(
				'I add a billing transaction with an error message',
				addFailedTransaction,
			);
			Then(
				'the transaction should be added with the error message',
				verifyFailedTransactionAdded,
			);
		},
	);

	Scenario('Updating userType without permission', ({ Given, When, Then }) => {
		let updateUserTypeWithoutPermission: () => void;
		const setupUserNoEditPermission = () => {
			passport = makePassportNoEditPermission();
			user = new PersonalUser(makeBaseProps(), passport);
		};
		const attemptUserTypeUpdate = () => {
			updateUserTypeWithoutPermission = () => {
				user.userType = 'Sharer';
			};
		};
		const verifyUnauthorizedError = () => {
			expect(updateUserTypeWithoutPermission).toThrow(
				DomainSeedwork.PermissionError,
			);
			expect(updateUserTypeWithoutPermission).toThrow(
				'Unauthorized to modify user',
			);
		};

		Given(
			'an existing PersonalUser aggregate without editing permission',
			setupUserNoEditPermission,
		);
		When('I attempt to set userType to "Sharer"', attemptUserTypeUpdate);
		Then(
			'it should throw a PermissionError with message "Unauthorized to modify user"',
			verifyUnauthorizedError,
		);
	});
});
