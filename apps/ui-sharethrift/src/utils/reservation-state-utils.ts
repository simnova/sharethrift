/**
 * Shared reservation state constants and utility functions
 * Centralizes reservation state logic to maintain consistency across the application
 */

/**
 * Reservation states that are considered "active" (ongoing reservations)
 */
export const ACTIVE_RESERVATION_STATES = ['Accepted', 'Requested'] as const;

/**
 * Reservation states that are considered "inactive" (completed/cancelled reservations)
 */
export const INACTIVE_RESERVATION_STATES = [
	'Cancelled',
	'Closed',
	'Rejected',
] as const;

/**
 * All possible reservation states
 */
export const ALL_RESERVATION_STATES = [
	...ACTIVE_RESERVATION_STATES,
	...INACTIVE_RESERVATION_STATES,
] as const;

/**
 * Type definitions for reservation states
 */
export type ActiveReservationState = (typeof ACTIVE_RESERVATION_STATES)[number];
export type InactiveReservationState =
	(typeof INACTIVE_RESERVATION_STATES)[number];
export type ReservationState = (typeof ALL_RESERVATION_STATES)[number];

/**
 * Check if a reservation state is considered active
 * @param state - The reservation state to check
 * @returns true if the state is active, false otherwise
 */
export function isActiveReservationState(state: string): boolean {
	return ACTIVE_RESERVATION_STATES.includes(state as ActiveReservationState);
}

/**
 * Check if a reservation state is considered inactive
 * @param state - The reservation state to check
 * @returns true if the state is inactive, false otherwise
 */
export function isInactiveReservationState(state: string): boolean {
	return INACTIVE_RESERVATION_STATES.includes(
		state as InactiveReservationState,
	);
}

/**
 * Filter reservations by active states
 * @param reservations - Array of reservations to filter
 * @returns Array of reservations with active states
 */
export function filterActiveReservations<T extends { state: string }>(
	reservations: T[],
): T[] {
	return reservations.filter((reservation) =>
		isActiveReservationState(reservation.state),
	);
}

/**
 * Filter reservations by inactive states
 * @param reservations - Array of reservations to filter
 * @returns Array of reservations with inactive states
 */
export function filterInactiveReservations<T extends { state: string }>(
	reservations: T[],
): T[] {
	return reservations.filter((reservation) =>
		isInactiveReservationState(reservation.state),
	);
}
