import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingQueryByIdCommand {
	id: string;
	fields?: string[];
	isAdmin?: boolean;
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryByIdCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
			command.id,
			{ 
				fields: command.fields,
				isAdmin: command.isAdmin ?? false,
			},
		);
	};
};
