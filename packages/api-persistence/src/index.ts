import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@sthrift/api-data-sources-mongoose-models';
import { DataSourcesFactoryImpl } from './datasources/index.ts';

export type ModelsContext = ReturnType<typeof Models.mongooseContextBuilder>;
export type { DataSources, DataSourcesFactory } from './datasources/index.ts';

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