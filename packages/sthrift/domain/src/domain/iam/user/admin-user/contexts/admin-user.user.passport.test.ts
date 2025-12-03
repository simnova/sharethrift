import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserUserPassport } from '../admin-user.user.passport.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.user.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario(
		'Admin user can access personal user entities',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserUserPassport;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			let visa: any;

			Given('I have an admin user user passport', () => {
				passport = new AdminUserUserPassport(mockUser);
			});

			When('I request access to a personal user', () => {
				const mockTargetUser = {
					id: 'personal-user-456',
					isBlocked: false,
				} as PersonalUserEntityReference;
				visa = passport.forPersonalUser(mockTargetUser);
			});

			Then('visa should be created with permission function', () => {
				expect(visa).toBeDefined();
				expect(visa.determineIf).toBeDefined();
				expect(typeof visa.determineIf).toBe('function');
			});
		},
	);

	Scenario(
		'Admin user can access admin user entities',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserUserPassport;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			let visa: any;

			Given('I have an admin user user passport', () => {
				passport = new AdminUserUserPassport(mockUser);
			});

			When('I request access to an admin user', () => {
				const mockTargetUser = {
					id: 'admin-user-789',
					isBlocked: false,
				} as AdminUserEntityReference;
				visa = passport.forAdminUser(mockTargetUser);
			});

			Then('visa should be created with permission function', () => {
				expect(visa).toBeDefined();
				expect(visa.determineIf).toBeDefined();
				expect(typeof visa.determineIf).toBe('function');
			});
		},
	);

	Scenario('Admin user user passport is defined', ({ Given, When, Then }) => {
		const mockUser = {
			id: 'admin-user-123',
			isBlocked: false,
		} as AdminUserEntityReference;
		let passport: AdminUserUserPassport;

		Given('I create an admin user user passport', () => {
			passport = new AdminUserUserPassport(mockUser);
		});

		When('I check the passport', () => {
			// Passport instance is ready for verification
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(AdminUserUserPassport);
		});
	});

	Scenario('Admin can block personal users with permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canBlock: boolean;

		Given('I have an admin with canBlockUsers permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can block a personal user', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canBlock = visa.determineIf((p: { canBlockUsers: boolean }) => p.canBlockUsers);
		});

		Then('permission should be granted', () => {
			expect(canBlock).toBe(true);
		});
	});

	Scenario('Admin cannot block personal users without permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canBlock: boolean;

		Given('I have an admin without canBlockUsers permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can block a personal user', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canBlock = visa.determineIf((p: { canBlockUsers: boolean }) => p.canBlockUsers);
		});

		Then('permission should be denied', () => {
			expect(canBlock).toBe(false);
		});
	});

	Scenario('Admin can unblock personal users with permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canUnblock: boolean;

		Given('I have an admin with canBlockUsers permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can unblock a personal user', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canUnblock = visa.determineIf((p: { canUnblockUsers: boolean }) => p.canUnblockUsers);
		});

		Then('permission should be granted', () => {
			expect(canUnblock).toBe(true);
		});
	});

	Scenario('Admin cannot unblock personal users without permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canBlockUsers: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canUnblock: boolean;

		Given('I have an admin without canBlockUsers permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can unblock a personal user', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canUnblock = visa.determineIf((p: { canUnblockUsers: boolean }) => p.canUnblockUsers);
		});

		Then('permission should be denied', () => {
			expect(canUnblock).toBe(false);
		});
	});

	Scenario('Admin can block personal user listings with moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canBlock: boolean;

		Given('I have an admin with canModerateListings permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can block personal user listings', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canBlock = visa.determineIf((p: { canBlockListings: boolean }) => p.canBlockListings);
		});

		Then('permission should be granted', () => {
			expect(canBlock).toBe(true);
		});
	});

	Scenario('Admin cannot block personal user listings without moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canBlock: boolean;

		Given('I have an admin without canModerateListings permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can block personal user listings', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canBlock = visa.determineIf((p: { canBlockListings: boolean }) => p.canBlockListings);
		});

		Then('permission should be denied', () => {
			expect(canBlock).toBe(false);
		});
	});

	Scenario('Admin can unblock personal user listings with moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canUnblock: boolean;

		Given('I have an admin with canModerateListings permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can unblock personal user listings', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canUnblock = visa.determineIf((p: { canUnblockListings: boolean }) => p.canUnblockListings);
		});

		Then('permission should be granted', () => {
			expect(canUnblock).toBe(true);
		});
	});

	Scenario('Admin cannot unblock personal user listings without moderation permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					listingPermissions: { canModerateListings: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canUnblock: boolean;

		Given('I have an admin without canModerateListings permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can unblock personal user listings', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canUnblock = visa.determineIf((p: { canUnblockListings: boolean }) => p.canUnblockListings);
		});

		Then('permission should be denied', () => {
			expect(canUnblock).toBe(false);
		});
	});

	Scenario('Admin can remove personal user listings with delete content permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canDeleteContent: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canRemove: boolean;

		Given('I have an admin with canDeleteContent permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can remove personal user listings', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canRemove = visa.determineIf((p: { canRemoveListings: boolean }) => p.canRemoveListings);
		});

		Then('permission should be granted', () => {
			expect(canRemove).toBe(true);
		});
	});

	Scenario('Admin cannot remove personal user listings without delete content permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canDeleteContent: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canRemove: boolean;

		Given('I have an admin without canDeleteContent permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can remove personal user listings', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canRemove = visa.determineIf((p: { canRemoveListings: boolean }) => p.canRemoveListings);
		});

		Then('permission should be denied', () => {
			expect(canRemove).toBe(false);
		});
	});

	Scenario('Admin can view personal user listing reports with view reports permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewReports: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canView: boolean;

		Given('I have an admin with canViewReports permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can view personal user listing reports', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canView = visa.determineIf((p: { canViewListingReports: boolean }) => p.canViewListingReports);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Admin cannot view personal user listing reports without view reports permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewReports: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canView: boolean;

		Given('I have an admin without canViewReports permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can view personal user listing reports', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canView = visa.determineIf((p: { canViewListingReports: boolean }) => p.canViewListingReports);
		});

		Then('permission should be denied', () => {
			expect(canView).toBe(false);
		});
	});

	Scenario('Admin can view personal user reports with canViewAllUsers permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewAllUsers: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canView: boolean;

		Given('I have an admin with canViewAllUsers permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can view personal user reports', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canView = visa.determineIf((p: { canViewUserReports: boolean }) => p.canViewUserReports);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Admin cannot view personal user reports without canViewAllUsers permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canViewAllUsers: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canView: boolean;

		Given('I have an admin without canViewAllUsers permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can view personal user reports', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canView = visa.determineIf((p: { canViewUserReports: boolean }) => p.canViewUserReports);
		});

		Then('permission should be denied', () => {
			expect(canView).toBe(false);
		});
	});

	Scenario('Admin can manage personal user roles with permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canManageUserRoles: true },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canManage: boolean;

		Given('I have an admin with canManageUserRoles permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can manage personal user roles', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canManage = visa.determineIf((p: { canManageUserRoles: boolean }) => p.canManageUserRoles);
		});

		Then('permission should be granted', () => {
			expect(canManage).toBe(true);
		});
	});

	Scenario('Admin cannot manage personal user roles without permission', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: { canManageUserRoles: false },
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canManage: boolean;

		Given('I have an admin without canManageUserRoles permission', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin can manage personal user roles', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			canManage = visa.determineIf((p: { canManageUserRoles: boolean }) => p.canManageUserRoles);
		});

		Then('permission should be denied', () => {
			expect(canManage).toBe(false);
		});
	});

	Scenario('Admin is not editing personal user\'s own account', ({ Given, When, Then }) => {
		const mockAdmin = {
			id: 'admin-123',
			isBlocked: false,
			role: {
				permissions: {
					userPermissions: {},
				},
			},
		} as AdminUserEntityReference;
		const mockPersonalUser = {
			id: 'personal-user-456',
			isBlocked: false,
		} as PersonalUserEntityReference;
		let passport: AdminUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let isOwnAccount: boolean;

		Given('I have an admin accessing a personal user account', () => {
			passport = new AdminUserUserPassport(mockAdmin);
		});

		When('I check if admin is editing own account', () => {
			visa = passport.forPersonalUser(mockPersonalUser);
			isOwnAccount = visa.determineIf((p: { isEditingOwnAccount: boolean }) => p.isEditingOwnAccount);
		});

		Then('flag should be false', () => {
			expect(isOwnAccount).toBe(false);
		});
	});
});
