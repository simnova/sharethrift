import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../models-context.ts';
import type * as PersonalUser from './user/personal-user/index.ts';

import type * as ReservationRequest from './reservation-request/reservation-request/index.ts';
import { UserContext } from './user/index.ts';
import { ConversationContext } from './conversation/index.ts';
import { ListingContext } from './listing/index.ts';

import type * as ItemListing from './listing/item/index.ts';
import type * as Conversation from './conversation/conversation/index.ts';
import { ReservationRequestContext } from './reservation-request/index.ts';

import { AccountPlanContext } from './account-plan/index.ts';
import type * as AccountPlan from './account-plan/account-plan/index.ts';

export interface ReadonlyDataSource {
	User: {
		PersonalUser: {
			PersonalUserReadRepo: PersonalUser.PersonalUserReadRepository;
		};
	};
	ReservationRequest: {
		ReservationRequest: {
			ReservationRequestReadRepo: ReservationRequest.ReservationRequestReadRepository;
		};
	};
	Listing: {
		ItemListing: {
			ItemListingReadRepo: ItemListing.ItemListingReadRepository;
		};
	};
	Conversation: {
		Conversation: {
			ConversationReadRepo: Conversation.ConversationReadRepository;
		};
	};
	AccountPlan: {
		AccountPlan: {
			AccountPlanReadRepo: AccountPlan.AccountPlanReadRepository;
		};
	};
}

export const ReadonlyDataSourceImplementation = (
	models: ModelsContext,
	passport: Domain.Passport,
): ReadonlyDataSource => ({
	User: UserContext(models, passport),
	ReservationRequest: ReservationRequestContext(models, passport),
	Listing: ListingContext(models, passport),
	Conversation: ConversationContext(models, passport),
	AccountPlan: AccountPlanContext(models, passport),
});
