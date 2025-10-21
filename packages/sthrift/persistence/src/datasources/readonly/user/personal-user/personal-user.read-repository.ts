import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	PersonalUserDataSourceImpl,
	type PersonalUserDataSource,
} from './personal-user.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { PersonalUserConverter } from '../../../domain/user/personal-user/personal-user.domain-adapter.ts';

export interface PersonalUserReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[]>;
	getAllUsers: (args: {
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilters?: string[];
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<{
		items: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
	getByEmail: (
		email: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
}

export class PersonalUserReadRepositoryImpl
	implements PersonalUserReadRepository
{
	private readonly mongoDataSource: PersonalUserDataSource;
	private readonly converter: PersonalUserConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new PersonalUserDataSourceImpl(
			models.User.PersonalUser,
		);
		this.converter = new PersonalUserConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[]> {
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
		statusFilters?: string[];
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}): Promise<{
		items: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		let users = await this.getAll();

		// Apply search filter
		if (args.searchText?.trim()) {
			const query = args.searchText.toLowerCase();
			users = users.filter((u) =>
				[
					u.account?.email,
					u.account?.username,
					u.account?.profile?.firstName,
					u.account?.profile?.lastName,
				].some((s) => s?.toLowerCase().includes(query)),
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
				(
					u: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
				) => string | number
			> = {
				email: (u) => u.account?.email ?? '',
				username: (u) => u.account?.username ?? '',
				firstName: (u) => u.account?.profile?.firstName ?? '',
				lastName: (u) => u.account?.profile?.lastName ?? '',
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
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByEmail(
		email: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null> {
		const result = await this.mongoDataSource.findOne(
			{ 'account.email': email },
			options,
		);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getPersonalUserReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new PersonalUserReadRepositoryImpl(models, passport);
};
