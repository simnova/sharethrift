import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AccountPlanQueryAllCommand {
	fields?: string[];
}

export const queryAll = (dataSources: DataSources) => {
	return async (
		command: AccountPlanQueryAllCommand,
	): Promise<
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.AccountPlan.AccountPlan.AccountPlanReadRepo.getAll(
			{ fields: command.fields },
		);
	};
};
