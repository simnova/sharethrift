import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

// --- FAKE: test coverage pipeline ---
export function normalizePlanName(name: string): string {
	const trimmed = name.trim().toLowerCase();
	if (trimmed.length === 0) {
		throw new Error('Plan name cannot be empty');
	}
	return trimmed.replaceAll(/\s+/g, '-').replaceAll(/[^a-z0-9-]/g, '');
}
// --- END FAKE ---

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
