import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@ocom/api-domain';
import { mongooseContextBuilder } from '@ocom/api-data-sources-mongoose-models';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
	const _mongooseContext = mongooseContextBuilder(initializedService);
	
	return {
		// User data source will be implemented when we have passport implementation
	};
};
