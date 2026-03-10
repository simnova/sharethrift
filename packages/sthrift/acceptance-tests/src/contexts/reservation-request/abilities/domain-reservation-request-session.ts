import { Domain } from '@sthrift/domain';
import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateReservationRequestInput } from './reservation-request-session.js';
import { generateObjectId } from '../../../shared/support/test-data/utils.js';

type ReservationRequestEntityReference = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;

const ONE_DAY_MS = 86400000;
const DEFAULT_SHARING_PERIOD_DAYS = 7;

export class DomainReservationRequestSession extends DomainSession {
	private readonly reservationRequests: Map<string, ReservationRequestEntityReference>;
	context = 'reservation-request';

	constructor(sharedStore?: Map<string, ReservationRequestEntityReference>) {
		super();
		this.reservationRequests = sharedStore || new Map<string, ReservationRequestEntityReference>();
		this.registerOperation('reservation:create', (input) =>
			this.handleCreateReservationRequest(input as CreateReservationRequestInput),
		);
		this.registerOperation('reservation:getById', (input) =>
			this.handleGetReservationRequestById(input as { id: string }),
		);
		this.registerOperation('reservation:getCountForListing', (input) =>
			this.handleGetCountForListing(input as { listingId: string }),
		);
	}

	createReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequestEntityReference> {
		return this.execute<CreateReservationRequestInput, ReservationRequestEntityReference>('reservation:create', input);
	}

	getReservationRequestById(id: string): Promise<ReservationRequestEntityReference | null> {
		return this.execute<{ id: string }, ReservationRequestEntityReference | null>('reservation:getById', { id });
	}

	private handleCreateReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequestEntityReference> {
		const startDate = input.reservationPeriodStart ?? new Date(Date.now() + ONE_DAY_MS);
		const endDate = input.reservationPeriodEnd ?? new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);

		// Check for overlapping reservations
		const existingReservations = Array.from(this.reservationRequests.values()).filter(
			(r) => r.listing.id === input.listingId && ['Requested', 'Accepted'].includes(r.state),
		);
		const hasOverlap = existingReservations.some((existing) => {
			return startDate < existing.reservationPeriodEnd && endDate > existing.reservationPeriodStart;
		});

		if (hasOverlap) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		// Create a placeholder reservation request entity
		const id = generateObjectId();
		const placeholder = {
			id,
			state: 'Requested',
			reservationPeriodStart: startDate,
			reservationPeriodEnd: endDate,
			listing: { id: input.listingId } as unknown,
			reserver: { id: input.reserver.id } as unknown,
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
			closeRequestedBySharer: false,
			closeRequestedByReserver: false,
			loadListing: async () => ({ id: input.listingId } as unknown),
			loadReserver: async () => ({ id: input.reserver.id } as unknown),
			loadSharer: async () => null as never,
		} as unknown as ReservationRequestEntityReference;

		this.reservationRequests.set(id, placeholder);
		return Promise.resolve(placeholder);
	}

	private handleGetReservationRequestById(input: { id: string }): Promise<ReservationRequestEntityReference | null> {
		return Promise.resolve(this.reservationRequests.get(input.id) || null);
	}

	private handleGetCountForListing(input: { listingId: string }): Promise<number> {
		const count = Array.from(this.reservationRequests.values()).filter(
			(r) => r.listing.id === input.listingId,
		).length;
		return Promise.resolve(count);
	}
}
