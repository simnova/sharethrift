import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class ListingAppealRequestRepository<
		PropType extends Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestProps,
	>
	extends MongooseSeedwork.MongoRepositoryBase<
		Models.AppealRequest.ListingAppealRequest,
		PropType,
		Domain.Passport,
		Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest<PropType>
	>
	implements
		Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestRepository<PropType>
{
	async getById(
		id: string,
	): Promise<
		Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest<PropType>
	> {
		const appealRequest = await this.model.findOne({ _id: id }).exec();
		if (!appealRequest) {
			throw new Error(`ListingAppealRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(appealRequest, this.passport);
	}

	getNewInstance(
		userId: string,
		listingId: string,
		reason: string,
		blockerId: string,
	): Promise<
		Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest<PropType>
	> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest.getNewInstance(
				adapter,
				this.passport,
				userId,
				listingId,
				reason,
				blockerId,
			),
		);
	}
}
