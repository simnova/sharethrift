import { Domain } from '@sthrift/domain';
import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateReservationRequestInput, ReservationRequest } from './reservation-request-session.js';
import { makeReservationRequestProps, makeListingReference, makeSharerUser, makeTestPassport } from '../../../shared/support/domain-test-helpers.js';

type ReservationRequestProps = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps;
const ReservationRequestAggregate = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest;

export class DomainReservationRequestSession extends DomainSession {
	private readonly reservationRequests: Map<string, ReservationRequest>;
	context = 'reservation';

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

	getReservationRequestCountForListing(listingId: string): Promise<number> {
		const count = Array.from(this.reservationRequests.values()).filter(
			(req) => req.listingId === listingId,
		).length;
		return Promise.resolve(count);
	}

	private handleCreateReservationRequest(input: CreateReservationRequestInput): Promise<ReservationRequest> {
		// Check for overlapping reservations
		const hasOverlap = Array.from(this.reservationRequests.values()).some(
			(req) =>
				req.listingId === input.listingId &&
				['Requested', 'Accepted'].includes(req.state) &&
				input.reservationPeriodStart < req.reservationPeriodEnd &&
				input.reservationPeriodEnd > req.reservationPeriodStart,
		);

		if (hasOverlap) {
			throw new Error('Validation error: Reservation period overlaps with existing active reservation requests');
		}

		const passport = makeTestPassport();
		const listing = makeListingReference({ id: input.listingId });
		const reserver = makeSharerUser({
			id: input.reserver.id,
			email: input.reserver.email,
			firstName: input.reserver.firstName,
			lastName: input.reserver.lastName,
		});
		const props = makeReservationRequestProps({
			id: `rr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		});

		const aggregate = ReservationRequestAggregate.getNewInstance<ReservationRequestProps>(
			props,
			'Requested',
			listing,
			reserver,
			input.reservationPeriodStart,
			input.reservationPeriodEnd,
			passport,
		);

		const reservationRequest: ReservationRequest = {
			id: aggregate.id,
			listingId: input.listingId,
			reserver: input.reserver,
			reservationPeriodStart: aggregate.reservationPeriodStart,
			reservationPeriodEnd: aggregate.reservationPeriodEnd,
			state: aggregate.state as ReservationRequest['state'],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.reservationRequests.set(reservationRequest.id, reservationRequest);
		return Promise.resolve(reservationRequest);
	}

	private handleGetReservationRequestById(input: { id: string }): Promise<ReservationRequest | null> {
		return Promise.resolve(this.reservationRequests.get(input.id) || null);
	}

	private handleGetCountForListing(input: { listingId: string }): Promise<number> {
		const count = Array.from(this.reservationRequests.values()).filter(
			(req) => req.listingId === input.listingId,
		).length;
		return Promise.resolve(count);
	}
}
