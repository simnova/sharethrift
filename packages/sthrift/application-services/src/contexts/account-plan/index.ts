import type { DataSources } from '@sthrift/persistence';
import {
	AccountPlan as AccountPlanApi,
	type AccountPlanApplicationService,
} from './account-plan/index.ts';

export interface AccountPlanContextApplicationService {
	AccountPlan: AccountPlanApplicationService;
}

export const AccountPlan = (
	dataSources: DataSources,
): AccountPlanContextApplicationService => {
	return {
		AccountPlan: AccountPlanApi(dataSources),
	};
};
