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
type ReservationRequestAggregate =
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
	>;
type ReservationRequestRepository =
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
	>;

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

				const listingIdForAutoReject = await applyStateUpdateIfNeeded(
					reservationRequest,
					command,
					dataSources,
				);

				if (command.closeRequestedBySharer !== undefined) {
					reservationRequest.closeRequestedBySharer =
						command.closeRequestedBySharer;
				}

				if (command.closeRequestedByReserver !== undefined) {
					reservationRequest.closeRequestedByReserver =
						command.closeRequestedByReserver;
				}

				updatedReservationRequest = await repo.save(reservationRequest);

				if (
					updatedReservationRequest &&
					listingIdForAutoReject &&
					command.state === ACCEPTED_STATE
				) {
					await autoRejectOverlappingRequests(
						updatedReservationRequest,
						listingIdForAutoReject,
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

async function applyStateUpdateIfNeeded(
	reservationRequest: ReservationRequestAggregate,
	command: ReservationRequestUpdateCommand,
	dataSources: DataSources,
): Promise<string | null> {
	if (command.state === undefined) {
		return null;
	}

	if (command.state === reservationRequest.state) {
		return null;
	}

	if (command.state === ACCEPTED_STATE) {
		const listing = await ensureSharerOwnsListing(
			reservationRequest,
			command.sharerEmail,
			dataSources,
		);

		reservationRequest.state = ACCEPTED_STATE;
		return listing.id;
	}

	reservationRequest.state = command.state;
	return null;
}

async function ensureSharerOwnsListing(
	reservationRequest: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference,
	sharerEmail: string | undefined,
	dataSources: DataSources,
) {
	if (!sharerEmail) {
		throw new Error(
			'Sharer email is required when accepting a reservation request',
		);
	}

	const listing = await reservationRequest.loadListing();
	if (!listing) {
		throw new Error('Listing not found');
	}

	const sharer =
		await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
			sharerEmail,
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

	return listing;
}

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
			) => request.id !== acceptedRequest.id && request.state === REQUESTED_STATE,
		);

		for (const request of requestsToReject) {
			try {
				const requestToReject = await repo.getById(request.id);

				if (requestToReject && requestToReject.state === REQUESTED_STATE) {
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
