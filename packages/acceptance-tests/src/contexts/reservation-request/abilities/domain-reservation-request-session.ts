import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateReservationRequestInput, ReservationRequest } from './reservation-request-session.js';

/**
 * DomainReservationRequestSession - Domain-specific implementation of reservation request operations over DomainSession.
 *
 * Extends generic DomainSession with reservation request-specific handlers.
 * Registers operation handlers in constructor and provides convenience methods.
 */
export class DomainReservationRequestSession extends DomainSession {
	private reservationRequests: Map<string, ReservationRequest>;
	private nextId = 1;
	context = 'reservation';

	constructor(sharedStore?: Map<string, ReservationRequest>) {
		super();
		// Use provided shared store or create a new Map for this session
		this.reservationRequests = sharedStore || new Map<string, ReservationRequest>();
		// Register reservation request operations with the parent Session
		this.registerOperation('reservation:create', (input) =>
			this.handleCreateReservationRequest(input as unknown as CreateReservationRequestInput),
		);
		this.registerOperation('reservation:getById', (input) =>
			this.handleGetReservationRequestById(input as unknown as { id: string }),
		);
		this.registerOperation('reservation:getCountForListing', (input) =>
			this.handleGetCountForListing(input as unknown as { listingId: string }),
		);
	}

	/**
	 * Convenience method: Create a reservation request
	 * (delegates to registered operation for backward compatibility)
	 */
	createReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		return this.execute<CreateReservationRequestInput, ReservationRequest>('reservation:create', input);
	}

	/**
	 * Convenience method: Get reservation request by ID
	 * (delegates to registered operation for backward compatibility)
	 */
	getReservationRequestById(id: string): Promise<ReservationRequest | null> {
		return this.execute<{ id: string }, ReservationRequest | null>('reservation:getById', { id });
	}

	/**
	 * Get count of reservation requests for a specific listing
	 */
	getReservationRequestCountForListing(listingId: string): Promise<number> {
		const count = Array.from(this.reservationRequests.values()).filter(
			(req) => req.listingId === listingId,
		).length;
		return Promise.resolve(count);
	}

	/**
	 * Handle creating a reservation request
	 */
	private handleCreateReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		// Validate input (domain validation rules)
		this.validateCreateInput(input);

		// Check for overlapping reservations
		const hasOverlap = Array.from(this.reservationRequests.values()).some(
			(req) =>
				req.listingId === input.listingId &&
				['Requested', 'Accepted'].includes(req.state) &&
				this.hasOverlapingPeriod(input.reservationPeriodStart, input.reservationPeriodEnd, req),
		);

		if (hasOverlap) {
			throw new Error('Validation error: Reservation period overlaps with existing active reservation requests');
		}

		// Generate ID and create reservation request
		const id = `reservation-request-${this.nextId++}`;
		const reservationRequest: ReservationRequest = {
			id,
			listingId: input.listingId,
			reserver: input.reserver,
			reservationPeriodStart: input.reservationPeriodStart,
			reservationPeriodEnd: input.reservationPeriodEnd,
			state: 'Requested',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Store in memory (simulating persistence)
		this.reservationRequests.set(id, reservationRequest);

		return reservationRequest;
	}

	/**
	 * Handle getting a reservation request by ID
	 */
	private handleGetReservationRequestById(input: { id: string }): Promise<ReservationRequest | null> {
		return this.reservationRequests.get(input.id) || null;
	}

	/**
	 * Handle getting count of reservation requests for a listing
	 */
	private handleGetCountForListing(input: { listingId: string }): Promise<number> {
		const count = Array.from(this.reservationRequests.values()).filter(
			(req) => req.listingId === input.listingId,
		).length;
		return Promise.resolve(count);
	}

	/**
	 * Check if two date ranges overlap
	 */
	private hasOverlapingPeriod(
		start1: Date,
		end1: Date,
		req: ReservationRequest,
	): boolean {
		return start1 < req.reservationPeriodEnd && end1 > req.reservationPeriodStart;
	}

	/**
	 * Domain validation rules
	 */
	private validateCreateInput(input: CreateReservationRequestInput): void {
		if (!input.listingId) {
			throw new Error('Validation error: listingId is required');
		}
		if (!input.reservationPeriodStart) {
			throw new Error('Validation error: reservationPeriodStart is required');
		}
		if (!input.reservationPeriodEnd) {
			throw new Error('Validation error: reservationPeriodEnd is required');
		}
		if (!input.reserver) {
			throw new Error('Validation error: reserver is required');
		}
		if (input.reservationPeriodStart >= input.reservationPeriodEnd) {
			throw new Error('Validation error: reservationPeriodStart must be before reservationPeriodEnd');
		}
	}
}
