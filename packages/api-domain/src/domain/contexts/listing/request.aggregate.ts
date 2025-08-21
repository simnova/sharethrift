import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { ListingRequestVisa } from './request.visa.ts';
import {
	ListingRequestState,
} from './request.value-objects.ts';

export interface ListingRequestProps extends DomainSeedwork.DomainEntityProps {
	readonly listingId: string;
	readonly requestedBy: string; // User ID who made the request
	readonly listingOwner: string; // User ID who owns the listing
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	state: ListingRequestState;
	message?: string; // Optional message from requester
	readonly createdAt: Date;
	updatedAt: Date;
	readonly schemaVersion: number;
}

export interface ListingRequestEntityReference extends Readonly<ListingRequestProps> {}

export class ListingRequest<props extends ListingRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport> {
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: ListingRequestVisa;
	//#endregion Fields

	//#region Constructor
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.listingRequest.forListingRequest(this);
	}
	//#endregion Constructor

	//#region Methods
	public static getNewInstance<props extends ListingRequestProps>(
		newProps: {
			listingId: string;
			requestedBy: string;
			listingOwner: string;
			reservationPeriodStart: Date;
			reservationPeriodEnd: Date;
			message?: string;
		},
		passport: Passport,
	): ListingRequest<props> {
		const id = crypto.randomUUID();
		const now = new Date();

		const listingRequestProps = {
			id,
			listingId: newProps.listingId,
			requestedBy: newProps.requestedBy,
			listingOwner: newProps.listingOwner,
			reservationPeriodStart: newProps.reservationPeriodStart,
			reservationPeriodEnd: newProps.reservationPeriodEnd,
			state: ListingRequestState.Pending,
			message: newProps.message,
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
		} as unknown as props;

		const aggregate = new ListingRequest(listingRequestProps, passport);
		aggregate.markAsNew();
		return aggregate;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	//#endregion Methods

	//#region Properties
	get listingId(): string {
		return this.props.listingId;
	}

	get requestedBy(): string {
		return this.props.requestedBy;
	}

	get listingOwner(): string {
		return this.props.listingOwner;
	}

	get reservationPeriodStart(): Date {
		return this.props.reservationPeriodStart;
	}
	set reservationPeriodStart(value: Date) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this reservation period'
			);
		}
		this.props.reservationPeriodStart = value;
		this.props.updatedAt = new Date();
	}

	get reservationPeriodEnd(): Date {
		return this.props.reservationPeriodEnd;
	}
	set reservationPeriodEnd(value: Date) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this reservation period'
			);
		}
		this.props.reservationPeriodEnd = value;
		this.props.updatedAt = new Date();
	}

	get state(): ListingRequestState {
		return this.props.state;
	}

	get message(): string | undefined {
		return this.props.message;
	}
	set message(value: string | undefined) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this message'
			);
		}
		if (value !== undefined) {
			this.props.message = value;
		} else {
			delete this.props.message;
		}
		this.props.updatedAt = new Date();
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get schemaVersion(): number {
		return this.props.schemaVersion;
	}
	//#endregion Properties

	/**
	 * Gets a formatted date range string for display
	 */
	get dateRange(): string {
		const startDate = this.reservationPeriodStart.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		const endDate = this.reservationPeriodEnd.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		return `${startDate} → ${endDate}`;
	}

	/**
	 * Determines if the current user can manage this request
	 */
	canManage(userId: string): boolean {
		return this.props.listingOwner === userId;
	}

	/**
	 * Determines if the current user can cancel this request
	 */
	canCancel(userId: string): boolean {
		return this.props.requestedBy === userId && this.state.isPending;
	}

	public accept(): void {
		if (!this.visa.determineIf((permissions) => permissions.canManageListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to accept this request'
			);
		}

		if (!this.state.isPending) {
			throw new DomainSeedwork.PermissionError(
				'Only pending requests can be accepted'
			);
		}

		this.props.state = ListingRequestState.Accepted;
		this.props.updatedAt = new Date();
	}

	public reject(): void {
		if (!this.visa.determineIf((permissions) => permissions.canManageListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reject this request'
			);
		}

		if (!this.state.isPending) {
			throw new DomainSeedwork.PermissionError(
				'Only pending requests can be rejected'
			);
		}

		this.props.state = ListingRequestState.Rejected;
		this.props.updatedAt = new Date();
	}

	public cancel(): void {
		if (!this.visa.determineIf((permissions) => permissions.canCancelListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this request'
			);
		}

		if (!this.state.isPending) {
			throw new DomainSeedwork.PermissionError(
				'Only pending requests can be cancelled'
			);
		}

		this.props.state = ListingRequestState.Cancelled;
		this.props.updatedAt = new Date();
	}

	public close(): void {
		if (!this.visa.determineIf((permissions) => permissions.canManageListingRequest)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to close this request'
			);
		}

		if (!this.state.isAccepted) {
			throw new DomainSeedwork.PermissionError(
				'Only accepted requests can be closed'
			);
		}

		this.props.state = ListingRequestState.Closed;
		this.props.updatedAt = new Date();
	}

	/**
	 * Create a reference to this entity for use in other contexts
	 */
	getEntityReference(): ListingRequestEntityReference {
		return {
			...this.props,
			message: this.props.message,
		} as ListingRequestEntityReference;
	}
}