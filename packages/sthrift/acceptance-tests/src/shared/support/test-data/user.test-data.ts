import { Domain } from '@sthrift/domain';
import type { VerifiedUser } from '@sthrift/application-services';
import { generateObjectId } from './utils.js';

type PersonalUserEntityReference = Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
type AdminUserEntityReference = Domain.Contexts.User.AdminUser.AdminUserEntityReference;
type UserEntityReference = PersonalUserEntityReference | AdminUserEntityReference;

const aliceId = generateObjectId();
const adminId = generateObjectId();

export const users = new Map<string, UserEntityReference>([
	[
		aliceId,
		{
			id: aliceId,
			userType: 'personal-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			account: {
				accountType: 'email',
				email: 'alice@example.com',
				username: 'alice',
				profile: {
					firstName: 'Alice',
					lastName: 'Smith',
					aboutMe: '',
					location: {
						address1: '',
						address2: null,
						city: '',
						state: '',
						country: '',
						zipCode: '',
					},
					billing: {},
				},
			},
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
		} as PersonalUserEntityReference,
	],
	[
		adminId,
		{
			id: adminId,
			userType: 'admin-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			role: {
				id: generateObjectId(),
				roleName: 'Admin',
				isDefault: true,
				roleType: 'admin',
			} as unknown,
			loadRole: async () => ({
				id: generateObjectId(),
				roleName: 'Admin',
				isDefault: true,
				roleType: 'admin',
			} as unknown),
			account: {
				accountType: 'admin',
				email: 'admin@test.com',
				username: 'admin',
				profile: {
					firstName: 'Admin',
					lastName: 'User',
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
		} as AdminUserEntityReference,
	],
]);

export function createMockUser(email: string, firstName: string, lastName: string): PersonalUserEntityReference {
	const id = generateObjectId();
	const user = {
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
				},
				billing: {},
			},
		},
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
	} as PersonalUserEntityReference;
	users.set(id, user);
	return user;
}

export function createMockAdminUser(email?: string, firstName?: string, lastName?: string): AdminUserEntityReference {
	const adminUser = {
		id: generateObjectId(),
		userType: 'admin-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		role: {
			id: generateObjectId(),
			roleName: 'Admin',
			isDefault: true,
			roleType: 'admin',
		} as unknown,
		loadRole: async () => ({
			id: generateObjectId(),
			roleName: 'Admin',
			isDefault: true,
			roleType: 'admin',
		} as unknown),
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
	} as AdminUserEntityReference;
	users.set(adminUser.id, adminUser);
	return adminUser;
}

export function getMockUserById(id: string): UserEntityReference | null {
	return users.get(id) ?? null;
}

export function getAllMockUsers(): UserEntityReference[] {
	return Array.from(users.values());
}

export function clearUsers(): void {
	users.clear();
	// Recreate defaults
	const alice = users.get(aliceId);
	const admin = users.get(adminId);
	if (!alice) {
		users.set(aliceId, {
			id: aliceId,
			userType: 'personal-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			account: {
				accountType: 'email',
				email: 'alice@example.com',
				username: 'alice',
				profile: {
					firstName: 'Alice',
					lastName: 'Smith',
					aboutMe: '',
					location: { address1: '', address2: null, city: '', state: '', country: '', zipCode: '' },
					billing: {},
				},
			},
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
		} as PersonalUserEntityReference);
	}
	if (!admin) {
		users.set(adminId, {
			id: adminId,
			userType: 'admin-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			role: { id: generateObjectId(), roleName: 'Admin', isDefault: true, roleType: 'admin' } as unknown,
			loadRole: async () => ({ id: generateObjectId(), roleName: 'Admin', isDefault: true, roleType: 'admin' } as unknown),
			account: {
				accountType: 'admin',
				email: 'admin@test.com',
				username: 'admin',
				profile: {
					firstName: 'Admin',
					lastName: 'User',
					aboutMe: '',
					location: { address1: '123 Test St', address2: null, city: 'Seattle', state: 'WA', country: 'US', zipCode: '98101' },
					billing: {
						cybersourceCustomerId: null,
						subscription: { status: 'inactive', planCode: 'free', startDate: new Date('2020-01-01'), subscriptionId: null },
						transactions: { items: [], getNewItem: () => ({}), addItem: () => { /* no-op */ }, removeItem: () => { /* no-op */ }, removeAll: () => { /* no-op */ } },
					},
				},
			},
			schemaVersion: '1.0.0',
			createdAt: new Date(),
			updatedAt: new Date(),
		} as AdminUserEntityReference);
	}
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
