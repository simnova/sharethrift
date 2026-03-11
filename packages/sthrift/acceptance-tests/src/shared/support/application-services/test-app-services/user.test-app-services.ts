import type { Domain } from '@sthrift/domain';
import {
	createMockAdminUser,
	createMockUser,
	users,
} from '../../test-data/user.test-data.js';

interface PersonalUserQueryByIdCommand {
	id: string;
	fields?: string[];
}

interface PersonalUserQueryByEmailCommand {
	email: string;
}

interface GetAllUsersCommand {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: string };
}

interface UserQueryByIdCommand {
	id: string;
	fields?: string[];
}

interface GetAllAdminUsersCommand {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: string };
}

interface MockUserContextApplicationService {
	PersonalUser: {
		createIfNotExists: () => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
		queryById: (command: PersonalUserQueryByIdCommand) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
		update: () => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
		queryByEmail: (command: PersonalUserQueryByEmailCommand) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
		getAllUsers: (command: GetAllUsersCommand) => Promise<{ items: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[]; total: number; page: number; pageSize: number }>;
		processPayment: () => Promise<{ id: string; status: string; success: boolean }>;
		generatePublicKey: () => Promise<string>;
		refundPayment: () => Promise<{ id: string; status: string; success: boolean }>;
	};
	AdminUser: {
		createIfNotExists: () => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
		queryById: () => Promise<null>;
		queryByEmail: () => Promise<null>;
		queryByUsername: () => Promise<null>;
		update: () => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
		getAllUsers: (command: GetAllAdminUsersCommand) => Promise<{ items: Domain.Contexts.User.AdminUser.AdminUserEntityReference[]; total: number; page: number; pageSize: number }>;
		blockUser: () => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
		unblockUser: () => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference>;
	};
	User: {
		queryById: (command: UserQueryByIdCommand) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
	};
}

export function createMockUserService(): MockUserContextApplicationService {
	const allUsers = Array.from(users.values());
	const alice = allUsers.find((u) => u.account.email === 'alice@example.com') as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;

	return {
		PersonalUser: {
			createIfNotExists: async () => alice,
			queryById: (command: PersonalUserQueryByIdCommand) => {
				const user = users.get(command.id);
				return Promise.resolve(user && user.userType === 'personal-user' ? (user as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) : null);
			},
			update: async () => alice,
			queryByEmail: (command: PersonalUserQueryByEmailCommand) => {
				const newUser = createMockUser(command.email, command.email.split('@')[0] || 'User', 'Test');
				return Promise.resolve(newUser);
			},
			getAllUsers: (command: GetAllUsersCommand) => {
				const personalUsers = allUsers.filter((u) => u.userType === 'personal-user') as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[];
				return Promise.resolve({
					items: personalUsers,
					total: personalUsers.length,
					page: command.page,
					pageSize: command.pageSize,
				});
			},
			processPayment: async () => ({
				id: 'mock-txn',
				status: 'SUCCEEDED',
				success: true,
			}),
			generatePublicKey: async () => 'mock-public-key',
			refundPayment: async () => ({
				id: 'mock-refund',
				status: 'REFUNDED',
				success: true,
			}),
		},
		AdminUser: {
			createIfNotExists: () => Promise.resolve(createMockAdminUser()),
			queryById: () => Promise.resolve(null),
			queryByEmail: () => Promise.resolve(null),
			queryByUsername: () => Promise.resolve(null),
			update: () => Promise.resolve(createMockAdminUser()),
			getAllUsers: (command: GetAllAdminUsersCommand) => {
				const adminUsers = allUsers.filter((u) => u.userType === 'admin-user') as Domain.Contexts.User.AdminUser.AdminUserEntityReference[];
				return Promise.resolve({ items: adminUsers, total: adminUsers.length, page: command.page, pageSize: command.pageSize });
			},
			blockUser: () => Promise.resolve(createMockAdminUser()),
			unblockUser: () => Promise.resolve(createMockAdminUser()),
		},
		User: {
			queryById: (command: UserQueryByIdCommand) => {
				const user = users.get(command.id);
				return Promise.resolve(user && user.userType === 'personal-user' ? (user as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) : null);
			},
		},
	};
}
