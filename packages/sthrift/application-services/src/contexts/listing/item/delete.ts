import type { DataSources } from '@sthrift/persistence';

export interface ItemListingDeleteCommand {
	id: string;
	userEmail: string;
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

		// Get the current user (PersonalUser or AdminUser)
		const user =
			await dataSources.readonlyDataSource.User.User.UserReadRepo.getByEmail(
				command.userEmail,
			);

		if (!user) {
			throw new Error('User not found');
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

		// Use standard domain flow with visa permissions inside a scoped transaction
		// We manage persistence explicitly to avoid duplicate saves when deleting
		await uow.withScopedTransaction(async (repo) => {
			const listing = await repo.get(command.id);

			// Domain method with visa permission check
			// Visa grants canDeleteItemListing when user.id === listing.sharer.id
			listing.requestDelete();

			// Repository detects isDeleted=true and performs hard delete
			await repo.save(listing);
		});

		return true;
	};
};
