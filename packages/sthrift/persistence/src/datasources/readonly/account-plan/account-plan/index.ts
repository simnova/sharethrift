import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getAccountPlanReadRepository } from './account-plan.read-repository.ts';
export type { AccountPlanReadRepository } from './account-plan.read-repository.ts';
export const AccountPlanReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		AccountPlanReadRepo: getAccountPlanReadRepository(models, passport),
	};
};
