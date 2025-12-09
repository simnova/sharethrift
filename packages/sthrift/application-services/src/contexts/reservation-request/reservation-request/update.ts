import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ReservationRequestUpdateCommand {
	id: string;
	sharerEmail?: string;
	state?: string;
	closeRequestedBySharer?: boolean;
	closeRequestedByReserver?: boolean;
}

const ACCEPTED_STATE = 'Accepted';
const REQUESTED_STATE = 'Requested';
type ReservationRequestRepository =
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps>;

export const update = (dataSources: DataSources) => {
	return async (
		command: ReservationRequestUpdateCommand,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference> => {
		let updatedReservationRequest:
			| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
			| undefined;

		await dataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction(
			async (repo) => {
				const reservationRequest = await repo.getById(command.id);
				if (!reservationRequest) {
					throw new Error('Reservation request not found');
				}

				// Track if we're accepting to handle auto-reject
				const isAccepting = command.state === ACCEPTED_STATE;
				const listingId = isAccepting
					? (await reservationRequest.loadListing()).id
					: null;

				// Update state if provided - domain layer validates state transitions and permissions via visa pattern
				if (command.state !== undefined) {
					reservationRequest.state = command.state;
				}

				if (command.closeRequestedBySharer !== undefined) {
					reservationRequest.closeRequestedBySharer =
						command.closeRequestedBySharer;
				}

				if (command.closeRequestedByReserver !== undefined) {
					reservationRequest.closeRequestedByReserver =
						command.closeRequestedByReserver;
				}

				updatedReservationRequest = await repo.save(reservationRequest);

				// Auto-reject overlapping pending requests when accepting
				if (updatedReservationRequest && isAccepting && listingId) {
					await autoRejectOverlappingRequests(
						updatedReservationRequest,
						listingId,
						repo,
						dataSources,
					);
				}
			},
		);

		if (!updatedReservationRequest) {
			throw new Error('Reservation request update failed');
		}

		return updatedReservationRequest;
	};
};

async function autoRejectOverlappingRequests(
	acceptedRequest: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference,
	listingId: string,
	repo: ReservationRequestRepository,
	dataSources: DataSources,
): Promise<void> {
	try {
		const overlappingRequests =
			await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod(
				{
					listingId,
					reservationPeriodStart: acceptedRequest.reservationPeriodStart,
					reservationPeriodEnd: acceptedRequest.reservationPeriodEnd,
				},
			);

		const requestsToReject = overlappingRequests.filter(
			(
				request: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference,
			) =>
				request.id !== acceptedRequest.id && request.state === REQUESTED_STATE,
		);

		for (const request of requestsToReject) {
			try {
			const requestToReject = await repo.getById(request.id);

			if (requestToReject?.state === REQUESTED_STATE) {
				requestToReject.state = 'Rejected';
				await repo.save(requestToReject);
			}
			} catch {
				// Continue processing other requests if one rejection fails
			}
		}
	} catch {
		// Don't fail the update operation if auto-reject fails
	}
}
