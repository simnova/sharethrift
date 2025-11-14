import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { PersonalUserModelFactory, UserModelFactory } from './user/index.ts';
import { ReservationRequestModelFactory } from './reservation-request/index.ts';
import {
	ItemListingModelFactory,
	ListingModelFactory,
} from './listing/index.ts';
import { ConversationModelFactory } from './conversations/conversation.model.ts';
import { PersonalUserRoleModelFactory } from './role/personal-user-role.model.ts';
import { AccountPlanModelFactory } from './account-plan/account-plan.model.ts';
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
export * as AccountPlan from './account-plan/index.ts';
export * as AppealRequest from './appeal-request/index.ts';

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
		Conversation: {
			ConversationModel: ConversationModelFactory(initializedService),
		},
		ReservationRequest: {
			ReservationRequest: ReservationRequestModelFactory(initializedService),
		},
		Role: {
			PersonalUserRole: PersonalUserRoleModelFactory(
				UserModelFactory(initializedService),
			),
		},
    AccountPlan: {
			AccountPlanModel: AccountPlanModelFactory(initializedService),
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
