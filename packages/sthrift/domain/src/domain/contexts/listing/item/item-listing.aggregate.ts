import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ListingVisa } from '../listing.visa.ts';
import * as ValueObjects from './item-listing.value-objects.ts';
import type { UserEntityReference } from '../../user/index.ts';
import type {
	ItemListingEntityReference,
	ItemListingProps,
} from './item-listing.entity.ts';
import { AdminUser } from '../../user/admin-user/admin-user.aggregate.ts';
import type { AdminUserProps } from '../../user/admin-user/admin-user.entity.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.aggregate.ts';
import type { PersonalUserProps } from '../../user/personal-user/personal-user.entity.ts';

export class ItemListing<props extends ItemListingProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ItemListingEntityReference
{
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: ListingVisa;
	//#endregion Fields

	//#region Constructor
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.listing.forItemListing(this);
	}
	//#endregion Constructor

	//#region Methods
	public static getNewInstance<props extends ItemListingProps>(
		newProps: props,
		passport: Passport,
		sharer: UserEntityReference,
		title: string,
		description: string,
		category: string,
		location: string,
		sharingPeriodStart: Date,
		sharingPeriodEnd: Date,
		images?: string[],
		isDraft?: boolean,
		expiresAt?: Date,
	): ItemListing<props> {
		const newInstance = new ItemListing(newProps, passport);
		newInstance.markAsNew();
		newInstance.sharer = sharer;
		newInstance.props.title = new ValueObjects.Title(title).valueOf();
		newInstance.props.description = new ValueObjects.Description(description).valueOf();
		newInstance.props.category = new ValueObjects.Category(category).valueOf();
		newInstance.props.location = new ValueObjects.Location(location).valueOf();
		newInstance.sharingPeriodStart = sharingPeriodStart;
		newInstance.sharingPeriodEnd = sharingPeriodEnd;
		if (images !== undefined) {
			newInstance.images = images;
		}
		newInstance.state = isDraft ? 'Draft' : 'Active';
		if (expiresAt !== undefined) {
			newInstance.expiresAt = expiresAt;
		}
		newInstance.isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	async loadSharer(): Promise<UserEntityReference> {
		return await this.props.loadSharer();
	}

	public publish(): void {
		if (
			!this.visa.determineIf((permissions) => permissions.canPublishItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to publish this listing',
			);
		}

		this.props.state = new ValueObjects.ListingState('Active').valueOf();
		// Note: updatedAt is automatically handled by Mongoose timestamps
	}

	public pause(): void {
		if (
			!this.visa.determineIf(
				(permissions) => permissions.canUnpublishItemListing,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to pause this listing',
			);
		}

		this.props.state = new ValueObjects.ListingState('Paused').valueOf();
		// Note: updatedAt is automatically handled by Mongoose timestamps
	}

	public cancel(): void {
		if (
			!this.visa.determineIf((permissions) => permissions.canDeleteItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this listing',
			);
		}

		this.props.state = new ValueObjects.ListingState('Cancelled').valueOf();
	}

	public reinstate(): void {
		if (
			!this.visa.determineIf((permissions) => permissions.canPublishItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reinstate this listing',
			);
		}

		this.props.state = new ValueObjects.ListingState('Active').valueOf();
		// Note: updatedAt is automatically handled by Mongoose timestamps
	}

	/**
	 * Set whether this listing is blocked.
	 * - When setting blocked=false and the listing is currently Blocked, this will move the
	 *   listing to AppealRequested (the previous `unblock()` behaviour).
	 * - When setting blocked=true it will mark the listing as Blocked.
	 * This is intentionally a setter-style API so callers can use a single update mutation
	 * to toggle the blocked state.
	 */
	public setBlocked(blocked: boolean): void {
		const current = this.props.state.valueOf();

		if (!blocked) {
			// unblocking: require publish permission (keeps previous behaviour)
			if (
				!this.visa.determineIf(
					(permissions) => permissions.canPublishItemListing,
				)
			) {
				throw new DomainSeedwork.PermissionError(
					'You do not have permission to unblock this listing',
				);
			}

			const isBlocked = current === ValueObjects.ListingStateEnum.Blocked;
			if (!isBlocked) return; // no-op if not blocked

			this.props.state = ValueObjects.ListingStateEnum.Active;
			return;
		}

		// setting blocked=true
		if (
			!this.visa.determineIf((permissions) => permissions.canPublishItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to block this listing',
			);
		}

		if (current === ValueObjects.ListingStateEnum.Blocked) return; // already blocked
		this.props.state = ValueObjects.ListingStateEnum.Blocked;
	}

/**
 * Request deletion of this item listing (marks as deleted).
 */
public requestDelete(): void {
	if (
		!this.visa.determineIf(
			(permissions) => permissions.canDeleteItemListing,
		)
	) {
		throw new DomainSeedwork.PermissionError(
			'You do not have permission to delete this listing',
		);
	}

		if (!this.isDeleted) {
			super.isDeleted = true;
		}
	}

	/**
	 * Create a reference to this entity for use in other contexts
	 */
	getEntityReference(): ItemListingEntityReference {
		return this.props as ItemListingEntityReference;
	}

	//#endregion Methods

	//#region Properties
	get sharer(): UserEntityReference {
		// Polymorphic instantiation based on userType
		if (this.props.sharer.userType === 'admin-user') {
			return new AdminUser(
				this.props.sharer as unknown as AdminUserProps,
				this.passport,
			);
		}
		return new PersonalUser(
			this.props.sharer as unknown as PersonalUserProps,
			this.passport,
		);
	}

	set sharer(value: UserEntityReference) {
		this.props.sharer = value;
	}

	get title(): string {
		return this.props.title;
	}
	set title(value: string) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this title',
			);
		}
		this.props.title = new ValueObjects.Title(value).valueOf();
	}

	get description(): string {
		return this.props.description;
	}
	set description(value: string) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this description',
			);
		}
		this.props.description = new ValueObjects.Description(value).valueOf();
	}

	get category(): string {
		return this.props.category;
	}
	set category(value: string) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this category',
			);
		}
		this.props.category = new ValueObjects.Category(value).valueOf();
	}

	get location(): string {
		return this.props.location;
	}
	set location(value: string) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this location',
			);
		}
		this.props.location = new ValueObjects.Location(value).valueOf();
	}

	get sharingPeriodStart(): Date {
		return this.props.sharingPeriodStart;
	}
	set sharingPeriodStart(value: Date) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this sharing period',
			);
		}
		this.props.sharingPeriodStart = value;
	}

	get sharingPeriodEnd(): Date {
		return this.props.sharingPeriodEnd;
	}
	set sharingPeriodEnd(value: Date) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this sharing period',
			);
		}
		this.props.sharingPeriodEnd = value;
	}

	get state(): string {
		return this.props.state;
	}

	// Note: State is read-only after creation; the state setter only works during creation.
	// Use domain methods (publish(), pause(), cancel(), reinstate()) to change state so that
	// permission checks and state transition validations are always enforced.
	set state(value: string) {
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				'Cannot set state directly. Use domain methods (publish(), pause(), cancel(), reinstate()) to change state.',
			);
		}
		this.props.state = new ValueObjects.ListingState(value).valueOf();
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get schemaVersion(): string {
		return this.props.schemaVersion;
	}

	get sharingHistory(): string[] {
		return this.props.sharingHistory ? [...this.props.sharingHistory] : [];
	}

	get reports(): number {
		return this.props.reports ?? 0;
	}

	get images(): string[] {
		return this.props.images ? [...this.props.images] : [];
	}
	set images(value: string[]) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this images',
			);
		}
		this.props.images = value;
	}

	get isActive(): boolean {
		return (
			this.props.state.valueOf() === ValueObjects.ListingStateEnum.Active
		);
	}

	/**
	 * Determines if the current user can edit this listing
	 */
	// canEdit(userId: string): boolean {
	// 	return this.props.sharer === userId;
	// }

	get displayLocation(): string {
		return this.location;
	}

	get expiresAt(): Date | undefined {
		return this.props.expiresAt;
	}

	set expiresAt(value: Date | undefined) {
		if (
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this expiration',
			);
		}
		this.props.expiresAt = value;
	}

	get listingType(): string {
		return this.props.listingType;
	}
	set listingType(value: string) {
		this.props.listingType = value;
	}
}
