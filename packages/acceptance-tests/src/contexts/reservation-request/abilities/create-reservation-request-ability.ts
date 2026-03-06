import { Ability } from '@serenity-js/core';
import { Domain } from '@sthrift/domain';
import { makeReservationRequestProps, makeListingReference, makeSharerUser, makeTestPassport } from '../../../shared/support/domain-test-helpers.js';

type ReservationRequestProps = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps;
const ReservationRequestAggregate = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest;

export class CreateReservationRequestAbility extends Ability {
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
		const passport = makeTestPassport();
		const listing = makeListingReference({ id: params.listingId });
		const reserver = makeSharerUser({
			id: params.reserver?.id,
			email: params.reserver?.email,
			firstName: params.reserver?.firstName,
			lastName: params.reserver?.lastName,
		});
		const props = makeReservationRequestProps();

		ReservationRequestAggregate.getNewInstance<ReservationRequestProps>(
			props,
			'Requested',
			listing,
			reserver,
			params.reservationPeriodStart,
			params.reservationPeriodEnd,
			passport,
		);
	}

	static using(): CreateReservationRequestAbility {
		return new CreateReservationRequestAbility();
	}
}
