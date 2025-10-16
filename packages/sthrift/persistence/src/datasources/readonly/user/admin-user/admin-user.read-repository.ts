import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	AdminUserDataSourceImpl,
	type AdminUserDataSource,
} from './admin-user.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { AdminUserConverter } from '../../../domain/user/admin-user/admin-user.domain-adapter.ts';

export interface AdminUserReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference[]>;
	getAllUsers: (args: {
		page: number;
		pageSize: number;
		searchText?: string;
		adminLevelFilters?: string[];
		statusFilters?: string[];
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<{
		items: Domain.Contexts.User.AdminUser.AdminUserEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null>;
	getByEmail: (
		email: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null>;
	getByUsername: (
		username: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null>;
}

export class AdminUserReadRepositoryImpl implements AdminUserReadRepository {
	private readonly mongoDataSource: AdminUserDataSource;
	private readonly converter: AdminUserConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new AdminUserDataSourceImpl(
			models.User.AdminUser,
		);
		this.converter = new AdminUserConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference[]> {
		const results = await this.mongoDataSource.find({}, options);
		if (!results || results.length === 0) {
			return [];
		}
		return results.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getAllUsers(args: {
		page: number;
		pageSize: number;
		searchText?: string;
		adminLevelFilters?: string[];
		statusFilters?: string[];
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}): Promise<{
		items: Domain.Contexts.User.AdminUser.AdminUserEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		let users = await this.getAll();

		// Apply search filter // move this to shared utils if there are many different account types
		if (args.searchText?.trim()) {
			const query = args.searchText.toLowerCase();
			users = users.filter((u) =>
				[
					u.account?.email,
					u.account?.username,
					u.account?.firstName,
					u.account?.lastName,
				].some((s) => s?.toLowerCase().includes(query)),
			);
		}

		// Apply admin level filters
		if (args.adminLevelFilters?.length) {
			users = users.filter((u) =>
				args.adminLevelFilters?.includes(u.adminLevel),
			);
		}

		// Apply status filters
		if (args.statusFilters?.length) {
			const wantActive = args.statusFilters.includes('Active');
			const wantBlocked = args.statusFilters.includes('Blocked');
			users = users.filter((u) => {
				if (wantActive && !wantBlocked) {
					return !u.isBlocked;
				}
				if (wantBlocked && !wantActive) {
					return u.isBlocked;
				}
				return true;
			});
		}

		// Apply sorter
		if (args.sorter?.field) {
			const { field, order } = args.sorter;
			const dir = order === 'ascend' ? 1 : -1;

			const fieldGetters: Record<
				string,
				(u: Domain.Contexts.User.AdminUser.AdminUserEntityReference) => string | number
			> = {
				email: (u) => u.account?.email ?? '',
				username: (u) => u.account?.username ?? '',
				firstName: (u) => u.account?.firstName ?? '',
				lastName: (u) => u.account?.lastName ?? '',
				adminLevel: (u) => u.adminLevel ?? '',
				accountCreated: (u) => (u.createdAt ? +new Date(u.createdAt) : 0),
				createdAt: (u) => (u.createdAt ? +new Date(u.createdAt) : 0),
				status: (u) => (u.isBlocked ? 1 : 0),
			};

			const getter = fieldGetters[field];
			if (getter) {
				users = [...users].sort((a, b) => {
					const valA = getter(a);
					const valB = getter(b);
					if (typeof valA === 'string' && typeof valB === 'string') {
						return valA.localeCompare(valB) * dir;
					}
					if (valA < valB) {
						return -1 * dir;
					}
					if (valA > valB) {
						return 1 * dir;
					}
					return 0;
				});
			}
		}

		const total = users.length;
		const startIndex = Math.max(0, (args.page - 1) * args.pageSize);
		const items = users.slice(startIndex, startIndex + args.pageSize);

		return {
			items,
			total,
			page: args.page,
			pageSize: args.pageSize,
		};
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByEmail(
		email: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null> {
		const result = await this.mongoDataSource.findOne(
			{ 'account.email': email },
			options,
		);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByUsername(
		username: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.AdminUser.AdminUserEntityReference | null> {
		const result = await this.mongoDataSource.findOne(
			{ 'account.username': username },
			options,
		);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getAdminUserReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new AdminUserReadRepositoryImpl(models, passport);
};
