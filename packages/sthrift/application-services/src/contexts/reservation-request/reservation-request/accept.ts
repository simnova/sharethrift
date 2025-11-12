import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestAcceptCommand {
	id: string;
	sharerEmail: string;
}

export const accept = (dataSources: DataSources) => {
	return async (
		command: ReservationRequestAcceptCommand,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference> => {
		// Accept the reservation request
		let acceptedReservationRequest:
			| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
			| undefined;

		await dataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				const reservationRequestToAccept = await repo.getById(command.id);
				if (!reservationRequestToAccept) {
					throw new Error('Reservation request not found');
				}

				// Load the listing to verify sharer ownership
				const listing = await reservationRequestToAccept.loadListing();
				if (!listing) {
					throw new Error('Listing not found');
				}

				// Verify the sharer owns the listing
				const sharer =
					await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
						command.sharerEmail,
					);

				if (!sharer) {
					throw new Error(
						'Sharer not found. Ensure that you are logged in as the listing owner.',
					);
				}

				if (listing.sharer?.id !== sharer.id) {
					throw new Error(
						'You do not have permission to accept this reservation request',
					);
				}

				// Accept the reservation (this will call the accept() method in the domain)
				reservationRequestToAccept.state = 'Accepted';

				acceptedReservationRequest = await repo.save(
					reservationRequestToAccept,
				);
			},
		);

		if (!acceptedReservationRequest) {
			throw new Error('Reservation request not accepted');
		}

		// TODO: Auto-reject overlapping pending requests
		// This should be implemented in a separate service or as part of the domain event handling

		return acceptedReservationRequest;
	};
};
