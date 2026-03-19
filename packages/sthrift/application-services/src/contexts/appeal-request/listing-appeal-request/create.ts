import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface CreateListingAppealRequestCommand {
	userId: string;
	listingId: string;
	reason: string;
	blockerId: string;
}

export const create = (dataSources: DataSources) => {
	return async (
		command: CreateListingAppealRequestCommand,
	): Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference> => {
		let appealRequestToReturn:
			| Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference
			| undefined;
		await dataSources.domainDataSource.AppealRequest.ListingAppealRequest.ListingAppealRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newAppealRequest = await repo.getNewInstance(
					command.userId,
					command.listingId,
					command.reason,
					command.blockerId,
				);
				appealRequestToReturn = await repo.save(newAppealRequest);
			},
		);
		if (!appealRequestToReturn) {
			throw new Error('Failed to create listing appeal request');
		}
		return appealRequestToReturn;
	};
};
