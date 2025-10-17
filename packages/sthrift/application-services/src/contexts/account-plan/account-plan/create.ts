import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface AccountPlanCreateCommand {
	name: string;
	description: string;
	billingPeriodLength: number;
	billingPeriodUnit: string;
	billingCycles: number;
	billingAmount: number;
	currency: string;
	setupFee: number;
	feature: Domain.Contexts.AccountPlan.AccountPlan.AccountPlanFeatureProps;
}

export const create = (dataSources: DataSources) => {
	return async (command: AccountPlanCreateCommand) => {
		let accountPlanToReturn:
			| Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference
			| undefined;
		await dataSources.domainDataSource.AccountPlan.AccountPlan.AccountPlanUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newAccountPlan = await repo.getNewInstance({
					name: command.name,
					description: command.description,
					billingPeriodLength: command.billingPeriodLength,
					billingPeriodUnit: command.billingPeriodUnit,
					billingCycles: command.billingCycles,
					billingAmount: command.billingAmount,
					currency: command.currency,
					setupFee: command.setupFee,
					feature: command.feature,
				});
				accountPlanToReturn = await repo.save(newAccountPlan);
			},
		);
		if (!accountPlanToReturn) {
			throw new Error('Account plan not found');
		}
		return accountPlanToReturn;
	};
};
