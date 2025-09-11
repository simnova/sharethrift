import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
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
		return results.map((doc) => this.converter.toDomain(doc, this.passport));
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
