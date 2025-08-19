import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ReservationRequest, ReservationRequestProps } from './reservation-request.aggregate.js';
import type { ReservationRequestState, ReserverId, ReservationListingId } from './reservation-request.value-objects.js';

/**
 * Repository interface for ReservationRequest aggregate root.
 * Provides domain-specific methods for retrieving and managing reservation requests.
 */
export interface ReservationRequestRepository<TProps extends ReservationRequestProps = ReservationRequestProps>
	extends DomainSeedwork.Repository<ReservationRequest> {
	
	/**
	 * Creates a new instance of the aggregate with a new ID.
	 */
	getNewInstance(
		props: Omit<TProps, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'>
	): Promise<ReservationRequest>;

	/**
	 * Retrieves a reservation request by its unique identifier.
	 */
	getById(id: string): Promise<ReservationRequest | null>;

	/**
	 * Retrieves all reservation requests.
	 */
	getAll(): Promise<ReservationRequest[]>;

	/**
	 * Retrieves reservation requests by reserver ID.
	 */
	getByReserverId(reserverId: ReserverId): Promise<ReservationRequest[]>;

	/**
	 * Retrieves reservation requests by listing ID.
	 */
	getByListingId(listingId: ReservationListingId): Promise<ReservationRequest[]>;

	/**
	 * Retrieves reservation requests by state.
	 */
	getByState(state: ReservationRequestState): Promise<ReservationRequest[]>;

	/**
	 * Retrieves active reservation requests (not closed or cancelled).
	 */
	getActiveReservations(reserverId?: ReserverId): Promise<ReservationRequest[]>;

	/**
	 * Retrieves reservation history (closed reservations).
	 */
	getReservationHistory(reserverId?: ReserverId): Promise<ReservationRequest[]>;

	/**
	 * Retrieves reservation requests by reserver and state.
	 */
	getByReserverAndState(reserverId: ReserverId, state: ReservationRequestState): Promise<ReservationRequest[]>;
}