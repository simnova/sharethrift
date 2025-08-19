import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

// biome-ignore lint/suspicious/noEmptyInterface: Empty interface used for future extensibility
export interface ReadonlyDataSource {}

export const ReadonlyDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): ReadonlyDataSource => {
  console.log(initializedService);
	return {};
};
