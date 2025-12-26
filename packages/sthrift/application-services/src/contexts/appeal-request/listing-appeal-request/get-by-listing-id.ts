import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface GetListingAppealRequestByListingIdCommand {
	listingId: string;
}

export const getByListingId = (dataSources: DataSources) => {
	return async (
		command: GetListingAppealRequestByListingIdCommand,
	): Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference | null> => {
		return await dataSources.readonlyDataSource.AppealRequest.ListingAppealRequest.ListingAppealRequestReadRepo.getByListingId(
			command.listingId,
		);
	};
};
