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
		};
	};

    ReservationRequest: {
        ReservationRequest: {
            ReservationRequestUnitOfWork: Contexts.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork;
        }
    }
}
