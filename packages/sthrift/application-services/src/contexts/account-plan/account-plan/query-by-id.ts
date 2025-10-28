import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AccountPlanQueryByIdCommand {
	accountPlanId: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: AccountPlanQueryByIdCommand,
	): Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null> => {
		return await dataSources.readonlyDataSource.AccountPlan.AccountPlan.AccountPlanReadRepo.getById(
			command.accountPlanId,
			{ fields: command.fields },
		);
	};
};
