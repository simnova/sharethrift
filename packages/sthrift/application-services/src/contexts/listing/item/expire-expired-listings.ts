import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ExpireExpiredListingsCommand {
	/** Optional: only expire listings for this specific sharer */
	sharerId?: string;
}

export const expireExpiredListings = (dataSources: DataSources) => {
	return async (
		command: ExpireExpiredListingsCommand = {},
	): Promise<string[]> => {
		const readRepo =
			dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo;

		// Get all published listings
		let allListings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		if (command.sharerId) {
			allListings = await readRepo.getBySharer(command.sharerId);
		} else {
			allListings = await readRepo.getAll();
		}

		// Filter to only published listings that have expired
		const now = new Date();
		const expiredListings = allListings.filter(
			(listing) =>
				listing.state === 'Published' &&
				listing.sharingPeriodEnd &&
				new Date(listing.sharingPeriodEnd) < now,
		);

		const expiredIds: string[] = [];

		// Expire each listing
		for (const listing of expiredListings) {
			try {
				let expiredListing:
					| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
					| null = null;

				await dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction(
					async (repo) => {
						const uow = await repo.getById(listing.id);
						if (uow) {
							uow.expire();
							expiredListing = await repo.save(uow);
						}
					},
				);

				if (expiredListing) {
					expiredIds.push(listing.id);
				}
			} catch (error) {
				console.error(`Error expiring listing ${listing.id}:`, error);
			}
		}

		return expiredIds;
	};
};
