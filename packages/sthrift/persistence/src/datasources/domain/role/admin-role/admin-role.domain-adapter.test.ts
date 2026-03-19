import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { AdminRoleDomainAdapter } from './admin-role.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.domain-adapter.feature'),
);

function makeAdminRoleDoc() {
	const userPermissions = {
		canBlockUsers: false,
		canViewAllUsers: false,
		canEditUsers: false,
		canDeleteUsers: false,
		canManageUserRoles: false,
		canAccessAnalytics: false,
		canManageRoles: false,
		canViewReports: false,
		canDeleteContent: false,
	} as Models.Role.AdminRoleUserPermissions;

	const conversationPermissions = {
		canViewAllConversations: false,
		canEditConversations: false,
		canDeleteConversations: false,
		canCloseConversations: false,
		canModerateConversations: false,
	} as Models.Role.AdminRoleConversationPermissions;

	const listingPermissions = {
		canViewAllListings: false,
		canManageAllListings: false,
		canEditListings: false,
		canDeleteListings: false,
		canApproveListings: false,
		canRejectListings: false,
		canBlockListings: false,
		canUnblockListings: false,
		canModerateListings: false,
	} as Models.Role.AdminRoleListingPermissions;

	const reservationRequestPermissions = {
		canViewAllReservations: false,
		canApproveReservations: false,
		canRejectReservations: false,
		canCancelReservations: false,
		canEditReservations: false,
		canModerateReservations: false,
	} as Models.Role.AdminRoleReservationRequestPermissions;

	const permissions = {
		userPermissions,
		conversationPermissions,
		listingPermissions,
		reservationRequestPermissions,
		set(key: string, value: unknown) {
			(this as never)[key] = value as never;
		},
	} as unknown as Models.Role.AdminRolePermissions;

	const base = {
		_id: 'role-1',
		roleName: 'Admin',
		roleType: 'admin',
		isDefault: false,
		permissions,
		set(key: keyof Models.Role.AdminRole, value: unknown) {
			(this as Models.Role.AdminRole)[key] = value as never;
		},
	} as unknown as Models.Role.AdminRole;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.Role.AdminRole;
	let adapter: AdminRoleDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeAdminRoleDoc();
		adapter = new AdminRoleDomainAdapter(doc);
	});

	Background(({ Given, And }) => {
		Given('an AdminRole document from the database', () => {
			// Document created in BeforeEachScenario
		});
		And('an AdminRoleDomainAdapter wrapping the document', () => {
			// Adapter created in BeforeEachScenario
		});
	});

	Scenario('Accessing admin role properties', ({ Then, And }) => {
		Then('the domain adapter should have a roleName property', () => {
			expect(adapter.roleName).toBeDefined();
		});

		And('the domain adapter should have a roleType property', () => {
			expect(adapter.roleType).toBeDefined();
		});

		And('the domain adapter should have an isDefault property', () => {
			expect(adapter.isDefault).toBeDefined();
		});

		And('the domain adapter should have a permissions property', () => {
			expect(adapter.permissions).toBeDefined();
		});
	});

	Scenario('Modifying admin role name', ({ When, Then }) => {
		When('I set the roleName to "Super Admin"', () => {
			adapter.roleName = 'Super Admin';
		});

		Then('the roleName should be "Super Admin"', () => {
			expect(adapter.roleName).toBe('Super Admin');
		});
	});

	Scenario('Modifying admin role isDefault', ({ When, Then }) => {
		When('I set the isDefault to true', () => {
			adapter.isDefault = true;
		});

		Then('the isDefault should be true', () => {
			expect(adapter.isDefault).toBe(true);
		});
	});

	Scenario('Accessing user permissions', ({ When, Then, And }) => {
		let userPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleUserPermissionsProps;

		When('I access the permissions', () => {
			// Accessing permissions property
		});

		Then('I can access the userPermissions property', () => {
			userPermissions = adapter.permissions.userPermissions;
			expect(userPermissions).toBeDefined();
		});

		And('the userPermissions should have all expected properties', () => {
			expect(userPermissions.canBlockUsers).toBeDefined();
			expect(userPermissions.canViewAllUsers).toBeDefined();
			expect(userPermissions.canEditUsers).toBeDefined();
			expect(userPermissions.canDeleteUsers).toBeDefined();
			expect(userPermissions.canManageUserRoles).toBeDefined();
			expect(userPermissions.canAccessAnalytics).toBeDefined();
			expect(userPermissions.canManageRoles).toBeDefined();
			expect(userPermissions.canViewReports).toBeDefined();
			expect(userPermissions.canDeleteContent).toBeDefined();
		});
	});

	Scenario('Modifying user permissions', ({ When, Then, And }) => {
		let userPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleUserPermissionsProps;

		When('I access the permissions', () => {
			userPermissions = adapter.permissions.userPermissions;
		});

		And('I set canBlockUsers to true', () => {
			userPermissions.canBlockUsers = true;
		});

		Then('the canBlockUsers permission should be true', () => {
			expect(userPermissions.canBlockUsers).toBe(true);
		});

		When('I set canViewAllUsers to true', () => {
			userPermissions.canViewAllUsers = true;
		});

		Then('the canViewAllUsers permission should be true', () => {
			expect(userPermissions.canViewAllUsers).toBe(true);
		});

		When('I set canEditUsers to true', () => {
			userPermissions.canEditUsers = true;
		});

		Then('the canEditUsers permission should be true', () => {
			expect(userPermissions.canEditUsers).toBe(true);
		});

		When('I set canDeleteUsers to true', () => {
			userPermissions.canDeleteUsers = true;
		});

		Then('the canDeleteUsers permission should be true', () => {
			expect(userPermissions.canDeleteUsers).toBe(true);
		});

		When('I set canManageUserRoles to true', () => {
			userPermissions.canManageUserRoles = true;
		});

		Then('the canManageUserRoles permission should be true', () => {
			expect(userPermissions.canManageUserRoles).toBe(true);
		});

		When('I set canAccessAnalytics to true', () => {
			userPermissions.canAccessAnalytics = true;
		});

		Then('the canAccessAnalytics permission should be true', () => {
			expect(userPermissions.canAccessAnalytics).toBe(true);
		});

		When('I set canManageRoles to true', () => {
			userPermissions.canManageRoles = true;
		});

		Then('the canManageRoles permission should be true', () => {
			expect(userPermissions.canManageRoles).toBe(true);
		});

		When('I set canViewReports to true', () => {
			userPermissions.canViewReports = true;
		});

		Then('the canViewReports permission should be true', () => {
			expect(userPermissions.canViewReports).toBe(true);
		});

		When('I set canDeleteContent to true', () => {
			userPermissions.canDeleteContent = true;
		});

		Then('the canDeleteContent permission should be true', () => {
			expect(userPermissions.canDeleteContent).toBe(true);
		});
	});

	Scenario('Accessing conversation permissions', ({ When, Then, And }) => {
		let conversationPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleConversationPermissionsProps;

		When('I access the permissions', () => {
			// Accessing permissions property
		});

		Then('I can access the conversationPermissions property', () => {
			conversationPermissions = adapter.permissions.conversationPermissions;
			expect(conversationPermissions).toBeDefined();
		});

		And('the conversationPermissions should have all expected properties', () => {
			expect(conversationPermissions.canViewAllConversations).toBeDefined();
			expect(conversationPermissions.canEditConversations).toBeDefined();
			expect(conversationPermissions.canDeleteConversations).toBeDefined();
			expect(conversationPermissions.canCloseConversations).toBeDefined();
			expect(conversationPermissions.canModerateConversations).toBeDefined();
		});
	});

	Scenario('Modifying conversation permissions', ({ When, Then, And }) => {
		let conversationPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleConversationPermissionsProps;

		When('I access the permissions', () => {
			conversationPermissions = adapter.permissions.conversationPermissions;
		});

		And('I set canViewAllConversations to true', () => {
			conversationPermissions.canViewAllConversations = true;
		});

		Then('the canViewAllConversations permission should be true', () => {
			expect(conversationPermissions.canViewAllConversations).toBe(true);
		});

		When('I set canEditConversations to true', () => {
			conversationPermissions.canEditConversations = true;
		});

		Then('the canEditConversations permission should be true', () => {
			expect(conversationPermissions.canEditConversations).toBe(true);
		});

		When('I set canDeleteConversations to true', () => {
			conversationPermissions.canDeleteConversations = true;
		});

		Then('the canDeleteConversations permission should be true', () => {
			expect(conversationPermissions.canDeleteConversations).toBe(true);
		});

		When('I set canCloseConversations to true', () => {
			conversationPermissions.canCloseConversations = true;
		});

		Then('the canCloseConversations permission should be true', () => {
			expect(conversationPermissions.canCloseConversations).toBe(true);
		});

		When('I set canModerateConversations to true', () => {
			conversationPermissions.canModerateConversations = true;
		});

		Then('the canModerateConversations permission should be true', () => {
			expect(conversationPermissions.canModerateConversations).toBe(true);
		});
	});

	Scenario('Accessing listing permissions', ({ When, Then, And }) => {
		let listingPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleListingPermissionsProps;

		When('I access the permissions', () => {
			// Accessing permissions property
		});

		Then('I can access the listingPermissions property', () => {
			listingPermissions = adapter.permissions.listingPermissions;
			expect(listingPermissions).toBeDefined();
		});

		And('the listingPermissions should have all expected properties', () => {
			expect(listingPermissions.canViewAllListings).toBeDefined();
			expect(listingPermissions.canManageAllListings).toBeDefined();
			expect(listingPermissions.canEditListings).toBeDefined();
			expect(listingPermissions.canDeleteListings).toBeDefined();
			expect(listingPermissions.canApproveListings).toBeDefined();
			expect(listingPermissions.canRejectListings).toBeDefined();
			expect(listingPermissions.canBlockListings).toBeDefined();
			expect(listingPermissions.canUnblockListings).toBeDefined();
			expect(listingPermissions.canModerateListings).toBeDefined();
		});
	});

	Scenario('Modifying listing permissions', ({ When, Then, And }) => {
		let listingPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleListingPermissionsProps;

		When('I access the permissions', () => {
			listingPermissions = adapter.permissions.listingPermissions;
		});

		And('I set canViewAllListings to true', () => {
			listingPermissions.canViewAllListings = true;
		});

		Then('the canViewAllListings permission should be true', () => {
			expect(listingPermissions.canViewAllListings).toBe(true);
		});

		When('I set canManageAllListings to true', () => {
			listingPermissions.canManageAllListings = true;
		});

		Then('the canManageAllListings permission should be true', () => {
			expect(listingPermissions.canManageAllListings).toBe(true);
		});

		When('I set canEditListings to true', () => {
			listingPermissions.canEditListings = true;
		});

		Then('the canEditListings permission should be true', () => {
			expect(listingPermissions.canEditListings).toBe(true);
		});

		When('I set canDeleteListings to true', () => {
			listingPermissions.canDeleteListings = true;
		});

		Then('the canDeleteListings permission should be true', () => {
			expect(listingPermissions.canDeleteListings).toBe(true);
		});

		When('I set canApproveListings to true', () => {
			listingPermissions.canApproveListings = true;
		});

		Then('the canApproveListings permission should be true', () => {
			expect(listingPermissions.canApproveListings).toBe(true);
		});

		When('I set canRejectListings to true', () => {
			listingPermissions.canRejectListings = true;
		});

		Then('the canRejectListings permission should be true', () => {
			expect(listingPermissions.canRejectListings).toBe(true);
		});

		When('I set canBlockListings to true', () => {
			listingPermissions.canBlockListings = true;
		});

		Then('the canBlockListings permission should be true', () => {
			expect(listingPermissions.canBlockListings).toBe(true);
		});

		When('I set canUnblockListings to true', () => {
			listingPermissions.canUnblockListings = true;
		});

		Then('the canUnblockListings permission should be true', () => {
			expect(listingPermissions.canUnblockListings).toBe(true);
		});

		When('I set canModerateListings to true', () => {
			listingPermissions.canModerateListings = true;
		});

		Then('the canModerateListings permission should be true', () => {
			expect(listingPermissions.canModerateListings).toBe(true);
		});
	});

	Scenario('Accessing reservation request permissions', ({ When, Then, And }) => {
		let reservationRequestPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleReservationRequestPermissionsProps;

		When('I access the permissions', () => {
			// Accessing permissions property
		});

		Then('I can access the reservationRequestPermissions property', () => {
			reservationRequestPermissions = adapter.permissions.reservationRequestPermissions;
			expect(reservationRequestPermissions).toBeDefined();
		});

		And('the reservationRequestPermissions should have all expected properties', () => {
			expect(reservationRequestPermissions.canViewAllReservations).toBeDefined();
			expect(reservationRequestPermissions.canApproveReservations).toBeDefined();
			expect(reservationRequestPermissions.canRejectReservations).toBeDefined();
			expect(reservationRequestPermissions.canCancelReservations).toBeDefined();
			expect(reservationRequestPermissions.canEditReservations).toBeDefined();
			expect(reservationRequestPermissions.canModerateReservations).toBeDefined();
		});
	});

	Scenario('Modifying reservation request permissions', ({ When, Then, And }) => {
		let reservationRequestPermissions: Domain.Contexts.User.Role.AdminRole.AdminRoleReservationRequestPermissionsProps;

		When('I access the permissions', () => {
			reservationRequestPermissions = adapter.permissions.reservationRequestPermissions;
		});

		And('I set canViewAllReservations to true', () => {
			reservationRequestPermissions.canViewAllReservations = true;
		});

		Then('the canViewAllReservations permission should be true', () => {
			expect(reservationRequestPermissions.canViewAllReservations).toBe(true);
		});

		When('I set canApproveReservations to true', () => {
			reservationRequestPermissions.canApproveReservations = true;
		});

		Then('the canApproveReservations permission should be true', () => {
			expect(reservationRequestPermissions.canApproveReservations).toBe(true);
		});

		When('I set canRejectReservations to true', () => {
			reservationRequestPermissions.canRejectReservations = true;
		});

		Then('the canRejectReservations permission should be true', () => {
			expect(reservationRequestPermissions.canRejectReservations).toBe(true);
		});

		When('I set canCancelReservations to true', () => {
			reservationRequestPermissions.canCancelReservations = true;
		});

		Then('the canCancelReservations permission should be true', () => {
			expect(reservationRequestPermissions.canCancelReservations).toBe(true);
		});

		When('I set canEditReservations to true', () => {
			reservationRequestPermissions.canEditReservations = true;
		});

		Then('the canEditReservations permission should be true', () => {
			expect(reservationRequestPermissions.canEditReservations).toBe(true);
		});

		When('I set canModerateReservations to true', () => {
			reservationRequestPermissions.canModerateReservations = true;
		});

		Then('the canModerateReservations permission should be true', () => {
			expect(reservationRequestPermissions.canModerateReservations).toBe(true);
		});
	});

	Scenario('Accessing conversation permissions when undefined', ({ Given, When, Then }) => {
		Given('an AdminRole document with undefined conversationPermissions', () => {
			doc = makeAdminRoleDoc();
			doc.permissions.conversationPermissions = undefined as never;
			adapter = new AdminRoleDomainAdapter(doc);
		});

		When('I access the conversationPermissions', () => {
			// Accessing the getter
		});

		Then('the conversationPermissions should be created and accessible', () => {
			const perms = adapter.permissions.conversationPermissions;
			expect(perms).toBeDefined();
		});
	});

	Scenario('Accessing listing permissions when undefined', ({ Given, When, Then }) => {
		Given('an AdminRole document with undefined listingPermissions', () => {
			doc = makeAdminRoleDoc();
			doc.permissions.listingPermissions = undefined as never;
			adapter = new AdminRoleDomainAdapter(doc);
		});

		When('I access the listingPermissions', () => {
			// Accessing the getter
		});

		Then('the listingPermissions should be created and accessible', () => {
			const perms = adapter.permissions.listingPermissions;
			expect(perms).toBeDefined();
		});
	});

	Scenario('Accessing reservation request permissions when undefined', ({ Given, When, Then }) => {
		Given('an AdminRole document with undefined reservationRequestPermissions', () => {
			doc = makeAdminRoleDoc();
			doc.permissions.reservationRequestPermissions = undefined as never;
			adapter = new AdminRoleDomainAdapter(doc);
		});

		When('I access the reservationRequestPermissions', () => {
			// Accessing the getter
		});

		Then('the reservationRequestPermissions should be created and accessible', () => {
			const perms = adapter.permissions.reservationRequestPermissions;
			expect(perms).toBeDefined();
		});
	});
});

// Additional non-BDD tests for edge cases
import { describe, it } from 'vitest';

describe('AdminRoleDomainAdapter - Additional Coverage', () => {
	it('should initialize permissions when undefined', () => {
		const doc = {
			permissions: undefined,
			set: vi.fn(),
		} as unknown as Models.Role.AdminRole;
		const adapter = new AdminRoleDomainAdapter(doc);
		const perms = adapter.permissions;
		expect(perms).toBeDefined();
		expect(doc.set).toHaveBeenCalledWith('permissions', {});
	});

	it('should initialize userPermissions when undefined', () => {
		const doc = {
			permissions: {
				userPermissions: undefined,
				set: vi.fn(),
			} as unknown as Models.Role.AdminRolePermissions,
		} as Models.Role.AdminRole;
		const adapter = new AdminRoleDomainAdapter(doc);
		const userPerms = adapter.permissions.userPermissions;
		expect(userPerms).toBeDefined();
		expect(doc.permissions.set).toHaveBeenCalledWith('userPermissions', {});
	});

	it('should initialize conversationPermissions when undefined', () => {
		const doc = {
			permissions: {
				conversationPermissions: undefined,
				set: vi.fn(),
			} as unknown as Models.Role.AdminRolePermissions,
		} as Models.Role.AdminRole;
		const adapter = new AdminRoleDomainAdapter(doc);
		const convPerms = adapter.permissions.conversationPermissions;
		expect(convPerms).toBeDefined();
		expect(doc.permissions.set).toHaveBeenCalledWith('conversationPermissions', {});
	});
});
