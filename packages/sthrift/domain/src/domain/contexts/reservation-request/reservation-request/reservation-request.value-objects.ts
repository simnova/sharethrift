import { VOString } from '@lucaspaganini/value-objects';

export class ReservationPeriodStart extends VOString() {}
export class ReservationPeriodEnd extends VOString() {}

export const ReservationRequestStates = {
	PENDING: 'PENDING',
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
