import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

// biome-ignore lint/suspicious/noEmptyInterface: Readonly data source interface will be implemented later
export interface ReadonlyDataSource {}

export const ReadonlyDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): ReadonlyDataSource => {
  console.log(initializedService);
	return {};
};
