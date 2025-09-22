import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ItemListingQueryAllCommand {
	fields?: string[];
}

export const queryAll = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryAllCommand,
	): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAll(
			{ fields: command.fields },
		);
	};
};
