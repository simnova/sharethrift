import type { ReservationStatusTag } from '../../../../packages/sthrift/ui-components/src/components/reservation-status-tag/reservation-status-tag';

/**
 * Maps GraphQL reservation state enum values to ReservationStatusTag values
 * @param state - The GraphQL reservation state (e.g., 'Accepted', 'Requested', 'Closed')
 * @returns The corresponding ReservationStatusTag value
 */
export function mapReservationState(state: string): ReservationStatusTag {
	switch (state) {
		case 'Accepted':
			return 'ACCEPTED';
		case 'Requested':
			return 'REQUESTED';
		case 'Closed':
			return 'CLOSED';
		case 'Cancelled':
			return 'CANCELLED';
		default:
			return 'REQUESTED'; // Default fallback
	}
}
