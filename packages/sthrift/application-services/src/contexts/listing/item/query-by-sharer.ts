import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingQueryBySharerCommand {
	personalUser: string;
	fields?: string[];
	isAdmin?: boolean;
}

export const queryBySharer = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryBySharerCommand,
	): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getBySharer(
			command.personalUser,
			{ isAdmin: command.isAdmin ?? false },
		);
	};
};
