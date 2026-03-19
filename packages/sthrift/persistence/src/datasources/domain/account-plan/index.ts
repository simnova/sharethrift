import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { AccountPlanPersistence } from './account-plan/index.ts';

export const AccountPlanContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	AccountPlan: AccountPlanPersistence(models, passport),
});
