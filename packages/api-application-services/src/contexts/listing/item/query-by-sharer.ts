import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ItemListingQueryBySharerCommand {
	personalUser: string;
	fields?: string[];
}

export const queryBySharer = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryBySharerCommand,
	): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getBySharer(
			command.personalUser,
		);
	};
};
