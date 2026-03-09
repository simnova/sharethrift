import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateReservationRequestInput, ReservationRequest } from './reservation-request-session.js';
import { generateObjectId } from '../../../shared/support/test-data/utils.js';

const ONE_DAY_MS = 86400000;
const DEFAULT_SHARING_PERIOD_DAYS = 7;

export class DomainReservationRequestSession extends DomainSession {
	private readonly reservationRequests: Map<string, ReservationRequest>;
	context = 'reservation-request';

	constructor(sharedStore?: Map<string, ReservationRequest>) {
		super();
		this.reservationRequests = sharedStore || new Map<string, ReservationRequest>();
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

	createReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		return this.execute<CreateReservationRequestInput, ReservationRequest>('reservation:create', input);
	}

	getReservationRequestById(id: string): Promise<ReservationRequest | null> {
		return this.execute<{ id: string }, ReservationRequest | null>('reservation:getById', { id });
	}

	private handleCreateReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		const now = new Date();
		const startDate = input.reservationPeriodStart ?? new Date(Date.now() + ONE_DAY_MS);
		const endDate = input.reservationPeriodEnd ?? new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);

		// Check for overlapping reservations
		const existingReservations = Array.from(this.reservationRequests.values()).filter(
			(r) => r.listingId === input.listingId,
		);
		const hasOverlap = existingReservations.some((existing) => {
			return startDate < existing.reservationPeriodEnd && endDate > existing.reservationPeriodStart;
		});

		if (hasOverlap) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		const reservationRequest: ReservationRequest = {
			id: generateObjectId(),
			listingId: input.listingId,
			reserver: {
				id: input.reserver.id,
				email: input.reserver.email,
				firstName: input.reserver.firstName,
				lastName: input.reserver.lastName,
			},
			reservationPeriodStart: startDate,
			reservationPeriodEnd: endDate,
			state: 'Requested',
			createdAt: now,
			updatedAt: now,
		};

		this.reservationRequests.set(reservationRequest.id, reservationRequest);
		return Promise.resolve(reservationRequest);
	}

	private handleGetReservationRequestById(input: { id: string }): Promise<ReservationRequest | null> {
		return Promise.resolve(this.reservationRequests.get(input.id) || null);
	}

	private handleGetCountForListing(input: { listingId: string }): Promise<number> {
		const count = Array.from(this.reservationRequests.values()).filter(
			(r) => r.listingId === input.listingId,
		).length;
		return Promise.resolve(count);
	}
}
