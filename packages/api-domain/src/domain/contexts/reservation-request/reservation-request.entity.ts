import { DomainSeedwork } from '@cellix/domain-seedwork';
import {
	ReservationPeriod,
	ReservationRequestState,
	ReservationRequestStateValue,
} from './reservation-request.value-objects.ts';

export interface ReservationRequestProps
	extends DomainSeedwork.DomainEntityProps {
	state: ReservationRequestStateValue;
	reservationPeriod: ReservationPeriod;
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: number;
	listingId: string;
	reserverId: string;
	closeRequested: boolean;
}

export interface ReservationRequestEntityReference {
	readonly id: string;
}

export class ReservationRequest<
	PassportType,
> extends DomainSeedwork.AggregateRoot<ReservationRequestProps, PassportType> {
	get state(): ReservationRequestStateValue {
		return this.props.state;
	}

	get reservationPeriod(): ReservationPeriod {
		return this.props.reservationPeriod;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get schemaVersion(): number {
		return this.props.schemaVersion;
	}

	get listingId(): string {
		return this.props.listingId;
	}

	get reserverId(): string {
		return this.props.reserverId;
	}

	get closeRequested(): boolean {
		return this.props.closeRequested;
	}

	public static create<PassportType>(
		props: {
			listingId: string;
			reserverId: string;
			reservationPeriodStart: Date;
			reservationPeriodEnd: Date;
		},
		passport: PassportType,
	): ReservationRequest<PassportType> {
		const id = crypto.randomUUID();
		const now = new Date();

		const reservationPeriod = ReservationPeriod.create(
			props.reservationPeriodStart,
			props.reservationPeriodEnd,
		);

		const reservationRequestProps: ReservationRequestProps = {
			id,
			state: ReservationRequestStateValue.requested(),
			reservationPeriod,
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
			listingId: props.listingId,
			reserverId: props.reserverId,
			closeRequested: false,
		};

		return new ReservationRequest(reservationRequestProps, passport);
	}

	public accept(): void {
		if (this.props.state.value !== ReservationRequestState.REQUESTED) {
			throw new Error('Can only accept requested reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.ACCEPTED,
		);
		this.props.updatedAt = new Date();
	}

	public reject(): void {
		if (this.props.state.value !== ReservationRequestState.REQUESTED) {
			throw new Error('Can only reject requested reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.REJECTED,
		);
		this.props.updatedAt = new Date();
	}

	public cancel(): void {
		if (!this.props.state.canBeCancelled()) {
			throw new Error('Cannot cancel reservation in current state');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.CANCELLED,
		);
		this.props.updatedAt = new Date();
	}

	public requestClose(): void {
		if (!this.props.state.canBeClosed()) {
			throw new Error('Cannot close reservation in current state');
		}

		this.props.closeRequested = true;
		this.props.updatedAt = new Date();
	}

	public close(): void {
		if (this.props.state.value !== ReservationRequestState.ACCEPTED) {
			throw new Error('Can only close accepted reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.RESERVATION_PERIOD,
		);
		this.props.updatedAt = new Date();
	}

	public getEntityReference(): ReservationRequestEntityReference {
		return {
			id: this.props.id,
		};
	}
}
