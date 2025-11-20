export * from './domain/contexts/index.ts';
import type { Contexts } from './domain/index.ts';
export * as Domain from './domain/index.ts';
export * from './domain/infrastructure/cognitive-search/index.ts';
export * from './domain/events/types/index.ts';
export { EventBusInstance } from './domain/events/index.ts';
export type { ItemListingUnitOfWork } from './domain/contexts/listing/item/item-listing.uow.ts';

export interface DomainDataSource {
	User: {
		PersonalUser: {
			PersonalUserUnitOfWork: Contexts.User.PersonalUser.PersonalUserUnitOfWork;
		};
		AdminUser: {
			AdminUserUnitOfWork: Contexts.User.AdminUser.AdminUserUnitOfWork;
		};
	};

	Listing: {
		ItemListing: {
			ItemListingUnitOfWork: Contexts.Listing.ItemListing.ItemListingUnitOfWork;
		};
	};
	Conversation: {
		Conversation: {
			ConversationUnitOfWork: Contexts.Conversation.Conversation.ConversationUnitOfWork;
		};
	};

	ReservationRequest: {
		ReservationRequest: {
			ReservationRequestUnitOfWork: Contexts.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork;
		};
	};

	AppealRequest: {
		ListingAppealRequest: {
			ListingAppealRequestUnitOfWork: Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestUnitOfWork;
		};
		UserAppealRequest: {
			UserAppealRequestUnitOfWork: Contexts.AppealRequest.UserAppealRequest.UserAppealRequestUnitOfWork;
		};
	};
}
