import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ReservationRequestVisa } from '../reservation-request.visa.ts';
import { ReservationRequestStates } from './reservation-request.value-objects.ts';
import * as ValueObjects from './reservation-request.value-objects.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { UserEntityReference } from '../../user/index.ts';
import type {
	ReservationRequestEntityReference,
	ReservationRequestProps,
} from './reservation-request.entity.ts';
import { ReservationRequestCreated } from '../../../events/index.ts';

export class ReservationRequest<props extends ReservationRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ReservationRequestEntityReference
{
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: ReservationRequestVisa;
	private _listingId?: string;
	private _reserverId?: string;
	private _sharerId?: string;
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
		state: string,
		listing: ItemListingEntityReference,
		reserver: UserEntityReference,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
		passport: Passport,
	): ReservationRequest<props> {
		// Validate reservation period
		if (
			reservationPeriodStart &&
			reservationPeriodEnd &&
			reservationPeriodStart.getTime() >= reservationPeriodEnd.getTime()
		) {
			throw new Error('Reservation start date must be before end date');
		}
		const instance = new ReservationRequest(newProps, passport);
		instance.markAsNew();
		instance.state = state;
		instance.listing = listing;
		instance.reserver = reserver;
		instance.reservationPeriodStart = reservationPeriodStart;
		instance.reservationPeriodEnd = reservationPeriodEnd;
		// Store IDs for integration event
		instance._listingId = listing.id;
		instance._reserverId = reserver.id;
		instance._sharerId = listing.sharer.id;
		instance.isNew = false;
		
		return instance;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	//#region Properties
	get state(): string {
		return this.props.state;
	}
	set state(value: string) {
		switch (value) {
			case ReservationRequestStates.ACCEPTED:
				this.accept();
				break;
			case ReservationRequestStates.REJECTED:
				this.reject();
				break;
			case ReservationRequestStates.CANCELLED:
				this.cancel();
				break;
			case ReservationRequestStates.CLOSED:
				this.close();
				break;
			case ReservationRequestStates.REQUESTED:
				this.request();
				break;
		}
	}

	get reservationPeriodStart(): Date {
		return this.props.reservationPeriodStart;
	}
	set reservationPeriodStart(value: Date) {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Reservation period start date cannot be updated after creation',
			);
		}
		if (!value) {
			throw new DomainSeedwork.PermissionError(
				'value cannot be null or undefined',
			);
		}

		if (value.getTime() < Date.now()) {
			throw new DomainSeedwork.PermissionError(
				'Reservation period start date must be today or in the future',
			);
		}

		if (
			this.props.reservationPeriodEnd &&
			value.getTime() >= this.props.reservationPeriodEnd.getTime()
		) {
			throw new DomainSeedwork.PermissionError(
				'Reservation period start date must be before the end date',
			);
		}
		this.props.reservationPeriodStart = value;
	}

	get reservationPeriodEnd(): Date {
		return this.props.reservationPeriodEnd;
	}
	set reservationPeriodEnd(value: Date) {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this reservation period',
			);
		}
		if (!value) {
			throw new DomainSeedwork.PermissionError(
				'value cannot be null or undefined',
			);
		}

		if (value.getTime() < Date.now()) {
			throw new DomainSeedwork.PermissionError(
				'Reservation period end date must be in the future',
			);
		}

		if (
			this.props.reservationPeriodStart &&
			value.getTime() <= this.props.reservationPeriodStart.getTime()
		) {
			throw new DomainSeedwork.PermissionError(
				'Reservation period end date must be after the start date',
			);
		}
		this.props.reservationPeriodEnd = value;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get schemaVersion(): string {
		return this.props.schemaVersion;
	}

	get listing(): ItemListingEntityReference {
		return this.props.listing;
	}
	set listing(value: ItemListingEntityReference) {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Listing can only be set when creating a new reservation request',
			);
		}
		if (value === null || value === undefined) {
			throw new DomainSeedwork.PermissionError(
				'value cannot be null or undefined',
			);
		}

		if (value.state !== 'Published') {
			throw new DomainSeedwork.PermissionError(
				'Cannot create reservation request for listing that is not published',
			);
		}
		this.props.listing = value;
	}

	get reserver(): UserEntityReference {
		return this.props.reserver;
	}
	set reserver(value: UserEntityReference) {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Reserver can only be set when creating a new reservation request',
			);
		}
		if (value === null || value === undefined) {
			throw new DomainSeedwork.PermissionError(
				'value cannot be null or undefined',
			);
		}
		this.props.reserver = value;
	}

	get closeRequestedBySharer(): boolean {
		return this.props.closeRequestedBySharer;
	}
	set closeRequestedBySharer(value: boolean) {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCloseRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation request',
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Cannot close reservation in current state');
		}

		this.props.closeRequestedBySharer = value;
	}

	get closeRequestedByReserver(): boolean {
		return this.props.closeRequestedByReserver;
	}
	set closeRequestedByReserver(value: boolean) {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCloseRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation request',
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Cannot close reservation in current state');
		}

		this.props.closeRequestedByReserver = value;
	}

	//#endregion Properties

	async loadReserver(): Promise<UserEntityReference> {
		return await this.props.loadReserver();
	}

	async loadListing(): Promise<ItemListingEntityReference> {
		return await this.props.loadListing();
	}

	private accept(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canAcceptRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to accept this reservation request',
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
			throw new Error('Can only accept requested reservations');
		}

		this.props.state = new ValueObjects.ReservationRequestStateValue(
			ReservationRequestStates.ACCEPTED,
		).valueOf();
	}

	private reject(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canRejectRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reject this reservation request',
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
			throw new Error('Can only reject requested reservations');
		}

		this.props.state = new ValueObjects.ReservationRequestStateValue(
			ReservationRequestStates.REJECTED,
		).valueOf();
	}

	private cancel(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCancelRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this reservation request',
			);
		}

		if (
			this.props.state.valueOf() !== ReservationRequestStates.REQUESTED &&
			this.props.state.valueOf() !== ReservationRequestStates.REJECTED
		) {
			throw new Error('Cannot cancel reservation in current state');
		}

		this.props.state = new ValueObjects.ReservationRequestStateValue(
			ReservationRequestStates.CANCELLED,
		).valueOf();
	}

	private close(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCloseRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to close this reservation request',
			);
		}

		if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Can only close accepted reservations');
		}

		if (
			!(
				this.props.closeRequestedBySharer || this.props.closeRequestedByReserver
			)
		) {
			throw new Error(
				'Can only close reservation requests if at least one user requested it',
			);
		}

		this.props.state = new ValueObjects.ReservationRequestStateValue(
			ReservationRequestStates.CLOSED,
		).valueOf();
	}

	private request(): void {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Can only set state to requested when creating new reservation requests',
			);
		}

		if (!this.isNew) {
			throw new Error(
				'Can only set state to requested when creating new reservation requests',
			);
		}

		this.props.state = new ValueObjects.ReservationRequestStateValue(
			ReservationRequestStates.REQUESTED,
		).valueOf();
	}

	public override onSave(isModified: boolean): void {
		console.log(`[ReservationRequest.onSave] Called with isModified: ${isModified}, state: ${this.props.state.valueOf()}, expected: ${ReservationRequestStates.REQUESTED}`);
		
		// Only emit the integration event when the reservation request is being created
		if (isModified && this.props.state.valueOf() === ReservationRequestStates.REQUESTED) {
			console.log(`[ReservationRequest.onSave] Conditions met, checking IDs - listingId: ${this._listingId}, reserverId: ${this._reserverId}, sharerId: ${this._sharerId}`);
			
			if (!this._listingId || !this._reserverId || !this._sharerId) {
				console.error(`[ReservationRequest.onSave] Missing required IDs for integration event - listingId: ${this._listingId}, reserverId: ${this._reserverId}, sharerId: ${this._sharerId}`);
				throw new Error('Missing required IDs for integration event');
			}
			
			console.log(`[ReservationRequest.onSave] Adding ReservationRequestCreated integration event for reservation ${this.props.id}`);
			this.addIntegrationEvent(ReservationRequestCreated, {
				reservationRequestId: this.props.id,
				listingId: this._listingId,
				reserverId: this._reserverId,
				sharerId: this._sharerId,
				reservationPeriodStart: this.props.reservationPeriodStart,
				reservationPeriodEnd: this.props.reservationPeriodEnd,
			});
			console.log(`[ReservationRequest.onSave] Integration event added successfully`);
		} else {
			console.log(`[ReservationRequest.onSave] Conditions not met - isModified: ${isModified}, state: ${this.props.state.valueOf()}, expected: ${ReservationRequestStates.REQUESTED}`);
		}
	}
}
