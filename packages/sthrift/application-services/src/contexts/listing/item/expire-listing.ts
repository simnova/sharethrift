import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ExpireListingCommand {
	listingId: string;
}

export const expireListing = (dataSources: DataSources) => {
	return async (
		command: ExpireListingCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> => {
		let expiredListing:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| null = null;

		await dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction(
			async (repo) => {
				const uow = await repo.getById(command.listingId);

				if (!uow) {
					return;
				}

				// Expire the listing
				uow.expire();

				// Save changes
				expiredListing = await repo.save(uow);
			},
		);

		return expiredListing;
	};
};
