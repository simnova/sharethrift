import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@sthrift/api-domain';
import { ItemListingPersistence } from '../../item-listing/index.ts';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
	const itemListingPersistence = ItemListingPersistence(initializedService);
	
	return {
		domainContexts: {
			itemListing: {
				getItemListingUnitOfWork: (
					inProcEventBusInstance: unknown,
					nodeEventBusInstance: unknown,
				) => {
					// For now, we ignore the event bus instances
					// In a full implementation, these would be passed to the UoW
					console.log('Event bus instances:', { inProcEventBusInstance, nodeEventBusInstance });
					return itemListingPersistence.getItemListingUnitOfWork();
				}
			}
		}
	};
};
