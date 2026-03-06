import { Ability } from '@serenity-js/core';
import { Domain } from '@sthrift/domain';
import { makeReservationRequestProps, makeListingReference, makeSharerUser, ONE_DAY_MS, DEFAULT_SHARING_PERIOD_DAYS } from '../../../shared/support/domain-test-helpers.js';

type Passport = Domain.Passport;
type ReservationRequestProps = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps;
type ReservationRequestAggregate = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<ReservationRequestProps>;
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
		const listing = makeListingReference({ id: params.listingId ?? 'test-listing-1' });
		const reserver = makeSharerUser({
			id: params.reserver?.id ?? 'test-reserver-1',
			email: params.reserver?.email ?? 'test-reserver@test.com',
			firstName: params.reserver?.firstName ?? 'TestReserver',
			lastName: params.reserver?.lastName ?? 'Tester',
		});
		const props = makeReservationRequestProps();
		const startDate = params.reservationPeriodStart ?? new Date(Date.now() + ONE_DAY_MS);
		const endDate = params.reservationPeriodEnd ?? new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS);

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
	}

	getCreatedAggregate(): ReservationRequestAggregate | undefined {
		return this.createdAggregate;
	}

	static using(): CreateReservationRequestAbility {
		return new CreateReservationRequestAbility(PassportFactory.forSystem());
	}
}
