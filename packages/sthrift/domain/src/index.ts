export * from './domain/contexts/index.ts';
import type { Contexts } from './domain/index.ts';
export * as Domain from './domain/index.ts';

export interface DomainDataSource {
	User: {
		PersonalUser: {
			PersonalUserUnitOfWork: Contexts.User.PersonalUser.PersonalUserUnitOfWork;
		};
	};

	Listing: {
		ItemListing: {
			ItemListingUnitOfWork: Contexts.Listing.ItemListing.ItemListingUnitOfWork;
			// Persistence helpers for common mutations. Implementations may wrap these
			// with a UnitOfWork internally; exposing them here keeps application-services
			// thin and prevents transaction plumbing from leaking into that layer.
			create?: (
				command: {
					sharer: Contexts.User.PersonalUser.PersonalUserEntityReference;
					title: string;
					description: string;
					category: string;
					location: string;
					sharingPeriodStart: Date;
					sharingPeriodEnd: Date;
					images?: string[];
					isDraft?: boolean;
				},
			) => Promise<Contexts.Listing.ItemListing.ItemListingEntityReference>;
			remove?: (id: string) => Promise<boolean>;
			unblock?: (id: string) => Promise<boolean>;
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
        }
    }
}
