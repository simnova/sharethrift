import { Ability } from '@serenity-js/core';

/**
 * CreateReservationRequestAbility represents an Actor's capacity to create reservation requests in acceptance tests.
 *
 * This ability is used at the DOMAIN level to directly interact with domain models.
 * At other levels (GraphQL/DOM), different abilities are used instead.
 */
export class CreateReservationRequestAbility extends Ability {
	constructor(_uow: unknown, _user: unknown, _passport: unknown) {
		super();
	}

	/**
	 * Creates a reservation request with the provided details.
	 * Validates input according to domain rules.
	 */
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
		// Domain validation
		if (!params.listingId) {
			throw new Error('Validation error: listingId is required');
		}
		if (!params.reservationPeriodStart) {
			throw new Error('Validation error: reservationPeriodStart is required');
		}
		if (!params.reservationPeriodEnd) {
			throw new Error('Validation error: reservationPeriodEnd is required');
		}
		if (!params.reserver) {
			throw new Error('Validation error: reserver is required');
		}
		if (params.reservationPeriodStart >= params.reservationPeriodEnd) {
			throw new Error(
				'Validation error: reservationPeriodStart must be before reservationPeriodEnd',
			);
		}
	}

	/**
	 * Factory method to create this ability with dependencies.
	 */
	static using(uow: unknown, user: unknown, passport: unknown): CreateReservationRequestAbility {
		return new CreateReservationRequestAbility(uow, user, passport);
	}
}
