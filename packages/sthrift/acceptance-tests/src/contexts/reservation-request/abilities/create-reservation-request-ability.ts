import { Ability } from '@serenity-js/core';
import { Domain } from '@sthrift/domain';
import { makeReservationRequestProps, makeListingReference, makeSharerUser, ONE_DAY_MS, DEFAULT_SHARING_PERIOD_DAYS } from '../../../shared/support/domain-test-helpers.js';
import { reservationRequests } from '../../../shared/support/test-data/reservation-request.test-data.js';

type Passport = Domain.Passport;
type ReservationRequestProps = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps;
type ReservationRequestAggregate = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<ReservationRequestProps>;
type ReservationRequestEntityReference = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
const ReservationRequestAggregateClass = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest;
const { PassportFactory } = Domain;

export class CreateReservationRequestAbility extends Ability {
	private createdAggregate?: ReservationRequestAggregate;

	constructor(
		private readonly passport: Passport,
	) {
		super();
	}

	createReservationRequest(params: {
		listingId?: string;
		reservationPeriodStart?: Date;
		reservationPeriodEnd?: Date;
		reserver?: {
			id: string;
			email: string;
			firstName: string;
			lastName: string;
		};
	}): void {
		const listingId = params.listingId ?? 'test-listing-1';
		const listing = makeListingReference({ id: listingId });
		const reserver = makeSharerUser({
			id: params.reserver?.id ?? 'test-reserver-1',
			email: params.reserver?.email ?? 'test-reserver@test.com',
			firstName: params.reserver?.firstName ?? 'TestReserver',
			lastName: params.reserver?.lastName ?? 'Tester',
		});
		const props = makeReservationRequestProps();
		const startDate = params.reservationPeriodStart ?? new Date(Date.now() + ONE_DAY_MS);
		const endDate = params.reservationPeriodEnd ?? new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);

		// Check for overlapping reservations in shared test-data
		const existingRequests = Array.from(reservationRequests.values()).filter(
			(r) => r.listing.id === listingId && ['Requested', 'Accepted'].includes(r.state),
		);
		const hasOverlap = existingRequests.some(
			(existing) => startDate < existing.reservationPeriodEnd && endDate > existing.reservationPeriodStart,
		);

		if (hasOverlap) {
			throw new Error('Reservation period overlaps with existing active reservation requests');
		}

		const aggregate = ReservationRequestAggregateClass.getNewInstance<ReservationRequestProps>(
			props,
			'Requested',
			listing,
			reserver,
			startDate,
			endDate,
			this.passport,
		);

		this.createdAggregate = aggregate;

		reservationRequests.set(aggregate.id, {
			id: aggregate.id,
			state: 'Requested',
			reservationPeriodStart: startDate,
			reservationPeriodEnd: endDate,
			listing,
			reserver,
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
			closeRequestedBySharer: false,
			closeRequestedByReserver: false,
			loadListing: async () => listing,
			loadReserver: async () => reserver,
			loadSharer: async () => null as never,
		} as ReservationRequestEntityReference);
	}

	getCreatedAggregate(): ReservationRequestAggregate | undefined {
		return this.createdAggregate;
	}

	static getCountForListing(listingId: string): number {
		return Array.from(reservationRequests.values()).filter((r) => r.listing.id === listingId).length;
	}

	static using(): CreateReservationRequestAbility {
		return new CreateReservationRequestAbility(PassportFactory.forSystem());
	}
}
