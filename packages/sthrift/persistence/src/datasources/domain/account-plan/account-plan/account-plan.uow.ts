import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import { AccountPlanConverter } from './account-plan.domain-adapter.ts';
import { AccountPlanRepository } from './account-plan.repository.ts';

export const getAccountPlanUnitOfWork = (
	accountPlanModel: Models.AccountPlan.AccountPlanModelType,
	passport: Domain.Passport,
): Domain.Contexts.AccountPlan.AccountPlan.AccountPlanUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		accountPlanModel,
		new AccountPlanConverter(),
		AccountPlanRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
