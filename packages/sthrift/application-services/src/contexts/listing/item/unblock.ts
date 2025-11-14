import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingUnblockCommand {
	id: string;
	isBlocked: boolean;
}

export const unblock = (dataSources: DataSources) => {
	return async (
		command: ItemListingUnblockCommand,
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

				listing.setBlocked(command.isBlocked);
				itemListingToReturn = await repo.save(listing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not updated');
		}
		return itemListingToReturn;
	};
};
