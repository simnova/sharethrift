import type { DataSources } from '@sthrift/persistence';

export interface ItemListingUpdateCommand {
	id: string;
	isBlocked?: boolean;
	isDeleted?: boolean;
}

export const update = (datasources: DataSources) => {
	return async (command: ItemListingUpdateCommand): Promise<void> => {
		const uow =
			datasources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
		if (!uow)
			throw new Error(
				'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
			);

		await uow.withScopedTransactionById(command.id, async (repo) => {
			const listing = await repo.get(command.id);

			if (command.isBlocked !== undefined) {
				listing.setBlocked(command.isBlocked);
			}

			if (command.isDeleted !== undefined) {
				listing.setDeleted(command.isDeleted);
			}

			await repo.save(listing);
		});
	};
};
