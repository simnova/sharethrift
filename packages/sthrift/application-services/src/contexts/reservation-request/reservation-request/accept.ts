import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestAcceptCommand {
	reservationRequestId: string;
	sharerEmail: string;
}

export const accept = (dataSources: DataSources) => {
	return async (
		command: ReservationRequestAcceptCommand,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference> => {
		// Load the reservation request
		const reservationRequest =
			await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getById(
				command.reservationRequestId,
			);

		if (!reservationRequest) {
			throw new Error('Reservation request not found');
		}

		// Load the sharer to verify authorization
		const sharer =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
				command.sharerEmail,
			);
		if (!sharer) {
			throw new Error('Sharer not found. Ensure that you are logged in.');
		}

		// Load the listing to verify the sharer owns it
		const listing =
			await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
				reservationRequest.listing.id,
			);
		if (!listing) {
			throw new Error('Listing not found');
		}

		// Verify the sharer owns the listing
		if (listing.sharer.id !== sharer.id) {
			throw new Error(
				'You do not have permission to accept this reservation request',
			);
		}

		// Check for overlapping accepted reservations
		const overlappingRequests =
			await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing(
				listing.id,
				reservationRequest.reservationPeriodStart,
				reservationRequest.reservationPeriodEnd,
			);

		// Filter out the current request from overlaps
		const otherOverlappingRequests = overlappingRequests.filter(
			(req) => req.id !== command.reservationRequestId,
		);

		if (otherOverlappingRequests.length > 0) {
			throw new Error(
				'Cannot accept: overlapping reservation requests already exist for this timeframe',
			);
		}

		// Accept the reservation request
		let acceptedReservation:
			| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
			| undefined;
		await dataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				const loadedReservation = await repo.getById(
					command.reservationRequestId,
				);
				if (!loadedReservation) {
					throw new Error('Reservation request not found');
				}

				// Update state to accepted (which triggers the accept() method)
				loadedReservation.state = 'Accepted';

				acceptedReservation = await repo.save(loadedReservation);
			},
		);

		if (!acceptedReservation) {
			throw new Error('Failed to accept reservation request');
		}

		return acceptedReservation;
	};
};
