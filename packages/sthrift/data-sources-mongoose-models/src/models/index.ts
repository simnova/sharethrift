import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	PersonalUserModelFactory,
	AdminUserModelFactory,
	UserModelFactory,
} from './user/index.ts';
import { ReservationRequestModelFactory } from './reservation-request/index.ts';
import {
	ItemListingModelFactory,
	ListingModelFactory,
} from './listing/index.ts';
import { ConversationModelFactory } from './conversations/conversation.model.ts';
import { AdminRoleModelFactory, RoleModelFactory } from './role/index.ts';
import {
	AppealRequestModelFactory,
	ListingAppealRequestModelFactory,
	UserAppealRequestModelFactory,
} from './appeal-request/index.ts';

export * as User from './user/index.ts';
export * as Conversation from './conversations/index.ts';
export * as Listing from './listing/index.ts';
export * as ReservationRequest from './reservation-request/index.ts';
export * as Role from './role/index.ts';
export * as AppealRequest from './appeal-request/index.ts';

// Explicit export for consumers
export { ItemListingModelFactory } from './listing/index.ts';

export const mongooseContextBuilder = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	// Create base models first (needed for discriminators and populate refs)
	const UserModel = UserModelFactory(initializedService);
	const RoleModel = RoleModelFactory(initializedService);

	return {
		User: {
			PersonalUser: PersonalUserModelFactory(UserModel),
			AdminUser: AdminUserModelFactory(UserModel),
		},

		Listing: {
			ItemListingModel: ItemListingModelFactory(
				ListingModelFactory(initializedService),
			),
		},
		Conversation: {
			ConversationModel: ConversationModelFactory(initializedService),
		},
		ReservationRequest: {
			ReservationRequest: ReservationRequestModelFactory(initializedService),
		},
		Role: {
			Role: RoleModel,
			AdminRole: AdminRoleModelFactory(RoleModel),
		},
		AppealRequest: {
			ListingAppealRequest: ListingAppealRequestModelFactory(
				AppealRequestModelFactory(initializedService),
			),
			UserAppealRequest: UserAppealRequestModelFactory(
				AppealRequestModelFactory(initializedService),
			),
		},
	};
};
