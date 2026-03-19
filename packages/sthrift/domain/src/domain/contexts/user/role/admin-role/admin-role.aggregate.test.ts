import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Passport } from '../../passport.ts';
import type { AdminRoleProps } from './admin-role.entity.ts';
import { AdminRole as AdminRoleClass } from './admin-role.aggregate.ts';
import type { AdminRole } from './admin-role.aggregate.ts';
import type { AdminRolePermissions } from './admin-role-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.aggregate.feature'),
);

function makePassport(): Passport {
	return vi.mocked({
		user: {
			forAdminRole: vi.fn(() => ({
				determineIf: (fn: (p: { canManageUserRoles: boolean }) => boolean) =>
					fn({ canManageUserRoles: true }),
			})),
		},
	} as unknown as Passport);
}

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let adminRole: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let roleProps: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let result: any;

	BeforeEachScenario(() => {
		mockRepo = {
			getNewInstance: (roleName: string, isDefault: boolean) => {
				const props: AdminRoleProps = {
					id: 'test-role-id',
					roleType: 'admin',
					roleName,
					isDefault,
					permissions: {
						userPermissions: {
							canBlockUsers: false,
							canViewAllUsers: false,
							canEditUsers: false,
							canDeleteUsers: false,
							canManageUserRoles: false,
							canAccessAnalytics: false,
							canManageRoles: false,
							canViewReports: false,
							canDeleteContent: false,
						},
						conversationPermissions: {
							canViewAllConversations: false,
							canEditConversations: false,
							canDeleteConversations: false,
							canCloseConversations: false,
							canModerateConversations: false,
						},
						listingPermissions: {
							canViewAllListings: false,
							canManageAllListings: false,
							canEditListings: false,
							canDeleteListings: false,
							canApproveListings: false,
							canRejectListings: false,
							canBlockListings: false,
							canUnblockListings: false,
							canModerateListings: false,
						},
						reservationRequestPermissions: {
							canViewAllReservations: false,
							canApproveReservations: false,
							canRejectReservations: false,
							canCancelReservations: false,
							canEditReservations: false,
							canModerateReservations: false,
						},
					},
					schemaVersion: '1.0',
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				const mockRole = {
					id: props.id,
					props,
					get roleName() {
						return props.roleName;
					},
					set roleName(value: string) {
						props.roleName = value;
					},
					get isDefault() {
						return props.isDefault;
					},
					set isDefault(value: boolean) {
						props.isDefault = value;
					},
					get permissions() {
						return props.permissions;
					},
					set permissions(value: typeof props.permissions) {
						props.permissions = value;
					},
					get roleType() {
						return props.roleType;
					},
					get createdAt() {
						return props.createdAt;
					},
					get updatedAt() {
						return props.updatedAt;
					},
					get schemaVersion() {
						return props.schemaVersion;
					},
				};
				return mockRole as unknown as AdminRole<AdminRoleProps>;
			},
		};

		roleProps = {
			id: 'existing-role-id',
			roleType: 'admin',
			roleName: 'Existing Role',
			isDefault: false,
			permissions: {
				userPermissions: {
					canBlockUsers: false,
					canViewAllUsers: false,
					canEditUsers: false,
					canDeleteUsers: false,
					canManageUserRoles: false,
					canAccessAnalytics: false,
					canManageRoles: false,
					canViewReports: false,
					canDeleteContent: false,
				},
				conversationPermissions: {
					canViewAllConversations: false,
					canEditConversations: false,
					canDeleteConversations: false,
					canCloseConversations: false,
					canModerateConversations: false,
				},
				listingPermissions: {
					canViewAllListings: false,
					canManageAllListings: false,
					canEditListings: false,
					canDeleteListings: false,
					canApproveListings: false,
					canRejectListings: false,
					canBlockListings: false,
					canUnblockListings: false,
					canModerateListings: false,
				},
				reservationRequestPermissions: {
					canViewAllReservations: false,
					canApproveReservations: false,
					canRejectReservations: false,
					canCancelReservations: false,
					canEditReservations: false,
					canModerateReservations: false,
				},
			},
			schemaVersion: '1.0',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		adminRole = undefined;
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given('I have an admin role repository', () => {
			// mockRepo is already set up in BeforeEachScenario
		});

		And('I have valid admin role data', () => {
			// roleProps is already set up in BeforeEachScenario
		});
	});

	Scenario('Creating a new admin role instance', ({ When, Then, And }) => {
		When(
			'I call getNewInstance with roleName "Super Admin" and isDefault false',
			() => {
				adminRole = AdminRoleClass.getNewInstance(
					roleProps,
					makePassport(),
					'Super Admin',
					false,
				);
			},
		);

		Then('a new admin role should be created', () => {
			expect(adminRole).toBeDefined();
		});

		And('the role should have id', () => {
			expect(adminRole.id).toBeDefined();
			expect(typeof adminRole.id).toBe('string');
		});

		And('the role should have roleName "Super Admin"', () => {
			expect(adminRole.roleName).toBe('Super Admin');
		});

		And('the role should have isDefault false', () => {
			expect(adminRole.isDefault).toBe(false);
		});

		And('the role should have default permissions', () => {
			expect(adminRole.permissions).toBeDefined();
			expect(adminRole.permissions.userPermissions).toBeDefined();
			expect(adminRole.permissions.conversationPermissions).toBeDefined();
			expect(adminRole.permissions.listingPermissions).toBeDefined();
			expect(adminRole.permissions.reservationRequestPermissions).toBeDefined();
		});
	});

	Scenario('Getting roleName from admin role', ({ Given, When, Then }) => {
		Given('an existing admin role with roleName "Moderator"', () => {
			roleProps.roleName = 'Moderator';
			adminRole = {
				props: roleProps,
				get roleName() {
					return this.props.roleName;
				},
			};
		});

		When('I access the roleName property', () => {
			result = adminRole.roleName;
		});

		Then('it should return "Moderator"', () => {
			expect(result).toBe('Moderator');
		});
	});

	Scenario('Setting roleName for admin role', ({ Given, When, Then }) => {
		Given('an existing admin role', () => {
			adminRole = new AdminRoleClass(roleProps, makePassport());
		});

		When('I set roleName to "Content Manager"', () => {
			// @ts-expect-error: testing private setter
			adminRole.roleName = 'Content Manager';
		});

		Then('the roleName should be updated to "Content Manager"', () => {
			expect(adminRole.roleName).toBe('Content Manager');
		});
	});

	Scenario('Getting isDefault from admin role', ({ Given, When, Then }) => {
		Given('an existing admin role with isDefault true', () => {
			roleProps.isDefault = true;
			adminRole = {
				props: roleProps,
				get isDefault() {
					return this.props.isDefault;
				},
			};
		});

		When('I access the isDefault property', () => {
			result = adminRole.isDefault;
		});

		Then('it should return true', () => {
			expect(result).toBe(true);
		});
	});

	Scenario('Setting isDefault for admin role', ({ Given, When, Then }) => {
		Given('an existing admin role', () => {
			adminRole = new AdminRoleClass(roleProps, makePassport());
		});

		When('I set isDefault to true', () => {
			// @ts-expect-error: testing private setter
			adminRole.isDefault = true;
		});

		Then('the isDefault should be updated to true', () => {
			expect(adminRole.isDefault).toBe(true);
		});
	});

	Scenario(
		'Getting permissions from admin role',
		({ Given, When, Then, And }) => {
			Given('an existing admin role', () => {
				adminRole = {
					props: roleProps,
					get permissions() {
						return this.props.permissions;
					},
				};
			});

			When('I access the permissions property', () => {
				result = adminRole.permissions;
			});

			Then('it should return a permissions object', () => {
				expect(result).toBeDefined();
				expect(typeof result).toBe('object');
			});

			And('the permissions should include userPermissions', () => {
				expect(result.userPermissions).toBeDefined();
			});

			And('the permissions should include conversationPermissions', () => {
				expect(result.conversationPermissions).toBeDefined();
			});

			And('the permissions should include listingPermissions', () => {
				expect(result.listingPermissions).toBeDefined();
			});

			And(
				'the permissions should include reservationRequestPermissions',
				() => {
					expect(result.reservationRequestPermissions).toBeDefined();
				},
			);
		},
	);

	Scenario(
		'Setting permissions for admin role',
		({ Given, When, Then, And }) => {
			Given('an existing admin role', () => {
				adminRole = {
					props: roleProps,
					get permissions() {
						return this.props.permissions;
					},
					set permissions(value: AdminRolePermissions) {
						this.props.permissions = value;
					},
				};
			});

			When('I set userPermissions with canBlockUsers true', () => {
				const newPermissions = { ...adminRole.permissions };
				newPermissions.userPermissions = {
					...newPermissions.userPermissions,
					canBlockUsers: true,
				};
				adminRole.permissions = newPermissions;
			});

			Then('the permissions should be updated', () => {
				expect(adminRole.permissions).toBeDefined();
			});

			And('canBlockUsers should be true', () => {
				expect(adminRole.permissions.userPermissions.canBlockUsers).toBe(true);
			});
		},
	);

	Scenario('Getting roleType from admin role', ({ Given, When, Then }) => {
		Given('an existing admin role', () => {
			adminRole = mockRepo.getNewInstance('Moderator', false);
		});

		When('I access the roleType property', () => {
			result = adminRole.roleType;
		});

		Then('it should return "admin"', () => {
			expect(result).toBe('admin');
		});
	});

	Scenario('Getting createdAt from admin role', ({ Given, When, Then }) => {
		Given('an existing admin role', () => {
			adminRole = mockRepo.getNewInstance('Moderator', false);
		});

		When('I access the createdAt property', () => {
			result = adminRole.createdAt;
		});

		Then('it should return a valid date', () => {
			expect(result).toBeInstanceOf(Date);
			expect(result.getTime()).toBeGreaterThan(0);
		});
	});

	Scenario('Getting updatedAt from admin role', ({ Given, When, Then }) => {
		Given('an existing admin role', () => {
			adminRole = mockRepo.getNewInstance('Moderator', false);
		});

		When('I access the updatedAt property', () => {
			result = adminRole.updatedAt;
		});

		Then('it should return a valid date', () => {
			expect(result).toBeInstanceOf(Date);
			expect(result.getTime()).toBeGreaterThan(0);
		});
	});

	Scenario('Getting schemaVersion from admin role', ({ Given, When, Then }) => {
		Given('an existing admin role', () => {
			adminRole = mockRepo.getNewInstance('Moderator', false);
		});

		When('I access the schemaVersion property', () => {
			result = adminRole.schemaVersion;
		});

		Then('it should return the schema version', () => {
			expect(result).toBeDefined();
			expect(typeof result).toBe('string');
		});
	});
});

import { describe, it } from 'vitest';
import { AdminRole } from './admin-role.aggregate.ts';
import type { SystemPassport } from '../../../iam/system/system.passport.ts';

describe('AdminRole - Direct Unit Tests', () => {
	const mockPassport = {
		user: {
			forAdminRole: vi.fn(() => ({
				determineIf: (fn: (p: { canManageUserRoles: boolean }) => boolean) =>
					fn({ canManageUserRoles: true }),
			})),
		},
	} as unknown as SystemPassport;

	const makeRoleProps = (): AdminRoleProps => ({
		id: 'test-role-id',
		roleType: 'admin',
		roleName: 'TestRole',
		isDefault: false,
		permissions: {
			userPermissions: {
				canBlockUsers: true,
				canViewAllUsers: true,
				canEditUsers: false,
				canDeleteUsers: false,
				canManageUserRoles: false,
				canAccessAnalytics: false,
				canManageRoles: false,
				canViewReports: false,
				canDeleteContent: false,
			},
			conversationPermissions: {
				canViewAllConversations: false,
				canEditConversations: false,
				canDeleteConversations: false,
				canCloseConversations: false,
				canModerateConversations: false,
			},
			listingPermissions: {
				canViewAllListings: false,
				canManageAllListings: false,
				canEditListings: false,
				canDeleteListings: false,
				canApproveListings: false,
				canRejectListings: false,
				canBlockListings: false,
				canUnblockListings: false,
				canModerateListings: false,
			},
			reservationRequestPermissions: {
				canViewAllReservations: false,
				canApproveReservations: false,
				canRejectReservations: false,
				canCancelReservations: false,
				canEditReservations: false,
				canModerateReservations: false,
			},
		},
		schemaVersion: '1.0',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	it('should access permissions getter', () => {
		const props = makeRoleProps();
		const role = new AdminRole(props, mockPassport);
		const permissions = role.permissions;
		expect(permissions).toBeDefined();
		expect(permissions.userPermissions).toBeDefined();
	});

	it('should access roleType getter', () => {
		const props = makeRoleProps();
		const role = new AdminRole(props, mockPassport);
		expect(role.roleType).toBe('admin');
	});

	it('should access createdAt getter', () => {
		const props = makeRoleProps();
		const role = new AdminRole(props, mockPassport);
		expect(role.createdAt).toBeInstanceOf(Date);
	});

	it('should access updatedAt getter', () => {
		const props = makeRoleProps();
		const role = new AdminRole(props, mockPassport);
		expect(role.updatedAt).toBeInstanceOf(Date);
	});

	it('should access schemaVersion getter', () => {
		const props = makeRoleProps();
		const role = new AdminRole(props, mockPassport);
		expect(role.schemaVersion).toBe('1.0');
	});
});
