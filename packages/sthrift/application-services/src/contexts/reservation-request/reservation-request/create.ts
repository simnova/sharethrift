import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestCreateCommand {
    listingId: string;
    reservationPeriodStart: Date;
    reservationPeriodEnd: Date;
    reserverEmail: string;
}

export const create = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestCreateCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference> => {
        const listing = await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(command.listingId);
    
        if (!listing) {
            throw new Error('Listing not found');
        }

        const reserver = await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(command.reserverEmail);
        if (!reserver) {
            throw new Error('Reserver not found. Ensure that you are logged in.');
        }

        const overlappingRequests = await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing(
            command.listingId,
            command.reservationPeriodStart,
            command.reservationPeriodEnd
        );
        if (overlappingRequests.length > 0) {
            throw new Error('Reservation period overlaps with existing active reservation requests');
        }

        let reservationRequestToReturn: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | undefined;
        await dataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction(
            async (repo) => {
                const newReservationRequest = await repo.getNewInstance(
                    'Pending',
                    listing,
                    reserver,
                    command.reservationPeriodStart,
                    command.reservationPeriodEnd
                );
                reservationRequestToReturn = await repo.save(newReservationRequest);
            },
        );

        if (!reservationRequestToReturn) {
            throw new Error('ReservationRequest not created');
        }
        
        return reservationRequestToReturn;
    }
}