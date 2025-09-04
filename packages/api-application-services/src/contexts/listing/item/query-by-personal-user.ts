import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ItemListingQueryByPersonalUserCommand {
	personalUser: string;
	fields?: string[];
}

export const queryByPersonalUser = (dataSources: DataSources) => {
	return async (
		command: ItemListingQueryByPersonalUserCommand,
	): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Listing.ItemListing.ItemReadRepo.getByPersonalUserExternalId(
			command.personalUser,
		);
	};
};
