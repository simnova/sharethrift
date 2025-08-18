import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { PersonalUserModelFactory, UserModelFactory } from './user/index.ts';

export * as User from './user/index.ts';

export const mongooseContextBuilder = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		User: {
			PersonalUser: PersonalUserModelFactory(
				UserModelFactory(initializedService),
			),
		},
	};
};
