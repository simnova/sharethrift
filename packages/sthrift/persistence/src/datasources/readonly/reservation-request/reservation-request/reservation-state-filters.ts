/**
 * Shared utility functions for reservation request state filtering
 * Centralizes the logic for filtering by reservation states to maintain DRY principle
 */

export const RESERVATION_STATES = {
	ACTIVE: ['Accepted', 'Requested'] as const,
	INACTIVE: ['Cancelled', 'Closed', 'Rejected'] as const,
} as const;

/**
 * Returns a MongoDB filter for active reservation states (Accepted, Requested)
 */
export const getActiveReservationStateFilter = () => ({
	state: { $in: RESERVATION_STATES.ACTIVE },
});

/**
 * Returns a MongoDB filter for inactive reservation states (Cancelled, Closed, Rejected)
 */
export const getInactiveReservationStateFilter = () => ({
	state: { $nin: RESERVATION_STATES.ACTIVE },
});

/**
 * Returns a MongoDB filter for a specific reservation state
 */
export const getSpecificReservationStateFilter = (state: string) => ({
	state,
});
