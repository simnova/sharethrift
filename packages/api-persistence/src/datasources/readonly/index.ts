import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

// biome-ignore lint/suspicious/noEmptyInterface: This interface is intentionally empty as a placeholder for future readonly data sources
export interface ReadonlyDataSource {}

export const ReadonlyDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): ReadonlyDataSource => {
  console.log(initializedService);
	return {};
};
