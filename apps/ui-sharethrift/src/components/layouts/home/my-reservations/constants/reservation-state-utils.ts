// Reservation state constants and helper functions for filtering and checking states.

export const ACTIVE_RESERVATION_STATES = ['Accepted', 'Requested'] as const;
export const INACTIVE_RESERVATION_STATES = [
	'Cancelled',
	'Closed',
	'Rejected',
] as const;

export type ActiveReservationState = (typeof ACTIVE_RESERVATION_STATES)[number];
export type InactiveReservationState =
	(typeof INACTIVE_RESERVATION_STATES)[number];
export type ReservationState =
	| ActiveReservationState
	| InactiveReservationState;

export function isActiveReservationState(state: string): boolean {
	return ACTIVE_RESERVATION_STATES.includes(state as ActiveReservationState);
}

export function isInactiveReservationState(state: string): boolean {
	return INACTIVE_RESERVATION_STATES.includes(
		state as InactiveReservationState,
	);
}

