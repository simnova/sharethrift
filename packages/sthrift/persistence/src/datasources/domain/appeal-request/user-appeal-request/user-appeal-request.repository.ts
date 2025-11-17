import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class UserAppealRequestRepository<
		PropType extends Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestProps,
	>
	extends MongooseSeedwork.MongoRepositoryBase<
		Models.AppealRequest.UserAppealRequest,
		PropType,
		Domain.Passport,
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest<PropType>
	>
	implements
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestRepository<PropType>
{
	async getById(
		id: string,
	): Promise<
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest<PropType>
	> {
		const appealRequest = await this.model.findOne({ _id: id }).exec();
		if (!appealRequest) {
			throw new Error(`UserAppealRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(appealRequest, this.passport);
	}

	getNewInstance(
		userId: string,
		reason: string,
		blockerId: string,
	): Promise<
		Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest<PropType>
	> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequest.getNewInstance(
				adapter,
				this.passport,
				userId,
				reason,
				blockerId,
			),
		);
	}
}
