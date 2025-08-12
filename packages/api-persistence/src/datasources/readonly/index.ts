import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface ReadonlyDataSource {}

export const ReadonlyDataSourceImplementation = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): ReadonlyDataSource => {
  console.log(initializedService);
	return {};
};
