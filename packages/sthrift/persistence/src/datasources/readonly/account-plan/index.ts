import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { AccountPlanReadRepositoryImpl } from './account-plan/index.ts';

export const AccountPlanContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	AccountPlan: AccountPlanReadRepositoryImpl(models, passport),
});
