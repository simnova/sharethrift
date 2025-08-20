import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@sthrift/api-domain';
import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { mongooseContextBuilder } from '@sthrift/api-data-sources-mongoose-models';
import { UserContextPersistence } from './user/index.ts';

export const DomainDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DomainDataSource => {
	if (!initializedService) {
		throw new Error('MongooseContextFactory service is not available');
	}

	const mongooseModels = mongooseContextBuilder(initializedService);

	return {
		User: UserContextPersistence(
			mongooseModels,
			InProcEventBusInstance,
			NodeEventBusInstance,
		),
	};
};
