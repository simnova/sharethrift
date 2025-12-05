import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import type { FindOneOptions } from '../../mongo-data-source.ts';
import { PersonalUserConverter } from '../../../domain/user/personal-user/personal-user.domain-adapter.ts';
import { AdminUserConverter } from '../../../domain/user/admin-user/admin-user.domain-adapter.ts';
import { type UserDataSource, UserDataSourceImpl } from './user.data.ts';

class UserConverter {
	toDomain(
		user: Models.User.User,
		passport: Domain.Passport,
	): Domain.Contexts.User.UserEntityReference | null {
		const { userType } = user as unknown as { userType: string };
		if (userType === 'personal-users') {
			const converter = new PersonalUserConverter();
			return converter.toDomain(user as Models.User.PersonalUser, passport);
		}
		if (userType === 'admin-user') {
			const converter = new AdminUserConverter();
			return converter.toDomain(user as Models.User.AdminUser, passport);
		}
		return null;
	}
}
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
	private readonly mongoDataSource: UserDataSource;
	private readonly converter: UserConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new UserDataSourceImpl(models.User.User);
		this.converter = new UserConverter();
		this.passport = passport;
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.UserEntityReference | null> {
		const user = await this.mongoDataSource.findById(id, options);
		if (!user) {
			return null;
		}
		return this.converter.toDomain(user, this.passport);
	}

	async getByEmail(
		email: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.User.UserEntityReference | null> {
		const user = await this.mongoDataSource.findOne(
			{ 'account.email': email },
			options,
		);
		if (!user) {
			return null;
		}
		return this.converter.toDomain(user, this.passport);
	}
}

export function getUserReadRepository(
	models: ModelsContext,
	passport: Domain.Passport,
): UserReadRepository {
	return new UserReadRepositoryImpl(models, passport);
}
