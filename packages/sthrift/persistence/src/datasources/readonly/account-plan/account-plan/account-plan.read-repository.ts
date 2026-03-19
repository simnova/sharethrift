import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { AccountPlanConverter } from '../../../domain/account-plan/account-plan/account-plan.domain-adapter.ts';
import {
	type AccountPlanDataSource,
	AccountPlanDataSourceImpl,
} from '../account-plan/account-plan.data.ts';

export interface AccountPlanReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[]
	>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null>;
	getByName: (
		name: string,
	) => Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null>;
}

export class AccountPlanReadRepositoryImpl
	implements AccountPlanReadRepository
{
	private readonly mongoDataSource: AccountPlanDataSource;
	private readonly converter: AccountPlanConverter;
	private readonly passport: Domain.Passport;
	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new AccountPlanDataSourceImpl(
			models.AccountPlan.AccountPlanModel,
		);
		this.converter = new AccountPlanConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[]
	> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByName(
		name: string,
	): Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null> {
		const result = await this.mongoDataSource.findOne({ name });
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export function getAccountPlanReadRepository(
	models: ModelsContext,
	passport: Domain.Passport,
): AccountPlanReadRepository {
	return new AccountPlanReadRepositoryImpl(models, passport);
}
