import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AccountPlanQueryByNameCommand {
	planName: string;
	fields?: string[];
}

export const queryByName = (dataSources: DataSources) => {
	return async (
		command: AccountPlanQueryByNameCommand,
	): Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference | null> => {
		return await dataSources.readonlyDataSource.AccountPlan.AccountPlan.AccountPlanReadRepo.getByName(
			command.planName,
		);
	};
};
