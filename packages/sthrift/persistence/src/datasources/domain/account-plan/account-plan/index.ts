import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getAccountPlanUnitOfWork } from './account-plan.uow.ts';

export const AccountPlanPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const { AccountPlanModel } = models.AccountPlan;
	return {
		AccountPlanUnitOfWork: getAccountPlanUnitOfWork(AccountPlanModel, passport),
	};
};
