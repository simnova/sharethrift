import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingPauseCommand {
	id: string;
}

export const pause = (dataSources: DataSources) => {
	return async (
		command: ItemListingPauseCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> => {
		let itemListingToReturn:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| undefined;
		await dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction(
			async (repo) => {
				const listing = await repo.getById(command.id);
				if (!listing) {
					throw new Error('Listing not found');
				}

				listing.pause();
				itemListingToReturn = await repo.save(listing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not paused');
		}
		return itemListingToReturn;
	};
};

