import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { ReservationRequestVisa } from './reservation-request.visa.ts';
import {
	type ReservationPeriod,
	ReservationRequestStateValue,
	ReservationRequestStates,
} from './reservation-request.value-objects.ts';

// Entity references for external aggregates
export interface ListingEntityReference extends DomainSeedwork.DomainEntityProps {
	readonly title: string;
	readonly description: string;
}

export interface ReserverEntityReference extends DomainSeedwork.DomainEntityProps {
	readonly name: string;
	readonly email: string;
}

export interface ReservationRequestProps
	extends DomainSeedwork.DomainEntityProps {
	state: ReservationRequestStateValue;
	reservationPeriod: ReservationPeriod;
	readonly createdAt: Date;
	updatedAt: Date;
	readonly schemaVersion: string;
	listing: Readonly<ListingEntityReference>;
	reserver: Readonly<ReserverEntityReference>;
	closeRequested: boolean;
}

export interface ReservationRequestEntityReference extends Readonly<
	Omit<ReservationRequestProps, 'listing' | 'reserver'>
> {
	readonly listing: Readonly<ListingEntityReference>;
	readonly reserver: Readonly<ReserverEntityReference>;
}

export class ReservationRequest<props extends ReservationRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ReservationRequestEntityReference {
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: ReservationRequestVisa;
	//#endregion Fields

	//#region Constructor
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.reservationRequest.forReservationRequest(this);
	}
	//#endregion Constructor

	//#region Methods
	public static getNewInstance<props extends ReservationRequestProps>(
		newProps: props,
		state: ReservationRequestStateValue,
		listing: ListingEntityReference,
		reserver: ReserverEntityReference,
		reservationPeriod: ReservationPeriod,
		passport: Passport,
	): ReservationRequest<props> {
		const instance = new ReservationRequest(
			{
				...newProps,
				state,
				listing,
				reserver,
				reservationPeriod,
				createdAt: newProps.createdAt ?? new Date(),
				updatedAt: newProps.updatedAt ?? new Date(),
				schemaVersion: newProps.schemaVersion ?? '1',
				closeRequested: newProps.closeRequested ?? false,
			} as props,
			passport
		);
		instance.markAsNew();
		instance.isNew = false;
		return instance;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

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

	get schemaVersion(): string { // changed from number to string
		return this.props.schemaVersion;
	}

	get listing(): ListingEntityReference {
		return this.props.listing;
	}
	set listing(value: ListingEntityReference) {
		if (!this.isNew && !this.visa.determineIf((domainPermissions) => domainPermissions.canUpdateRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this listing'
			);
		}
		this.props.listing = value;
	}

	get reserver(): ReserverEntityReference {
		return this.props.reserver;
	}
	set reserver(value: ReserverEntityReference) {
		if (!this.isNew && !this.visa.determineIf((domainPermissions) => domainPermissions.canUpdateRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this reserver'
			);
		}
		this.props.reserver = value;
	}

	get closeRequested(): boolean {
		return this.props.closeRequested;
	}
	//#endregion Properties

	public accept(): void {
		if (!this.visa.determineIf((domainPermissions) => domainPermissions.canAcceptRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to accept this reservation request'
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
			throw new Error('Can only accept requested reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestStates.ACCEPTED,
		);
		this.props.updatedAt = new Date();
	}

	public reject(): void {
		if (!this.visa.determineIf((domainPermissions) => domainPermissions.canRejectRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reject this reservation request'
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
			throw new Error('Can only reject requested reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestStates.REJECTED,
		);
		this.props.updatedAt = new Date();
	}

	public cancel(): void {
		if (!this.visa.determineIf((domainPermissions) => domainPermissions.canCancelRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this reservation request'
			);
		}

		if (!this.props.state.canBeCancelled()) {
			throw new Error('Cannot cancel reservation in current state');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestStates.CANCELLED,
		);
		this.props.updatedAt = new Date();
	}

	public requestClose(): void {
		if (!this.visa.determineIf((domainPermissions) => domainPermissions.canCloseRequest)) {
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
		if (!this.visa.determineIf((domainPermissions) => domainPermissions.canCloseRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to close this reservation request'
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Can only close accepted reservations');
		}

		this.props.state = ReservationRequestStateValue.create(
			ReservationRequestStates.RESERVATION_PERIOD,
		);
		this.props.updatedAt = new Date();
	}

	public getEntityReference(): ReservationRequestEntityReference {
		return this.props as ReservationRequestEntityReference;
	}
}
