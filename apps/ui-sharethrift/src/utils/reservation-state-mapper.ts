/**
 * Maps GraphQL reservation state enum values to ReservationStatusTag values
 * @param state - The GraphQL reservation state (e.g., 'Accepted', 'Requested', 'Closed')
 * @returns The corresponding ReservationStatusTag value
 * @throws Error if the state is not recognized
 */
export function mapReservationState(
	state: string,
): 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED' | 'CANCELLED' {
	switch (state) {
		case 'Accepted':
			return 'ACCEPTED';
		case 'Requested':
			return 'REQUESTED';
		case 'Rejected':
			return 'REJECTED';
		case 'Closed':
			return 'CLOSED';
		case 'Cancelled':
			return 'CANCELLED';
		default:
			// Log the unexpected state for debugging
			console.error(
				`Unexpected reservation state: "${state}". Expected one of: Accepted, Requested, Rejected, Closed, Cancelled`,
			);
			throw new Error(
				`Invalid reservation state: "${state}". Expected one of: Accepted, Requested, Rejected, Closed, Cancelled`,
			);
	}
}
