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

				// Auto-reject overlapping pending requests
				if (acceptedReservationRequest) {
					await autoRejectOverlappingRequests(
						acceptedReservationRequest,
						listing.id,
						repo,
						dataSources,
					);
				}
			},
		);

		if (!acceptedReservationRequest) {
			throw new Error('Reservation request not accepted');
		}

		return acceptedReservationRequest;
	};
};

/**
 * Automatically reject overlapping pending reservation requests for the same listing
 * @param acceptedRequest - The reservation request that was just accepted
 * @param listingId - The ID of the listing
 * @param repo - The reservation request repository
 * @param dataSources - Data sources for querying overlapping requests
 */
async function autoRejectOverlappingRequests(
	acceptedRequest: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference,
	listingId: string,
	repo: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps>,
	dataSources: DataSources,
): Promise<void> {
	try {
		// Query all overlapping pending requests for the same listing
		const overlappingRequests =
			await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod(
				{
					listingId,
					reservationPeriodStart: acceptedRequest.reservationPeriodStart,
					reservationPeriodEnd: acceptedRequest.reservationPeriodEnd,
				},
			);

		// Filter out the accepted request and only process requests in "Requested" state
		const requestsToReject = overlappingRequests.filter(
			(
				request: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference,
			) => request.id !== acceptedRequest.id && request.state === 'Requested',
		);

		// Reject each overlapping request
		for (const request of requestsToReject) {
			try {
				// Load the full aggregate from the write repository
				const requestToReject = await repo.getById(request.id);

				if (requestToReject && requestToReject.state === 'Requested') {
					// Set state to "Rejected" - the domain will validate permissions
					requestToReject.state = 'Rejected';
					await repo.save(requestToReject);

					// TODO: Trigger notification to reserver about automatic rejection
					// This should be handled by domain events or a separate notification service
					console.log(
						`Auto-rejected overlapping request ${request.id} due to acceptance of request ${acceptedRequest.id}`,
					);
				}
			} catch (error) {
				// Log error but don't fail the entire operation if one rejection fails
				console.error(
					`Failed to auto-reject overlapping request ${request.id}:`,
					error,
				);
			}
		}

		if (requestsToReject.length > 0) {
			console.log(
				`Auto-rejected ${requestsToReject.length} overlapping request(s) for listing ${listingId}`,
			);
		}
	} catch (error) {
		// Log error but don't fail the acceptance operation
		console.error(
			`Error while auto-rejecting overlapping requests for listing ${listingId}:`,
			error,
		);
	}
}
