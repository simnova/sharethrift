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

		// For deletion operations, bypass domain layer due to circular reference in visa pattern
		// Permission checks are enforced in GraphQL resolver layer (ownership validation)
		// Per BRD requirements, deletion removes data directly from the system
		if (command.isDeleted === true) {
			// Access MongoDB model directly through UOW without loading domain entity
			await uow.withScopedTransaction(async (repo) => {
				// Cast to access internal model property - bypasses domain layer to avoid circular ref
				type RepoWithModel = { model: { deleteOne: (filter: { _id: string }) => { exec: () => Promise<{ deletedCount: number }> } } };
				const result = await (repo as unknown as RepoWithModel).model.deleteOne({ 
					_id: command.id 
				}).exec();
				
				if (result.deletedCount === 0) {
					throw new Error(`Listing ${command.id} not found or already deleted`);
				}
			});
			return;
		}

		// For all non-deletion updates, use standard domain flow
		await uow.withScopedTransactionById(command.id, async (repo) => {
			const listing = await repo.get(command.id);

			if (command.isBlocked !== undefined) {
				listing.setBlocked(command.isBlocked);
			}

			await repo.save(listing);
		});
	};
};
