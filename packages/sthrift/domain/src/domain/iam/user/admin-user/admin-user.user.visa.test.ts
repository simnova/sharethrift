import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserUserVisa } from './admin-user.user.visa.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.user.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Admin user visa is created properly', ({ Given, When, Then }) => {
		const mockAdmin = { id: 'admin-123', isBlocked: false } as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;

		Given('I create an admin user visa', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check the visa', () => {
			// Visa instance is ready for verification
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Admin can block users with permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canBlock: boolean;

		Given('I have an admin user with canBlockUsers permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can block users', () => {
			canBlock = visa.determineIf((p) => p.canBlockUsers);
		});

		Then('permission should be granted', () => {
			expect(canBlock).toBe(true);
		});
	});

	Scenario('Admin cannot block users without permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canBlock: boolean;

		Given('I have an admin user without canBlockUsers permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can block users', () => {
			canBlock = visa.determineIf((p) => p.canBlockUsers);
		});

		Then('permission should be denied', () => {
			expect(canBlock).toBe(false);
		});
	});

	Scenario('Admin can unblock users with permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canUnblock: boolean;

		Given('I have an admin user with canBlockUsers permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can unblock users', () => {
			canUnblock = visa.determineIf((p) => p.canUnblockUsers);
		});

		Then('permission should be granted', () => {
			expect(canUnblock).toBe(true);
		});
	});

	Scenario('Admin cannot unblock users without permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canUnblock: boolean;

		Given('I have an admin user without canBlockUsers permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can unblock users', () => {
			canUnblock = visa.determineIf((p) => p.canUnblockUsers);
		});

		Then('permission should be denied', () => {
			expect(canUnblock).toBe(false);
		});
	});

	Scenario('Admin can block listings with moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canBlock: boolean;

		Given('I have an admin user with canModerateListings permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can block listings', () => {
			canBlock = visa.determineIf((p) => p.canBlockListings);
		});

		Then('permission should be granted', () => {
			expect(canBlock).toBe(true);
		});
	});

	Scenario('Admin cannot block listings without moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canBlock: boolean;

		Given('I have an admin user without canModerateListings permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can block listings', () => {
			canBlock = visa.determineIf((p) => p.canBlockListings);
		});

		Then('permission should be denied', () => {
			expect(canBlock).toBe(false);
		});
	});

	Scenario('Admin can unblock listings with moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canUnblock: boolean;

		Given('I have an admin user with canModerateListings permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can unblock listings', () => {
			canUnblock = visa.determineIf((p) => p.canUnblockListings);
		});

		Then('permission should be granted', () => {
			expect(canUnblock).toBe(true);
		});
	});

	Scenario('Admin cannot unblock listings without moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canUnblock: boolean;

		Given('I have an admin user without canModerateListings permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can unblock listings', () => {
			canUnblock = visa.determineIf((p) => p.canUnblockListings);
		});

		Then('permission should be denied', () => {
			expect(canUnblock).toBe(false);
		});
	});

	Scenario('Admin can remove listings with delete content permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canDeleteContent: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canRemove: boolean;

		Given('I have an admin user with canDeleteContent permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can remove listings', () => {
			canRemove = visa.determineIf((p) => p.canRemoveListings);
		});

		Then('permission should be granted', () => {
			expect(canRemove).toBe(true);
		});
	});

	Scenario('Admin cannot remove listings without delete content permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canDeleteContent: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canRemove: boolean;

		Given('I have an admin user without canDeleteContent permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can remove listings', () => {
			canRemove = visa.determineIf((p) => p.canRemoveListings);
		});

		Then('permission should be denied', () => {
			expect(canRemove).toBe(false);
		});
	});

	Scenario('Admin can view listing reports with view reports permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewReports: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canView: boolean;

		Given('I have an admin user with canViewReports permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can view listing reports', () => {
			canView = visa.determineIf((p) => p.canViewListingReports);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Admin cannot view listing reports without view reports permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewReports: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canView: boolean;

		Given('I have an admin user without canViewReports permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can view listing reports', () => {
			canView = visa.determineIf((p) => p.canViewListingReports);
		});

		Then('permission should be denied', () => {
			expect(canView).toBe(false);
		});
	});

	Scenario('Admin can view user reports with canViewAllUsers permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewAllUsers: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canView: boolean;

		Given('I have an admin user with canViewAllUsers permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can view user reports', () => {
			canView = visa.determineIf((p) => p.canViewUserReports);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Admin cannot view user reports without canViewAllUsers permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewAllUsers: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canView: boolean;

		Given('I have an admin user without canViewAllUsers permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can view user reports', () => {
			canView = visa.determineIf((p) => p.canViewUserReports);
		});

		Then('permission should be denied', () => {
			expect(canView).toBe(false);
		});
	});

	Scenario('Admin can manage user roles with permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canManageUserRoles: true },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canManage: boolean;

		Given('I have an admin user with canManageUserRoles permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can manage user roles', () => {
			canManage = visa.determineIf((p) => p.canManageUserRoles);
		});

		Then('permission should be granted', () => {
			expect(canManage).toBe(true);
		});
	});

	Scenario('Admin cannot manage user roles without permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canManageUserRoles: false },
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let canManage: boolean;

		Given('I have an admin user without canManageUserRoles permission', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin can manage user roles', () => {
			canManage = visa.determineIf((p) => p.canManageUserRoles);
		});

		Then('permission should be denied', () => {
			expect(canManage).toBe(false);
		});
	});

	Scenario('Admin editing own account', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: {},
				},
			},
		} as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let isOwnAccount: boolean;

		Given('I have an admin user editing their own account', () => {
			visa = new AdminUserUserVisa(mockAdmin, mockAdmin);
		});

		When('I check if admin is editing own account', () => {
			isOwnAccount = visa.determineIf((p) => p.isEditingOwnAccount);
		});

		Then('flag should be true', () => {
			expect(isOwnAccount).toBe(true);
		});
	});

	Scenario('Admin editing another admin account', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: {},
				},
			},
		} as AdminUserEntityReference;
		const mockTargetUser = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let visa: AdminUserUserVisa;
		let isOwnAccount: boolean;

		Given('I have an admin user editing another admin account', () => {
			visa = new AdminUserUserVisa(mockTargetUser, mockAdmin);
		});

		When('I check if admin is editing own account', () => {
			isOwnAccount = visa.determineIf((p) => p.isEditingOwnAccount);
		});

		Then('flag should be false', () => {
			expect(isOwnAccount).toBe(false);
		});
	});
});
