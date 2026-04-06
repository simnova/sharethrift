import { CreateReservationRequestAbility } from './create-reservation-request-ability.ts';

// Factory: creates fresh ability instances per scenario to prevent state leakage
export const reservationRequestAbilities = {
	create: () => [CreateReservationRequestAbility.using()],
};
