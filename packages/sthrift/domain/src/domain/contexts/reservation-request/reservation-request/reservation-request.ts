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

export class ReservationRequest<props extends ReservationRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ReservationRequestEntityReference
{
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
		instance.listing = listing;
		instance.reserver = reserver;
		instance.reservationPeriodStart = reservationPeriodStart;
		instance.reservationPeriodEnd = reservationPeriodEnd;
		// Set initial state directly, bypassing the state setter and its permission checks.
		// This is necessary during initialization, as permission checks and transition logic
		// in the setter are only relevant for state changes after construction.
		instance.props.state = state;
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
		const stateValue = value.valueOf ? value.valueOf() : value;

		// Common guard for non-initial transitions
		if (!this.isNew && stateValue !== ReservationRequestStates.REQUESTED) {
			this.ensureCanEditReservationRequest();
		}

		switch (stateValue) {
			case ReservationRequestStates.ACCEPTED:
				this.transitionToAccepted();
				break;
			case ReservationRequestStates.REJECTED:
				this.transitionToRejected();
				break;
			case ReservationRequestStates.CANCELLED:
				this.transitionToCancelled();
				break;
			case ReservationRequestStates.CLOSED:
				this.transitionToClosed();
				break;
			case ReservationRequestStates.REQUESTED:
				this.transitionToRequested();
				break;
			default:
				throw new DomainSeedwork.PermissionError(
					`Invalid reservation request state: "${stateValue}". Valid states are: ${Object.values(ReservationRequestStates).join(', ')}`,
				);
		}
	}

	private ensureCanEditReservationRequest(): void {
		if (!this.isNew && !this.visa.determineIf(
			(domainPermissions) => domainPermissions.canEditReservationRequest,
		)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this reservation request',
			);
		}
	}

	private transitionToAccepted(): void {
		if (this.props.state !== ReservationRequestStates.REQUESTED) {
			throw new DomainSeedwork.PermissionError(
				'Can only accept requested reservations',
			);
		}
		this.setStateValue(ReservationRequestStates.ACCEPTED);
	}

	private transitionToRejected(): void {
		if (this.props.state !== ReservationRequestStates.REQUESTED) {
			throw new DomainSeedwork.PermissionError(
				'Can only reject requested reservations',
			);
		}
		this.setStateValue(ReservationRequestStates.REJECTED);
	}

	private transitionToCancelled(): void {
		if (
			this.props.state !== ReservationRequestStates.REQUESTED &&
			this.props.state !== ReservationRequestStates.REJECTED
		) {
			throw new DomainSeedwork.PermissionError(
				'Cannot cancel reservation in current state',
			);
		}
		this.setStateValue(ReservationRequestStates.CANCELLED);
	}

	private transitionToClosed(): void {
		if (this.props.state !== ReservationRequestStates.ACCEPTED) {
			throw new DomainSeedwork.PermissionError(
				'Can only close accepted reservations',
			);
		}
		if (!this.props.closeRequestedBySharer && !this.props.closeRequestedByReserver) {
			throw new DomainSeedwork.PermissionError(
				'Can only close reservation requests if at least one user requested it',
			);
		}
		this.setStateValue(ReservationRequestStates.CLOSED);
	}

	private transitionToRequested(): void {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Can only set state to requested when creating new reservation requests',
			);
		}
		this.setStateValue(ReservationRequestStates.REQUESTED);
	}

	private setStateValue(stateValue: string): void {
		this.props.state = new ValueObjects.ReservationRequestStateValue(stateValue).valueOf() as string;
	}

	private ensureCanRequestClose(): void {
		if (!this.visa.determineIf((domainPermissions) => domainPermissions.canEditReservationRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Cannot close reservation in current state');
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

		if (value.state !== 'Active') {
			throw new DomainSeedwork.PermissionError(
				'Cannot create reservation request for listing that is not active',
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
		this.ensureCanRequestClose();
		this.props.closeRequestedBySharer = value;
	}

	get closeRequestedByReserver(): boolean {
		return this.props.closeRequestedByReserver;
	}
	set closeRequestedByReserver(value: boolean) {
		this.ensureCanRequestClose();
		this.props.closeRequestedByReserver = value;
	}

	//#endregion Properties

	async loadReserver(): Promise<UserEntityReference> {
		return await this.props.loadReserver();
	}

	async loadListing(): Promise<ItemListingEntityReference> {
		return await this.props.loadListing();
	}
}
