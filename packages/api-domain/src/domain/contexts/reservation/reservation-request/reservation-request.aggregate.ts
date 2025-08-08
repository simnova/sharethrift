import { DomainSeedwork } from '@cellix/domain-seedwork';
import {
	ReservationPeriod,
	ReservationRequestState,
	ReservationRequestStateValue,
} from './reservation-request.value-objects.ts';
import type { ReservationVisa } from '../reservation.visa.ts';
import type { ReservationPassport } from '../reservation.passport.ts';

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

export interface ReservationRequestEntityReference extends Readonly<ReservationRequestProps> {
	readonly id: string;
}

export class ReservationRequest<
	props extends ReservationRequestProps,
> extends DomainSeedwork.AggregateRoot<props, ReservationPassport> 
	implements ReservationRequestEntityReference {
	
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: ReservationVisa;
	//#endregion Fields

	//#region Constructor
	constructor(props: props, passport: ReservationPassport) {
		super(props, passport);
		this.visa = passport.forReservationRequest(this);
	}
	//#endregion Constructor

	//#region Methods
	public static getNewInstance<props extends ReservationRequestProps>(
		newProps: {
			listingId: string;
			reserverId: string;
			reservationPeriodStart: Date;
			reservationPeriodEnd: Date;
		},
		passport: ReservationPassport
	): ReservationRequest<props> {
		const id = crypto.randomUUID();
		const now = new Date();

		const reservationPeriod = ReservationPeriod.create(
			newProps.reservationPeriodStart,
			newProps.reservationPeriodEnd,
		);

		const reservationRequestProps = {
			id,
			state: ReservationRequestStateValue.requested(),
			reservationPeriod,
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
			listingId: newProps.listingId,
			reserverId: newProps.reserverId,
			closeRequested: false,
		} as props;

		const aggregate = new ReservationRequest(reservationRequestProps, passport);
		aggregate.markAsNew();
		// Set required properties if any
		aggregate.isNew = false;
		return aggregate;
	}

	public static create(
		props: {
			listingId: string;
			reserverId: string;
			reservationPeriodStart: Date;
			reservationPeriodEnd: Date;
		},
		passport: ReservationPassport,
	): ReservationRequest<ReservationRequestProps> {
		return ReservationRequest.getNewInstance(props, passport);
	}

	private markAsNew(): void {
		this.isNew = true;
		// TODO: Add integration event for aggregate creation when event system is set up
		// this.addIntegrationEvent(ReservationRequestCreatedEvent, {
		// 	aggregateId: this.id
		// });
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

	get reserverId(): string {
		return this.props.reserverId;
	}

	get closeRequested(): boolean {
		return this.props.closeRequested;
	}

	public accept(): void {
		if (!this.isNew && !this.visa.determineIf(
			permissions => permissions.canAcceptReservationRequest
		)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to accept this reservation request'
			);
		}

		if (this.props.state.value !== ReservationRequestState.REQUESTED) {
			throw new Error('Can only accept requested reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.ACCEPTED,
		);
		this.props.updatedAt = new Date();

		// TODO: Add domain event when event system is set up
		// this.addDomainEvent(ReservationRequestAcceptedEvent, {
		// 	aggregateId: this.id,
		// 	state: this.state.value,
		// });
	}

	public reject(): void {
		if (!this.isNew && !this.visa.determineIf(
			permissions => permissions.canRejectReservationRequest
		)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reject this reservation request'
			);
		}

		if (this.props.state.value !== ReservationRequestState.REQUESTED) {
			throw new Error('Can only reject requested reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.REJECTED,
		);
		this.props.updatedAt = new Date();
	}

	public cancel(): void {
		if (!this.isNew && !this.visa.determineIf(
			permissions => permissions.canCancelReservationRequest
		)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this reservation request'
			);
		}

		if (!this.props.state.canBeCancelled()) {
			throw new Error('Cannot cancel reservation in current state');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestState.CANCELLED,
		);
		this.props.updatedAt = new Date();
	}

	public requestClose(): void {
		if (!this.isNew && !this.visa.determineIf(
			permissions => permissions.canRequestCloseReservationRequest
		)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation request'
			);
		}

		if (!this.props.state.canBeClosed()) {
			throw new Error('Cannot close reservation in current state');
		}

		this.props.closeRequested = true;
		this.props.updatedAt = new Date();
	}

	public close(): void {
		if (!this.isNew && !this.visa.determineIf(
			permissions => permissions.canCloseReservationRequest
		)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to close this reservation request'
			);
		}

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
			...this.props,
			id: this.props.id,
		};
	}
	//#endregion Properties
}