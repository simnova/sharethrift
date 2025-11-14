import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { AdminUserProps } from './admin-user.entity.ts';
import { AdminUser } from './admin-user.ts';
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
		When('I create a new AdminUser aggregate using getNewInstance', () => {
			newUser = AdminUser.getNewInstance(
				makeBaseProps(),
				passport,
				'admin@example.com',
				'adminuser',
				'Admin',
				'User',
			);
		});
		Then('it should have correct email "admin@example.com"', () => {
			expect(newUser.account.email).toBe('admin@example.com');
		});
		And('username should be "adminuser"', () => {
			expect(newUser.account.username).toBe('adminuser');
		});
		And('firstName should be "Admin"', () => {
			expect(newUser.account.profile.firstName).toBe('Admin');
		});
		And('lastName should be "User"', () => {
			expect(newUser.account.profile.lastName).toBe('User');
		});
		And('isNew should be false after creation', () => {
			expect(newUser.isNew).toBe(false);
		});
		And('it should expose a valid AdminUserAccount instance', () => {
			expect(newUser.account).toBeDefined();
			expect(newUser.account.email).toBe('admin@example.com');
		});
	});

	Scenario(
		'Updating userType with valid permission',
		({ Given, And, When, Then }) => {
			Given('an existing AdminUser aggregate', () => {
				passport = makePassport(true, true);
				user = new AdminUser(makeBaseProps(), passport);
			});
			And('the user has permission to edit their account', () => {
				// Already handled in makePassport with isEditingOwnAccount: true
			});
			When('I set userType to "SuperAdmin"', () => {
				user.userType = 'SuperAdmin';
			});
			Then('userType should update successfully', () => {
				expect(user.userType).toBe('SuperAdmin');
			});
		},
	);

	Scenario(
		'Blocking an admin user without permission',
		({ Given, And, When, Then }) => {
			let blockUserWithoutPermission: () => void;
			Given('an existing AdminUser aggregate', () => {
				// Create user with no block permission
				passport = makePassport(false, false);
				user = new AdminUser(makeBaseProps(), passport);
			});
			And('the user lacks permission to block users', () => {
				// Already handled above with canBlockUsers: false
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
					'Unauthorized: Only admins with canBlockUsers permission can block/unblock admin users',
				);
			});
		},
	);

	Scenario(
		'Changing admin user role with permission',
		({ Given, And, When, Then }) => {
			Given('an existing AdminUser aggregate', () => {
				passport = makePassport(true, true);
				user = new AdminUser(makeBaseProps(), passport);
			});
			And('the user has permission to manage user roles', () => {
				// Already handled in makePassport with canManageUserRoles: true
			});
			When('I access the role property', () => {
				// Just accessing the property
			});
			Then('it should return the current role', () => {
				expect(user.role).toBeDefined();
				expect(user.role.id).toBe('role-1');
			});
		},
	);

	Scenario(
		'Attempting to change role without permission',
		({ Given, And, When, Then }) => {
			let changeRoleWithoutPermission: () => void;
			Given('an existing AdminUser aggregate', () => {
				// Create user with no role management permission
				passport = makePassport(false, false);
				baseProps = makeBaseProps();
				user = new AdminUser(baseProps, passport);
			});
			And('the user lacks permission to manage user roles', () => {
				// Already handled above with canManageUserRoles: false
			});
			When('I attempt to change the role property', () => {
				changeRoleWithoutPermission = () => {
					// Access private setter through type assertion
					(user as { role: unknown }).role = makeRole();
				};
			});
			Then('it should throw a PermissionError', () => {
				expect(changeRoleWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(changeRoleWithoutPermission).throws(
					'Unauthorized: Only admins with canManageUserRoles permission can change user roles',
				);
			});
		},
	);
});
