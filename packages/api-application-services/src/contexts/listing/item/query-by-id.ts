import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ItemListingQueryByIdCommand {
	id: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryByIdCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
			command.id,
			{ fields: command.fields },
		);
	};
};
