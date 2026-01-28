import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { AdminUserProps } from './admin-user.entity.ts';
import { AdminUser } from './admin-user.aggregate.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.feature'),
);

function makePassport(
	canManageUserRoles = false,
	canBlockUsers = false,
): Passport {
	return vi.mocked({
		user: {
			forAdminUser: vi.fn(() => ({
				determineIf: (
					fn: (p: {
						isEditingOwnAccount: boolean;
						canManageUserRoles: boolean;
						canBlockUsers: boolean;
					}) => boolean,
				) =>
					fn({
						isEditingOwnAccount: true,
						canManageUserRoles,
						canBlockUsers,
					}),
			})),
			forAdminRole: vi.fn(() => ({
				determineIf: (fn: (p: { canManageUserRoles: boolean }) => boolean) =>
					fn({ canManageUserRoles }),
			})),
		},
	} as unknown as Passport);
}

function makeRole() {
	return vi.mocked({
		id: 'role-1',
		roleName: 'Admin',
		isDefault: false,
		roleType: 'admin-roles',
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		permissions: {
			userPermissions: {
				canBlockUsers: true,
				canViewAllUsers: true,
				canEditUsers: true,
				canDeleteUsers: true,
				canManageUserRoles: true,
				canAccessAnalytics: true,
				canManageRoles: true,
				canViewReports: true,
				canDeleteContent: true,
			},
			conversationPermissions: {
				canViewAllConversations: true,
				canEditConversations: true,
				canDeleteConversations: true,
				canCloseConversations: true,
				canModerateConversations: true,
			},
			listingPermissions: {
				canViewAllListings: true,
				canManageAllListings: true,
				canEditListings: true,
				canDeleteListings: true,
				canApproveListings: true,
				canRejectListings: true,
				canBlockListings: true,
				canUnblockListings: true,
				canModerateListings: true,
			},
			reservationRequestPermissions: {
				canViewAllReservations: true,
				canApproveReservations: true,
				canRejectReservations: true,
				canCancelReservations: true,
				canEditReservations: true,
				canModerateReservations: true,
			},
		},
	} as const);
}

function makeBaseProps(
	overrides: Partial<AdminUserProps> = {},
): AdminUserProps {
	return {
		userType: 'admin-users',
		id: 'admin-user-1',
		isBlocked: false,
		schemaVersion: '1.0.0',
		account: {
			accountType: 'admin-accounts',
			email: 'admin@example.com',
			username: 'adminuser',
			profile: {
				firstName: 'Admin',
				lastName: 'User',
				aboutMe: 'Admin user bio',
				location: {
					address1: '123 Admin St',
					address2: null,
					city: 'Admin City',
					state: 'CA',
					country: 'USA',
					zipCode: '90210',
				},
			},
		},
		role: makeRole(),
		loadRole: async () => makeRole(),
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let passport: Passport;
	let baseProps: AdminUserProps;
	let user: AdminUser<AdminUserProps>;
	let newUser: AdminUser<AdminUserProps>;

	BeforeEachScenario(() => {
		passport = makePassport(true, true);
		baseProps = makeBaseProps();
		user = new AdminUser(baseProps, passport);
		newUser = undefined as unknown as AdminUser<AdminUserProps>;
	});

	Background(({ Given, And }) => {
		Given('a valid Passport with admin permissions', () => {
			passport = makePassport(true, true);
		});
		And('a valid UserVisa allowing account creation and self-editing', () => {
			// Already handled in makePassport
		});
		And(
			'base admin user properties with email "admin@example.com", firstName "Admin", lastName "User"',
			() => {
				baseProps = makeBaseProps();
				user = new AdminUser(baseProps, passport);
			},
		);
	});

	Scenario('Creating a new admin user instance', ({ When, Then, And }) => {
		const createNewUser = () => {
			newUser = AdminUser.getNewInstance(
				makeBaseProps(),
				passport,
				'admin@example.com',
				'adminuser',
				'Admin',
				'User',
			);
		};
		const checkEmail = () =>
			expect(newUser.account.email).toBe('admin@example.com');
		const checkUsername = () =>
			expect(newUser.account.username).toBe('adminuser');
		const checkFirstName = () =>
			expect(newUser.account.profile.firstName).toBe('Admin');
		const checkLastName = () =>
			expect(newUser.account.profile.lastName).toBe('User');
		const checkIsNew = () => expect(newUser.isNew).toBe(false);
		const checkAccountInstance = () => {
			expect(newUser.account).toBeDefined();
			expect(newUser.account.email).toBe('admin@example.com');
		};

		When(
			'I create a new AdminUser aggregate using getNewInstance',
			createNewUser,
		);
		Then('it should have correct email "admin@example.com"', checkEmail);
		And('username should be "adminuser"', checkUsername);
		And('firstName should be "Admin"', checkFirstName);
		And('lastName should be "User"', checkLastName);
		And('isNew should be false after creation', checkIsNew);
		And(
			'it should expose a valid AdminUserAccount instance',
			checkAccountInstance,
		);
	});

	Scenario(
		'Updating userType with valid permission',
		({ Given, And, When, Then }) => {
			const setupUser = () => {
				passport = makePassport(true, true);
				user = new AdminUser(makeBaseProps(), passport);
			};
			const checkPermission = () => {
				// Already handled in makePassport with isEditingOwnAccount: true
			};
			const updateUserType = () => {
				user.userType = 'SuperAdmin';
			};
			const verifyUpdate = () => expect(user.userType).toBe('SuperAdmin');

			Given('an existing AdminUser aggregate', setupUser);
			And('the user has permission to edit their account', checkPermission);
			When('I set userType to "SuperAdmin"', updateUserType);
			Then('userType should update successfully', verifyUpdate);
		},
	);

	Scenario(
		'Blocking an admin user without permission',
		({ Given, And, When, Then }) => {
			let blockUserWithoutPermission: () => void;
			const setupUserWithoutPermission = () => {
				// Create user with no block permission
				passport = makePassport(false, false);
				user = new AdminUser(makeBaseProps(), passport);
			};
			const checkLackOfPermission = () => {
				// Already handled above with canBlockUsers: false
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
					'Unauthorized: Only admins with canBlockUsers permission can block/unblock admin users',
				);
			};

			Given('an existing AdminUser aggregate', setupUserWithoutPermission);
			And('the user lacks permission to block users', checkLackOfPermission);
			When('I attempt to set isBlocked to true', attemptBlock);
			Then('it should throw a PermissionError', verifyPermissionError);
		},
	);

	Scenario(
		'Changing admin user role with permission',
		({ Given, And, When, Then }) => {
			const setupUserWithRole = () => {
				passport = makePassport(true, true);
				user = new AdminUser(makeBaseProps(), passport);
			};
			const checkManageRolePermission = () => {
				// Already handled in makePassport with canManageUserRoles: true
			};
			const accessRoleProperty = () => {
				// Just accessing the property
			};
			const verifyRole = () => {
				expect(user.role).toBeDefined();
				expect(user.role.id).toBe('role-1');
			};

			Given('an existing AdminUser aggregate', setupUserWithRole);
			And(
				'the user has permission to manage user roles',
				checkManageRolePermission,
			);
			When('I access the role property', accessRoleProperty);
			Then('it should return the current role', verifyRole);
		},
	);

	Scenario(
		'Attempting to change role without permission',
		({ Given, And, When, Then }) => {
			let changeRoleWithoutPermission: () => void;
			const setupUserNoRolePermission = () => {
				// Create user with no role management permission
				passport = makePassport(false, false);
				baseProps = makeBaseProps();
				user = new AdminUser(baseProps, passport);
			};
			const checkLackOfRolePermission = () => {
				// Already handled above with canManageUserRoles: false
			};
			const attemptRoleChange = () => {
				changeRoleWithoutPermission = () => {
					// Access private setter through type assertion
					(user as { role: unknown }).role = makeRole();
				};
			};
			const verifyRolePermissionError = () => {
				expect(changeRoleWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(changeRoleWithoutPermission).throws(
					'Unauthorized: Only admins with canManageUserRoles permission can change user roles',
				);
			};

			Given('an existing AdminUser aggregate', setupUserNoRolePermission);
			And(
				'the user lacks permission to manage user roles',
				checkLackOfRolePermission,
			);
			When('I attempt to change the role property', attemptRoleChange);
			Then('it should throw a PermissionError', verifyRolePermissionError);
		},
	);

	Scenario(
		'Blocking an admin user with permission',
		({ Given, And, When, Then }) => {
			const setupUserWithBlockPermission = () => {
				passport = makePassport(true, true);
				user = new AdminUser(makeBaseProps(), passport);
			};
			const checkBlockPermission = () => {
				// Already handled in makePassport with canBlockUsers: true
			};
			const blockUser = () => {
				user.isBlocked = true;
			};
			const verifyBlocked = () => expect(user.isBlocked).toBe(true);

			Given('an existing AdminUser aggregate', setupUserWithBlockPermission);
			And('the user has permission to block users', checkBlockPermission);
			When('I set isBlocked to true', blockUser);
			Then('isBlocked should be true', verifyBlocked);
		},
	);

	Scenario(
		'Unblocking an admin user with permission',
		({ Given, And, When, Then }) => {
			const setupBlockedUser = () => {
				passport = makePassport(true, true);
				user = new AdminUser(makeBaseProps({ isBlocked: true }), passport);
			};
			const checkUnblockPermission = () => {
				// Already handled in makePassport with canBlockUsers: true
			};
			const unblockUser = () => {
				user.isBlocked = false;
			};
			const verifyUnblocked = () => expect(user.isBlocked).toBe(false);

			Given(
				'an existing AdminUser aggregate that is blocked',
				setupBlockedUser,
			);
			And('the user has permission to block users', checkUnblockPermission);
			When('I set isBlocked to false', unblockUser);
			Then('isBlocked should be false', verifyUnblocked);
		},
	);

	Scenario('Loading role asynchronously', ({ Given, When, Then }) => {
		let loadedRole: unknown;
		const setupUserForRoleLoad = () => {
			passport = makePassport(true, true);
			user = new AdminUser(makeBaseProps(), passport);
		};
		const callLoadRole = async () => {
			loadedRole = await user.loadRole();
		};
		const verifyLoadedRole = () => {
			expect(loadedRole).toBeDefined();
			expect((loadedRole as { id: string }).id).toBe('role-1');
		};

		Given('an existing AdminUser aggregate', setupUserForRoleLoad);
		When('I call loadRole', callLoadRole);
		Then('it should return the role asynchronously', verifyLoadedRole);
	});

	Scenario('Attempting to set role to null', ({ Given, When, Then }) => {
		let setRoleToNull: () => void;
		const createNewAdminUser = () => {
			passport = makePassport(true, true);
			user = AdminUser.getNewInstance(
				makeBaseProps(),
				passport,
				'admin@example.com',
				'adminuser',
				'Admin',
				'User',
			);
		};
		const attemptSetRoleNull = () => {
			setRoleToNull = () => {
				(user as { role: unknown }).role = null;
			};
		};
		const verifyNullRoleError = () => {
			expect(setRoleToNull).toThrow(DomainSeedwork.PermissionError);
			expect(setRoleToNull).throws('role cannot be null or undefined');
		};

		Given('a new AdminUser aggregate', createNewAdminUser);
		When('I attempt to set role to null', attemptSetRoleNull);
		Then(
			'it should throw a PermissionError with message "role cannot be null or undefined"',
			verifyNullRoleError,
		);
	});

	Scenario('Attempting to set role to undefined', ({ Given, When, Then }) => {
		let setRoleToUndefined: () => void;
		const createNewAdminUserForUndefined = () => {
			passport = makePassport(true, true);
			user = AdminUser.getNewInstance(
				makeBaseProps(),
				passport,
				'admin@example.com',
				'adminuser',
				'Admin',
				'User',
			);
		};
		const attemptSetRoleUndefined = () => {
			setRoleToUndefined = () => {
				(user as { role: unknown }).role = undefined;
			};
		};
		const verifyUndefinedRoleError = () => {
			expect(setRoleToUndefined).toThrow(DomainSeedwork.PermissionError);
			expect(setRoleToUndefined).throws('role cannot be null or undefined');
		};

		Given('a new AdminUser aggregate', createNewAdminUserForUndefined);
		When('I attempt to set role to undefined', attemptSetRoleUndefined);
		Then(
			'it should throw a PermissionError with message "role cannot be null or undefined"',
			verifyUndefinedRoleError,
		);
	});

	Scenario('Getting createdAt from admin user', ({ Given, When, Then }) => {
		const setupUserForCreatedAt = () => {
			passport = makePassport(true, true);
			user = new AdminUser(makeBaseProps(), passport);
		};
		const accessCreatedAt = () => {
			// Access happens in Then
		};
		const verifyCreatedAt = () => {
			expect(user.createdAt).toBeInstanceOf(Date);
			expect(user.createdAt.getTime()).toBeGreaterThan(0);
		};

		Given('an existing AdminUser aggregate', setupUserForCreatedAt);
		When('I access the createdAt property', accessCreatedAt);
		Then('it should return a valid date', verifyCreatedAt);
	});

	Scenario('Getting updatedAt from admin user', ({ Given, When, Then }) => {
		const setupUserForUpdatedAt = () => {
			passport = makePassport(true, true);
			user = new AdminUser(makeBaseProps(), passport);
		};
		const accessUpdatedAt = () => {
			// Access happens in Then
		};
		const verifyUpdatedAt = () => {
			expect(user.updatedAt).toBeInstanceOf(Date);
			expect(user.updatedAt.getTime()).toBeGreaterThan(0);
		};

		Given('an existing AdminUser aggregate', setupUserForUpdatedAt);
		When('I access the updatedAt property', accessUpdatedAt);
		Then('it should return a valid date', verifyUpdatedAt);
	});

	Scenario('Updating userType without permission', ({ Given, When, Then }) => {
		let updateUserTypeWithoutPermission: () => void;
		const setupUserNoEditPermission = () => {
			// Create a passport where isEditingOwnAccount is false
			passport = vi.mocked({
				user: {
					forAdminUser: vi.fn(() => ({
						determineIf: (
							fn: (p: {
								isEditingOwnAccount: boolean;
								canManageUserRoles: boolean;
								canBlockUsers: boolean;
							}) => boolean,
						) =>
							fn({
								isEditingOwnAccount: false,
								canManageUserRoles: false,
								canBlockUsers: false,
							}),
					})),
				},
			} as unknown as Passport);
			user = new AdminUser(makeBaseProps(), passport);
		};
		const attemptUserTypeUpdate = () => {
			updateUserTypeWithoutPermission = () => {
				user.userType = 'SuperAdmin';
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
			'an existing AdminUser aggregate without editing permission',
			setupUserNoEditPermission,
		);
		When('I attempt to set userType to "SuperAdmin"', attemptUserTypeUpdate);
		Then(
			'it should throw a PermissionError with message "Unauthorized to modify user"',
			verifyUnauthorizedError,
		);
	});
});
