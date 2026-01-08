import { VOString } from '@lucaspaganini/value-objects';

export class ReservationPeriodStart extends VOString() {}
export class ReservationPeriodEnd extends VOString() {}

export const ReservationRequestStates = {
	REQUESTED: 'Requested',
	ACCEPTED: 'Accepted',
	REJECTED: 'Rejected',
	CANCELLED: 'Cancelled',
    CLOSED: 'Closed'
} as const;
type StatesType =
	(typeof ReservationRequestStates)[keyof typeof ReservationRequestStates];

const ReservationRequestStateBase = VOString({ trim: true });

export class ReservationRequestStateValue extends ReservationRequestStateBase {
	constructor(value: string) {
		if (
			!Object.values(ReservationRequestStates).includes(value as StatesType)
		) {
			throw new Error(
				`Invalid state: ${value}. Allowed: ${Object.values(ReservationRequestStates).join(', ')}`,
			);
		}
		super(value);
	}
}

export const ReservationRequestCloseRequestedByTypes = {
	SHARER: 'SHARER',
	RESERVER: 'RESERVER',
} as const;

export type ReservationRequestCloseRequestedBy =
	(typeof ReservationRequestCloseRequestedByTypes)[keyof typeof ReservationRequestCloseRequestedByTypes];

const ReservationRequestCloseRequestedByBase = VOString({ trim: true });

export class ReservationRequestCloseRequestedByValue extends ReservationRequestCloseRequestedByBase {
	constructor(value: string) {
		if (
			!Object.values(ReservationRequestCloseRequestedByTypes).includes(
				value as ReservationRequestCloseRequestedBy,
			)
		) {
			throw new Error(
				`Invalid closeRequestedBy: ${value}. Allowed: ${Object.values(ReservationRequestCloseRequestedByTypes).join(', ')}`,
			);
		}
		super(value);
	}
}
