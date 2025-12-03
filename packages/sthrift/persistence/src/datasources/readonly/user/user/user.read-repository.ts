import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import type { FindOneOptions } from '../../mongo-data-source.ts';
import { PersonalUserConverter } from '../../../domain/user/personal-user/personal-user.domain-adapter.ts';
import { AdminUserConverter } from '../../../domain/user/admin-user/admin-user.domain-adapter.ts';
import {
	type PersonalUserDataSource,
	PersonalUserDataSourceImpl,
} from '../personal-user/personal-user.data.ts';
import {
	type AdminUserDataSource,
	AdminUserDataSourceImpl,
} from '../admin-user/admin-user.data.ts';

export interface UserReadRepository {
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.UserEntityReference | null>;
	getByEmail: (
		email: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.User.UserEntityReference | null>;
}

export class UserReadRepositoryImpl implements UserReadRepository {
	private readonly personalUserMongoDataSource: PersonalUserDataSource;
	private readonly adminUserMongoDataSource: AdminUserDataSource;

	private readonly personalUserConverter: PersonalUserConverter;
	private readonly adminUserConverter: AdminUserConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.personalUserMongoDataSource = new PersonalUserDataSourceImpl(
			models.User.PersonalUser,
		);
		this.adminUserMongoDataSource = new AdminUserDataSourceImpl(
			models.User.AdminUser,
		);
		this.personalUserConverter = new PersonalUserConverter();
		this.adminUserConverter = new AdminUserConverter();
		this.passport = passport;
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.UserEntityReference | null> {
		// Try PersonalUser first
		const personalUser = await this.personalUserMongoDataSource.findById(
			id,
			options,
		);
		if (personalUser) {
			return this.personalUserConverter.toDomain(personalUser, this.passport);
		}

		// Try AdminUser
		const adminUser = await this.adminUserMongoDataSource.findById(id);
		if (adminUser) {
			return this.adminUserConverter.toDomain(adminUser, this.passport);
		}

		return null;
	}

	async getByEmail(
		email: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.UserEntityReference | null> {
		// Try PersonalUser first
		const personalUser = await this.personalUserMongoDataSource.findOne(
			{ 'account.email': email },
			options,
		);
		if (personalUser) {
			return this.personalUserConverter.toDomain(personalUser, this.passport);
		}

		// Try AdminUser
		const adminUser = await this.adminUserMongoDataSource.findOne(
			{ 'account.email': email },
			options,
		);
		if (adminUser) {
			return this.adminUserConverter.toDomain(adminUser, this.passport);
		}
		return null;
	}
}

export const getUserReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new UserReadRepositoryImpl(models, passport);
};
