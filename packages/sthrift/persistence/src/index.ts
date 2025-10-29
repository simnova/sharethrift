import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Models } from '@sthrift/data-sources-mongoose-models';
import { DataSourcesFactoryImpl } from './datasources/index.ts';
import type { ModelsContext } from './models-context.ts';

export type { DataSources, DataSourcesFactory } from './datasources/index.ts';
export type { AdminListingDto, AdminPagedResult } from './dtos/listing.ts';

export const Persistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

	const models: ModelsContext = {
		...Models.mongooseContextBuilder(initializedService),
	};

	return DataSourcesFactoryImpl(models);
};
