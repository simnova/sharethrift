import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingCancelCommand {
	id: string;
}

export const cancel = (dataSources: DataSources) => {
	return async (
		command: ItemListingCancelCommand,
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

				listing.cancel();
				itemListingToReturn = await repo.save(listing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not cancelled');
		}
		return itemListingToReturn;
	};
};
