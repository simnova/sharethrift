import { app, type InvocationContext, type Timer } from '@azure/functions';
import type { ApiContextSpec } from '@sthrift/context-spec';

/**
 * Creates a timer handler function that expires listings daily.
 * Runs with system passport permissions to update any listing.
 */
export const expireListingsTimerHandlerCreator = (
	context: ApiContextSpec,
) => {
	return async (_myTimer: Timer, invocationContext: InvocationContext): Promise<void> => {
		invocationContext.log('Expire listings timer function triggered at:', new Date().toISOString());

		try {
			// Get data sources with system passport (has all permissions)
			const dataSources = context.dataSourcesFactory.withSystemPassport();
			
			// Get all published listings from the read repository
			const allListings = await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAll();
			
			// Filter to only published listings that have expired
			const now = new Date();
			const expiredListings = allListings.filter(
				(listing) =>
					listing.state === 'Published' &&
					listing.sharingPeriodEnd &&
					new Date(listing.sharingPeriodEnd) < now,
			);

			const expiredIds: string[] = [];

			// Expire each listing using the unit of work
			for (const listing of expiredListings) {
				try {
					await dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction(
						async (repo) => {
							const uow = await repo.getById(listing.id);
							if (uow) {
								uow.expire();
								await repo.save(uow);
								expiredIds.push(listing.id);
							}
						},
					);
				} catch (error) {
					invocationContext.error(`Error expiring listing ${listing.id}:`, error);
				}
			}

			invocationContext.log(`Successfully expired ${expiredIds.length} listings:`, expiredIds);
		} catch (error) {
			invocationContext.error('Error expiring listings:', error);
			throw error;
		}
	};
};

/**
 * Register the timer function with Azure Functions.
 * This is called from index.ts after Cellix is initialized.
 */
export const registerExpireListingsTimer = (
	context: ApiContextSpec,
) => {
	app.timer('expire-listings-timer', {
		schedule: '0 0 2 * * *', // Daily at 2 AM UTC
		handler: expireListingsTimerHandlerCreator(context),
	});
};
