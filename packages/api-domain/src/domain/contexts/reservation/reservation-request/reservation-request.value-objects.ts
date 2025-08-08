import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface ReservationPeriodProps
	extends DomainSeedwork.ValueObjectProps {
	start: Date;
	end: Date;
}

export class ReservationPeriod extends DomainSeedwork.ValueObject<ReservationPeriodProps> {
	get start(): Date {
		return this.props.start;
	}

	get end(): Date {
		return this.props.end;
	}

	public static create(start: Date, end: Date): ReservationPeriod {
		if (start >= end) {
			throw new Error('Reservation start date must be before end date');
		}
		if (start < new Date()) {
			throw new Error('Reservation start date cannot be in the past');
		}
		return new ReservationPeriod({ start, end });
	}

	public isActive(): boolean {
		const now = new Date();
		return now >= this.props.start && now <= this.props.end;
	}

	public getDurationInDays(): number {
		const diffTime = this.props.end.getTime() - this.props.start.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
}

export const ReservationRequestState = {
	REQUESTED: 'Requested',
	ACCEPTED: 'Accepted',
	REJECTED: 'Rejected',
	RESERVATION_PERIOD: 'Reservation Period',
	CANCELLED: 'Cancelled',
} as const;

export type ReservationRequestState = typeof ReservationRequestState[keyof typeof ReservationRequestState];

export interface ReservationRequestStateProps
	extends DomainSeedwork.ValueObjectProps {
	state: ReservationRequestState;
}

export class ReservationRequestStateValue extends DomainSeedwork.ValueObject<ReservationRequestStateProps> {
	get value(): ReservationRequestState {
		return this.props.state;
	}

	public static create(
		state: ReservationRequestState,
	): ReservationRequestStateValue {
		return new ReservationRequestStateValue({ state });
	}

	public static requested(): ReservationRequestStateValue {
		return new ReservationRequestStateValue({
			state: ReservationRequestState.REQUESTED,
		});
	}

	public isActive(): boolean {
		const activeStates: ReservationRequestState[] = [
			ReservationRequestState.REQUESTED,
			ReservationRequestState.ACCEPTED,
			ReservationRequestState.REJECTED,
			ReservationRequestState.CANCELLED,
		];
		return activeStates.includes(this.props.state);
	}

	public isClosed(): boolean {
		return this.props.state === ReservationRequestState.RESERVATION_PERIOD;
	}

	public canBeCancelled(): boolean {
		const cancellableStates: ReservationRequestState[] = [
			ReservationRequestState.REQUESTED,
			ReservationRequestState.REJECTED,
		];
		return cancellableStates.includes(this.props.state);
	}

	public canBeClosed(): boolean {
		return this.props.state === ReservationRequestState.ACCEPTED;
	}

	public canBeMessaged(): boolean {
		const messagingStates: ReservationRequestState[] = [
			ReservationRequestState.REQUESTED,
			ReservationRequestState.ACCEPTED,
		];
		return messagingStates.includes(this.props.state);
	}
}
