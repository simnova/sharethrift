import type { ReservationRequestState } from '../../../../../../generated.tsx';

/**
 * Canonical status type for reservation UI components.
 * Reuse this type across all reservation-related components to avoid status drift.
 */
export type ReservationActionStatus =
	| 'ACCEPTED'
	| 'REQUESTED'
	| 'REJECTED'
	| 'CLOSED'
	| 'CANCELLED';

const VALID_STATUSES: Set<ReservationActionStatus> = new Set([
	'ACCEPTED',
	'REQUESTED',
	'REJECTED',
	'CLOSED',
	'CANCELLED',
]);

export function mapReservationStateToStatus(
	state: ReservationRequestState | null | undefined,
): ReservationActionStatus {
	const normalized = state?.toUpperCase() as ReservationActionStatus;
	return VALID_STATUSES.has(normalized) ? normalized : 'REQUESTED';
}
