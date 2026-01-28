import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingQueryAllCommand {
	fields?: string[];
	excludeStates?: string[];
}

export const queryAll = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryAllCommand,
	): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	> => {
		const options: Parameters<
			typeof dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAll
		>[0] = {
			...(command.fields && { fields: command.fields }),
			...(command.excludeStates && { excludeStates: command.excludeStates }),
		};

		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAll(
			options,
		);
	};
};
