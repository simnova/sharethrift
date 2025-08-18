import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@sthrift/api-domain';
import { ListingPersistence } from '../../listing/index.ts';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
	return {
		domainContexts: {
			listing: {
				item: ListingPersistence(initializedService),
			},
		},
	};
};
