/**
 * Shared utility functions for reservation request state filtering
 * Centralizes the logic for filtering by reservation states to maintain DRY principle
 */

export const RESERVATION_STATES = {
	ACTIVE: ['Accepted', 'Requested'] as const,
	INACTIVE: ['Cancelled', 'Closed', 'Rejected'] as const,
} as const;

/**
 * Build a Mongo filter for any list of states.
 */
export const filterByStates = (states: readonly string[]) => ({
	state: { $in: states },
});
