import type { Domain } from '@sthrift/domain';
import {
	aliceUser,
	createMockAdminUser,
	getAllMockAdminUsers,
	getAllUsers,
	getOrCreateUser,
	getUserById,
} from '../test-data/user.test-data.js';

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
	return {
		PersonalUser: {
			createIfNotExists: async () => aliceUser,
			queryById: (command: PersonalUserQueryByIdCommand) => {
				return Promise.resolve(getUserById(command.id) ?? aliceUser);
			},
			update: async () => aliceUser,
			queryByEmail: (command: PersonalUserQueryByEmailCommand) => {
				return Promise.resolve(getOrCreateUser(command.email) ?? null);
			},
			getAllUsers: (command: GetAllUsersCommand) => {
				const allUsers = getAllUsers();
				return Promise.resolve({
					items: allUsers,
					total: allUsers.length,
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
				const all = getAllMockAdminUsers();
				return Promise.resolve({ items: all, total: all.length, page: command.page, pageSize: command.pageSize });
			},
			blockUser: () => Promise.resolve(createMockAdminUser()),
			unblockUser: () => Promise.resolve(createMockAdminUser()),
		},
		User: {
			queryById: (command: UserQueryByIdCommand) => {
				return Promise.resolve(getUserById(command.id) ?? null);
			},
		},
	};
}
