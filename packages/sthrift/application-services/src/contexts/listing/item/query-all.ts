import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingQueryAllCommand {
	fields?: string[];
	isAdmin?: boolean;
}

export const queryAll = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryAllCommand,
	): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAll(
			{ fields: command.fields, isAdmin: command.isAdmin ?? false },
		);
	};
};
