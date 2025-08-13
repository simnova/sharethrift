import { VOString, VOOptional, VOObject } from '@lucaspaganini/value-objects';




class ReservationPeriodStartBase extends VOString({ trim: true, maxLength: 32, minLength: 1 }) {}
class ReservationPeriodEndBase extends VOString({ trim: true, maxLength: 32, minLength: 1 }) {}
export class ReservationPeriodStart extends VOOptional(ReservationPeriodStartBase, [null]) {}
export class ReservationPeriodEnd extends VOOptional(ReservationPeriodEndBase, [null]) {}

export class ReservationPeriod extends VOObject({
	start: ReservationPeriodStart,
	end: ReservationPeriodEnd,
}) {
	constructor({ start, end }: { start: string | null, end: string | null }) {
		super({ start, end });
			if (start && end) {
				const startDate = new Date(start);
				const endDate = new Date(end);
				if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
					throw new Error('Wrong raw value type');
				}
				if (startDate >= endDate) {
					throw new Error('Reservation start date must be before end date');
				}
				if (startDate < new Date()) {
					throw new Error('Reservation start date cannot be in the past');
				}
			}
		Object.freeze(this);
	}

	isActive(): boolean {
		if (!this.start.valueOf() || !this.end.valueOf()) return false;
		const now = new Date();
		const startDate = new Date(this.start.valueOf() as string);
		const endDate = new Date(this.end.valueOf() as string);
		return now >= startDate && now <= endDate;
	}

	getDurationInDays(): number {
		if (!this.start.valueOf() || !this.end.valueOf()) return 0;
		const startDate = new Date(this.start.valueOf() as string);
		const endDate = new Date(this.end.valueOf() as string);
		const diffTime = endDate.getTime() - startDate.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
}


export const ReservationRequestStates = {
	REQUESTED: 'Requested',
	ACCEPTED: 'Accepted',
	REJECTED: 'Rejected',
	RESERVATION_PERIOD: 'Reservation Period',
	CANCELLED: 'Cancelled',
} as const;

export type ReservationRequestState = typeof ReservationRequestStates[keyof typeof ReservationRequestStates];

class ReservationRequestStateBase extends VOString({ trim: true, maxLength: 32, minLength: 3 }) {}

export class ReservationRequestStateValue extends ReservationRequestStateBase {
	constructor(value: string) {
		super(value);
		if (!Object.values(ReservationRequestStates).includes(value as ReservationRequestState)) {
			throw new Error('Invalid ReservationRequestState');
		}
		Object.freeze(this);
	}

	static create(state: ReservationRequestState): ReservationRequestStateValue {
		return new ReservationRequestStateValue(state);
	}

	static requested(): ReservationRequestStateValue {
		return new ReservationRequestStateValue(ReservationRequestStates.REQUESTED);
	}

	override valueOf(): ReservationRequestState {
		return this.toString() as ReservationRequestState;
	}

	isActive(): boolean {
		const activeStates: ReservationRequestState[] = [
			ReservationRequestStates.REQUESTED,
			ReservationRequestStates.ACCEPTED,
			ReservationRequestStates.REJECTED,
			ReservationRequestStates.CANCELLED,
		];
		return activeStates.includes(this.valueOf());
	}

	isClosed(): boolean {
		return this.valueOf() === ReservationRequestStates.RESERVATION_PERIOD;
	}

	canBeCancelled(): boolean {
		const cancellableStates: ReservationRequestState[] = [
			ReservationRequestStates.REQUESTED,
			ReservationRequestStates.REJECTED,
		];
		return cancellableStates.includes(this.valueOf());
	}

	canBeClosed(): boolean {
		return this.valueOf() === ReservationRequestStates.ACCEPTED;
	}

	canBeMessaged(): boolean {
		const messagingStates: ReservationRequestState[] = [
			ReservationRequestStates.REQUESTED,
			ReservationRequestStates.ACCEPTED,
		];
		return messagingStates.includes(this.valueOf());
	}
}
