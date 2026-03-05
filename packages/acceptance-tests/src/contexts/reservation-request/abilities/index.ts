import { CreateReservationRequestAbility } from './create-reservation-request-ability.js';

/**
 * Creates all abilities for the reservation request context at domain level.
 */
export function createReservationRequestAbilities() {
	return CreateReservationRequestAbility.using({} as unknown, {} as unknown, {} as unknown);
}
