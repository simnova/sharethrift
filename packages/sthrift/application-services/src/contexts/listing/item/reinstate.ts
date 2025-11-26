import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingReinstateCommand {
	id: string;
}

export const reinstate = (dataSources: DataSources) => {
	return async (
		command: ItemListingReinstateCommand,
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

				listing.reinstate();
				itemListingToReturn = await repo.save(listing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not reinstated');
		}
		return itemListingToReturn;
	};
};
