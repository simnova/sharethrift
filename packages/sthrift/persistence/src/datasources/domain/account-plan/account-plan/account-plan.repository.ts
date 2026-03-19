import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class AccountPlanRepository<
		PropType extends Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps,
	>
	extends MongooseSeedwork.MongoRepositoryBase<
		Models.AccountPlan.AccountPlan,
		PropType,
		Domain.Passport,
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<PropType>
	>
	implements
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlanRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<PropType>> {
		const user = await this.model.findOne({ _id: id }).exec();
		if (!user) {
			throw new Error(`AccountPlan with id ${id} not found`);
		}
		return this.typeConverter.toDomain(user, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(planInfo: {
		name: string;
		description: string;
		billingPeriodLength: number;
		billingPeriodUnit: string;
		billingCycles: number;
		billingAmount: number;
		currency: string;
		setupFee: number;
		feature: {
			activeReservations: number;
			bookmarks: number;
			itemsToShare: number;
			friends: number;
		};
	}): Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Domain.Contexts.AccountPlan.AccountPlan.AccountPlan.getNewInstance(
			adapter,
			this.passport,
			planInfo,
		);
	}

	async getAll(): Promise<
		Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<PropType>[]
	> {
		const results = await this.model.find().exec();
		return results.map((doc) =>
			this.typeConverter.toDomain(doc, this.passport),
		);
	}
}
