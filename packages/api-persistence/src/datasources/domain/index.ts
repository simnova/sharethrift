import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@sthrift/api-domain';
import { ListingPersistence } from '../../listing/index.ts';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
  console.log(initializedService);
	return {
		domainContexts: {
			listing: ListingPersistence(initializedService),
		},
	};
};
