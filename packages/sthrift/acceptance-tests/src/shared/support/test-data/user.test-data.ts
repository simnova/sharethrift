import { Domain } from '@sthrift/domain';
import type { VerifiedUser } from '@sthrift/application-services';
import { generateObjectId } from './utils.js';

type PersonalUserEntityReference = Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
type AdminUserEntityReference = Domain.Contexts.User.AdminUser.AdminUserEntityReference;

const users = new Map<string, PersonalUserEntityReference>();

function createMockUser(email: string, firstName: string, lastName: string): PersonalUserEntityReference {
	const id = generateObjectId();
	return {
		id,
		userType: 'personal-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'email',
			email,
			username: email.split('@')[0],
			profile: {
				firstName,
				lastName,
				aboutMe: '',
				location: {
					address1: '',
					address2: null,
					city: '',
					state: '',
					country: '',
					zipCode: '',
				} as unknown,
				billing: {} as unknown,
			},
		},
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
	} as unknown as PersonalUserEntityReference;
}

export function getOrCreateUser(email: string, firstName?: string, lastName?: string): PersonalUserEntityReference {
	let user = users.get(email);
	if (!user) {
		user = createMockUser(
			email,
			firstName || email.split('@')[0] || 'Test',
			lastName || 'Test',
		);
		users.set(email, user);
	}
	return user;
}

export function getUserById(id: string): PersonalUserEntityReference | null {
	for (const user of users.values()) {
		if (user.id === id) {
			return user;
		}
	}
	return null;
}

export function getAllUsers(): PersonalUserEntityReference[] {
	return Array.from(users.values());
}

export function clearUsers(): void {
	users.clear();
	clearMockAdminUsers();
}

// Pre-create Alice for tests
export const aliceUser = getOrCreateUser('alice@test.com', 'Alice', 'Test');

const adminUsers = new Map<string, AdminUserEntityReference>();

export function createMockAdminUser(email?: string, firstName?: string, lastName?: string): AdminUserEntityReference {
	const adminUser = {
		id: generateObjectId(),
		userType: 'admin-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		role: {},
		loadRole: async () => ({}),
		account: {
			accountType: 'admin',
			email: email || 'admin@test.com',
			username: (email?.split('@')[0]) || 'admin',
			profile: {
				firstName: firstName || 'Admin',
				lastName: lastName || 'User',
				aboutMe: '',
				location: {
					address1: '123 Test St',
					address2: null,
					city: 'Seattle',
					state: 'WA',
					country: 'US',
					zipCode: '98101',
				},
				billing: {
					cybersourceCustomerId: null,
					subscription: {
						status: 'inactive',
						planCode: 'free',
						startDate: new Date('2020-01-01'),
						subscriptionId: null,
					},
					transactions: {
						items: [],
						getNewItem: () => ({}),
						addItem: () => { /* no-op */ },
						removeItem: () => { /* no-op */ },
						removeAll: () => { /* no-op */ },
					},
				},
			},
		},
		schemaVersion: '1.0.0',
		createdAt: new Date(),
		updatedAt: new Date(),
	} as unknown as AdminUserEntityReference;
	adminUsers.set(adminUser.id, adminUser);
	return adminUser;
}

export function getMockAdminUserById(id: string): AdminUserEntityReference | null {
	return adminUsers.get(id) ?? null;
}

export function getAllMockAdminUsers(): AdminUserEntityReference[] {
	return Array.from(adminUsers.values());
}

export function clearMockAdminUsers(): void {
	adminUsers.clear();
}

export function getVerifiedUserFromMock(user: PersonalUserEntityReference): VerifiedUser {
	return {
		verifiedJwt: {
			email: user.account.email,
			given_name: user.account.profile.firstName,
			family_name: user.account.profile.lastName,
			sub: user.id,
		},
		openIdConfigKey: 'UserPortal',
		hints: undefined,
	};
}
