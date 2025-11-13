import type { DataSources } from '@sthrift/persistence';

export interface ItemListingDeleteCommand {
	id: string;
	userId: string;
}

export const deleteListings = (dataSources: DataSources) => {
	return async (command: ItemListingDeleteCommand): Promise<boolean> => {
		const uow =
			dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
		if (!uow) {
			throw new Error(
				'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
			);
		}

		// Check for active reservation requests before attempting deletion
		// This business rule validation happens before loading the aggregate
		const activeReservations =
			await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByListingId(
				command.id,
			);

		if (activeReservations && activeReservations.length > 0) {
			throw new Error(
				'Cannot delete listing with active reservation requests. Please cancel or resolve all reservation requests first.',
			);
		}

		// Use standard domain flow with visa permissions
		// The PersonalUserListingItemListingVisa grants canDeleteItemListing to owners
		await uow.withScopedTransactionById(command.id, async (repo) => {
			const listing = await repo.get(command.id);

			// Verify ownership (will be double-checked by visa in setDeleted)
			if (listing.sharer.id !== command.userId) {
				throw new Error('You do not have permission to delete this listing');
			}

			// Domain method with visa permission check
			// Visa grants canDeleteItemListing when user.id === listing.sharer.id
			listing.setDeleted(true);

			// Repository detects isDeleted=true and performs hard delete
			await repo.save(listing);
		});

		return true;
	};
	};

	// Export the implementation as `deleteListings` so the application service and
	// call sites can use a plural, descriptive API name.
	export { deleteListings };
