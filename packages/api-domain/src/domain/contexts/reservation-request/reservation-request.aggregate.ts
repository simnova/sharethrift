import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import {
	ReservationPeriod,
	ReservationRequestState,
	ReservationRequestStateValue,
} from './reservation-request.value-objects.ts';

export interface ReservationRequestProps
	extends DomainSeedwork.DomainEntityProps {
	state: ReservationRequestStateValue;
	reservationPeriod: ReservationPeriod;
	readonly createdAt: Date;
	updatedAt: Date;
	readonly schemaVersion: number;
	listingId: string;
	reserverId: string;
	closeRequested: boolean;
}

export interface ReservationRequestEntityReference extends Readonly<ReservationRequestProps> {}

export class ReservationRequest<props extends ReservationRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ReservationRequestEntityReference {
	//#region Fields
	private isNew: boolean = false;
	//#endregion Fields

	//#region Constructor
	// Constructor inherited from AggregateRoot
	//#endregion Constructor

	//#region Methods
	public static getNewInstance<props extends ReservationRequestProps>(
		newProps: {
			listingId: string;
			reserverId: string;
			reservationPeriodStart: Date;
			reservationPeriodEnd: Date;
		},
		passport: Passport,
	): ReservationRequest<props> {
		const id = crypto.randomUUID();
		const now = new Date();

		const reservationPeriod = ReservationPeriod.create(
			newProps.reservationPeriodStart,
			newProps.reservationPeriodEnd,
		);

		const reservationRequestProps = {
			...newProps,
			id,
			state: ReservationRequestStateValue.requested(),
			reservationPeriod,
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
			closeRequested: false,
		} as props;

		const aggregate = new ReservationRequest(reservationRequestProps, passport);
		aggregate.markAsNew();
		aggregate.isNew = false;
		return aggregate;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	/** @deprecated Use getNewInstance instead */
	public static create<PassportType>(
		props: {
			listingId: string;
			reserverId: string;
			reservationPeriodStart: Date;
			reservationPeriodEnd: Date;
		},
		passport: PassportType,
	): ReservationRequest<any> {
		return ReservationRequest.getNewInstance(props, passport as Passport);
	}
	//#endregion Methods

	//#region Properties
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
	set listingId(value: string) {
		this.props.listingId = value;
	}

	get reserverId(): string {
		return this.props.reserverId;
	}
	set reserverId(value: string) {
		this.props.reserverId = value;
	}

	get closeRequested(): boolean {
		return this.props.closeRequested;
	}
	//#endregion Properties

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
		return this.props as ReservationRequestEntityReference;
	}
}
