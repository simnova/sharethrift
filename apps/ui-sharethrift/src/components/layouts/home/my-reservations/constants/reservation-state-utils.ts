// Reservation state constants and helper functions for filtering and checking states.

export const ACTIVE_RESERVATION_STATES = ['Accepted', 'Requested'] as const;
export const INACTIVE_RESERVATION_STATES = [
	'Cancelled',
	'Closed',
	'Rejected',
] as const;

type ActiveReservationState = (typeof ACTIVE_RESERVATION_STATES)[number];
type InactiveReservationState = (typeof INACTIVE_RESERVATION_STATES)[number];

export function isActiveReservationState(state: string): boolean {
	return ACTIVE_RESERVATION_STATES.includes(state as ActiveReservationState);
}

export function isInactiveReservationState(state: string): boolean {
	return INACTIVE_RESERVATION_STATES.includes(
		state as InactiveReservationState,
	);
}

