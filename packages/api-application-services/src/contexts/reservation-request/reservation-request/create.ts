import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ReservationRequestCreateCommand {
    listingId: string;
    reservationPeriodStart: Date;
    reservationPeriodEnd: Date;
    reserverId: string;
}

export const create = (
    dataSources: DataSources,
) => {
    return async (
        command: ReservationRequestCreateCommand,
    ): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference> => {
        
        // Validate input
        if (!command.listingId) {
            throw new Error('Listing ID is required');
        }
        
        if (!command.reserverId) {
            throw new Error('Reserver ID is required');
        }
        
        if (!command.reservationPeriodStart || !command.reservationPeriodEnd) {
            throw new Error('Reservation period start and end dates are required');
        }
        
        if (command.reservationPeriodStart >= command.reservationPeriodEnd) {
            throw new Error('Reservation period start date must be before end date');
        }
        
        if (command.reservationPeriodStart < new Date()) {
            throw new Error('Reservation period start date must be in the future');
        }

        // Get listing to verify it exists
        const listing = await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(command.listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }

        // Get reserver to verify they exist
        const reserver = await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(command.reserverId);
        if (!reserver) {
            throw new Error('Reserver not found');
        }

        // Create the reservation request through unit of work
        let reservationRequestToReturn: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | undefined;
        await dataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction(
            async (repo) => {
                const newReservationRequest = await repo.getNewInstance(
                    'Requested', // Initial state when creating a new reservation request
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