import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface GetListingAppealRequestByListingIdCommand {
	listingId: string;
}

export const getByListingId = (dataSources: DataSources) => {
	return async (
		command: GetListingAppealRequestByListingIdCommand,
	): Promise<Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference | null> => {
		const appealRequests =
			await dataSources.domainDataSource.AppealRequest.ListingAppealRequest.getByListingId(
				command.listingId,
			);
		// Return the most recent appeal request for this listing
		if (appealRequests.length > 0) {
			return appealRequests[0];
		}
		return null;
	};
};
