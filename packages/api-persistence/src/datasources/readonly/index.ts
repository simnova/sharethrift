import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

// biome-ignore lint/suspicious/noEmptyInterface: Readonly data source interface will be expanded in the future
export interface ReadonlyDataSource {}

export const ReadonlyDataSourceImplementation = (
	_initializedService: MongooseSeedwork.MongooseContextFactory,
): ReadonlyDataSource => {
	return {};
};
