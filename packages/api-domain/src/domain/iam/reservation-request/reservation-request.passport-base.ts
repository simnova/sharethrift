import type { ReservationRequest } from '../../contexts/reservation-requests/reservation-request.aggregate.js';
import type { ReserverEntityReference } from '../../contexts/reservation-requests/reservation-request.entity-references.js';

/**
 * Base passport class for ReservationRequest aggregate operations.
 * Encapsulates entities required for authentication and authorization
 * from the perspective of reservation request management.
 */
export abstract class ReservationRequestPassportBase {
	protected readonly reservationRequest: ReservationRequest;
	protected readonly currentUser: ReserverEntityReference;

	protected constructor(
		reservationRequest: ReservationRequest,
		currentUser: ReserverEntityReference
	) {
		// Verify that the current user context is valid for this reservation request
		if (!currentUser?.id) {
			throw new Error('Current user is required for reservation request operations');
		}
		
		this.reservationRequest = reservationRequest;
		this.currentUser = currentUser;
	}

	/**
	 * Checks if the current user is the reserver of this reservation request
	 */
	protected get isReserver(): boolean {
		return this.reservationRequest.reserver.id === this.currentUser.id;
	}

	/**
	 * Checks if the current user is the listing owner (has control over the listing)
	 */
	protected get isListingOwner(): boolean {
		return this.reservationRequest.listing.ownerId === this.currentUser.id;
	}

	/**
	 * Gets the current state of the reservation request
	 */
	protected get currentState(): string {
		return this.reservationRequest.state.valueOf();
	}
}