import type { Domain } from '@sthrift/domain';
import {
	createMockAccountPlan,
	getAllMockAccountPlans,
} from '../../test-data/account-plan.test-data.ts';

interface MockAccountPlanContextApplicationService {
	AccountPlan: {
		create: () => Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference>;
		queryAll: () => Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[]>;
		queryById: () => Promise<null>;
		queryByName: () => Promise<null>;
	};
}

export function createMockAccountPlanService(): MockAccountPlanContextApplicationService {
	return {
		AccountPlan: {
			create: () => Promise.resolve(createMockAccountPlan()),
			queryAll: () => Promise.resolve(getAllMockAccountPlans()),
			queryById: () => Promise.resolve(null),
			queryByName: () => Promise.resolve(null),
		},
	};
}
