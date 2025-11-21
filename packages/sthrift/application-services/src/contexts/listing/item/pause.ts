import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingPauseCommand {
	id: string;
	userEmail: string;
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

				// Ownership check: only the sharer who owns the listing can pause it
				if (listing.sharer?.account?.email !== command.userEmail) {
					throw new Error('Only the listing owner can pause this listing');
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
