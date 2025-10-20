import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type AccountPlanCreateCommand, create } from './create.ts';
import { type AccountPlanQueryAllCommand, queryAll } from './query-all.ts';
import { type AccountPlanQueryByIdCommand, queryById } from './query-by-id.ts';
export interface AccountPlanApplicationService {
	create: (
		command: AccountPlanCreateCommand,
	) => Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference>;
	queryAll: (
		command: AccountPlanQueryAllCommand,
	) => Promise<
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[]
	>;
	queryById: (
		command: AccountPlanQueryByIdCommand,
	) => Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null>;
}

export const AccountPlan = (
	dataSources: DataSources,
): AccountPlanApplicationService => {
	return {
		create: create(dataSources),
		queryAll: queryAll(dataSources),
		queryById: queryById(dataSources),
	};
};
