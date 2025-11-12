import type { DataSources } from '@sthrift/persistence';

export interface ItemListingUpdateCommand {
	id: string;
	isBlocked?: boolean;
	isDeleted?: boolean;
	isDeletedByAdmin?: boolean;
}

export const update = (datasources: DataSources) => {
	return async (command: ItemListingUpdateCommand): Promise<void> => {
		const uow =
			datasources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
		if (!uow)
			throw new Error(
				'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
			);

		// Admin deletion: uses domain flow with visa permission checks
		if (command.isDeletedByAdmin === true) {
			await uow.withScopedTransactionById(command.id, async (repo) => {
				const listing = await repo.get(command.id);
				listing.setDeleted(true);
				await repo.save(listing);
			});
			return;
		}


		if (command.isDeleted === true) {
			await uow.withScopedTransaction(async (repo) => {
				const deleted = await repo.hardDeleteById(command.id);
				if (!deleted) {
					throw new Error(`Listing ${command.id} not found or already deleted`);
				}
			});
			return;
		}

		// All other updates use standard domain flow
		await uow.withScopedTransactionById(command.id, async (repo) => {
			const listing = await repo.get(command.id);

			if (command.isBlocked !== undefined) {
				listing.setBlocked(command.isBlocked);
			}

			await repo.save(listing);
		});
	};
};
