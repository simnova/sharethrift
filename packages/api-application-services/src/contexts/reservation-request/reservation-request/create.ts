import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { Types } from 'mongoose';

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
        //let listing = await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(command.listingId);
        // use mock data for now
        const listing = {
            _id: new Types.ObjectId(),
            id: command.listingId,
            title: 'Professional Microphone',
            description: 'A high-quality microphone for professional use.',
            category: 'Electronics',
            location: 'New York, NY',
            sharingPeriodStart: new Date('2024-09-05T10:00:00Z'),
            sharingPeriodEnd: new Date('2024-09-15T10:00:00Z'),
            state: 'Published',
            schemaVersion: '1',
            createdAt: new Date('2024-01-05T09:00:00Z'),
            updatedAt: new Date('2024-01-13T09:00:00Z'),
            sharer: {
                _id: new Types.ObjectId(),
                id: '5f8d0d55b54764421b7156c5',
                userType: 'personal',
                isBlocked: false,
                account: {
                    accountType: 'personal',
                    email: 'sharer2@example.com',
                    username: 'shareruser2',
                    profile: {
                        firstName: 'Jane',
                        lastName: 'Reserver',
                        location: {
                            address1: '123 Main St',
                            city: 'Boston',
                            state: 'MA',
                            country: 'USA',
                            zipCode: '02101',
                        },
                        billing: {
                            subscriptionId: '98765789',
                            cybersourceCustomerId: '87654345678',
                        },
                    },
                },
                schemaVersion: '1',
                createdAt: new Date('2024-01-05T09:00:00Z'),
                updatedAt: new Date('2024-01-13T09:00:00Z'),
            },
		}
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
                    'Requested',
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