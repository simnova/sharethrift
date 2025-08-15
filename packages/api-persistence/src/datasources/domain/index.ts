import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@sthrift/api-domain';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
	console.log(initializedService);
	return {};
};
