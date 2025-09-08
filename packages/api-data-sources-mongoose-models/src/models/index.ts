
import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { PersonalUserModelFactory, UserModelFactory } from './user/index.ts';
import { ReservationRequestModelFactory } from './reservation-request/index.ts';
import {
	ItemListingModelFactory,
	ListingModelFactory,
} from './listing/index.ts';

export * as User from './user/index.ts';
export * as Conversation from './conversations/index.ts';
export * as Listing from './listing/index.ts';
export * as ReservationRequest from './reservation-request/index.ts';

// Explicit export for consumers
export { ItemListingModelFactory };

export const mongooseContextBuilder = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		User: {
			PersonalUser: PersonalUserModelFactory(
				UserModelFactory(initializedService),
			),
		},

		Listing: {
			ItemListingModel: ItemListingModelFactory(
				ListingModelFactory(initializedService),
			),
		},
		ReservationRequest: {
			ReservationRequest: ReservationRequestModelFactory(initializedService),
		},
	};
};
