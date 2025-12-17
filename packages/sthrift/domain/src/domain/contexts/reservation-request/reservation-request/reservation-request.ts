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
		// Validate required parameters
		if (!listing) {
			throw new Error('value cannot be null or undefined');
		}
		if (!reserver) {
			throw new Error('value cannot be null or undefined');
		}
		
		// Validate reservation period
		if (
			reservationPeriodStart &&
			reservationPeriodEnd &&
			reservationPeriodStart.getTime() >= reservationPeriodEnd.getTime()
		) {
			throw new Error('Reservation start date must be before end date');
		}
		
		const instance = new ReservationRequest(newProps, passport);
		
		// Mark instance as new before setting properties to allow setters to validate
		instance.isNew = true;
		
		// Set all properties using setters to maintain validation - no ordering constraints
		instance.listing = listing;
		instance.reserver = reserver;
		instance.reservationPeriodStart = reservationPeriodStart;
		instance.reservationPeriodEnd = reservationPeriodEnd;
		instance.props.state = new ValueObjects.ReservationRequestStateValue(state).valueOf();
		
		// Emit integration event after all properties are set
		instance.markAsNew();
		
		// Lock the instance by setting isNew to false to prevent further modifications
		instance.isNew = false;
		
		return instance;
	}

	private markAsNew(): void {
		// Emit integration event for new reservation request
		this.addIntegrationEvent(ReservationRequestCreated, {
			reservationRequestId: this.props.id,
			listingId: this.props.listing.id,
			reserverId: this.props.reserver.id,
			sharerId: this.props.listing.sharer?.id ?? '',
			reservationPeriodStart: this.props.reservationPeriodStart,
			reservationPeriodEnd: this.props.reservationPeriodEnd,
		});
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
		return await this.loadUser('reserver');
	}

	async loadSharer(): Promise<UserEntityReference> {
		return await this.loadUser('sharer');
	}

	async loadListing(): Promise<ItemListingEntityReference> {
		return await this.props.loadListing();
	}

	/**
	 * Generic method to load user entities (reserver or sharer) with consistent error handling
	 */
	private async loadUser(userType: 'reserver' | 'sharer'): Promise<UserEntityReference> {
		try {
			switch (userType) {
				case 'reserver':
					return await this.props.loadReserver();
				case 'sharer':
					return (await this.props.loadListing()).sharer;
				default:
					throw new Error(`Unknown user type: ${userType}`);
			}
		} catch (error) {
			throw new Error(`Failed to load ${userType}: ${error instanceof Error ? error.message : String(error)}`);
		}
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

		this.props.state = new ValueObjects.ReservationRequestStateValue(
			ReservationRequestStates.REQUESTED,
		).valueOf();
	}

	//#region User Contact Information Helpers
	/**
	 * Centralizes user email derivation logic with fallback chain
	 * @param user User entity reference (Personal or Admin user)
	 * @returns Email address or null if none available
	 */
	public static getUserEmail(user: UserEntityReference): string | null {
		// Both PersonalUser and AdminUser have email at account.email
		// Return null only if user or account doesn't exist, preserve empty string
		if (!user || !user.account) {
			return null;
		}
		return user.account.email ?? null;
	}

	/**
	 * Centralizes user display name derivation logic with fallback chain
	 * @param user User entity reference (Personal or Admin user) 
	 * @param defaultName Default name to use if none available
	 * @returns Display name with appropriate fallbacks
	 */
	public static getUserDisplayName(user: UserEntityReference, defaultName: string = 'User'): string {
		// Handle null/undefined user early
		if (!user) {
			return defaultName;
		}
		
		// Both PersonalUser and AdminUser have firstName at account.profile.firstName
		// Try direct properties first (for compatibility), then nested profile access
		type UserWithOptionalProps = UserEntityReference & {
			displayName?: string;
			firstName?: string;
		};
		const userWithDirectProps = user as UserWithOptionalProps;
		const { displayName, firstName } = userWithDirectProps;
		const profileFirstName = user.account?.profile?.firstName;
		
		return (
			displayName ||
			firstName ||
			profileFirstName ||
			defaultName
		);
	}

	/**
	 * Convenience method to get both email and name for notifications
	 * @param user User entity reference
	 * @param defaultName Default name if none available  
	 * @returns Object with email and name, or null if no email available
	 */
	public static getUserContactInfo(
		user: UserEntityReference,
		defaultName: string = 'User',
	): { email: string; name: string } | null {
		// Handle null user
		if (!user) {
			return null;
		}
		
		const email = ReservationRequest.getUserEmail(user);
		if (!email) {
			return null;
		}
		const name = ReservationRequest.getUserDisplayName(user, defaultName);
		return { email, name };
	}
	//#endregion User Contact Information Helpers


}
