import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ListingVisa } from '../listing.visa.ts';
import * as ValueObjects from './item-listing.value-objects.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type {
	ItemListingEntityReference,
	ItemListingProps,
} from './item-listing.entity.ts';
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
		sharer: PersonalUserEntityReference,
		fields: {
			title: string;
			description: string;
			category: string;
			location: string;
			sharingPeriodStart: Date;
			sharingPeriodEnd: Date;
			images?: string[];
			isDraft?: boolean;
		},
		passport: Passport,
	): ItemListing<props> {
		const id = crypto.randomUUID();
		const now = new Date();
		const isDraft = fields.isDraft ?? false;

		// For drafts, use placeholder values if fields are empty
		const title =
			isDraft && (!fields.title || fields.title.trim() === '')
				? 'Draft Title'
				: fields.title;
		const description =
			isDraft && (!fields.description || fields.description.trim() === '')
				? 'Draft Description'
				: fields.description;
		const category =
			isDraft && (!fields.category || fields.category.trim() === '')
				? 'Miscellaneous'
				: fields.category;
		const location =
			isDraft && (!fields.location || fields.location.trim() === '')
				? 'Draft Location'
				: fields.location;

		// For drafts, use default dates if not provided or invalid
		const defaultStartDate = new Date();
		defaultStartDate.setDate(defaultStartDate.getDate() + 1); // Tomorrow
		const defaultEndDate = new Date();
		defaultEndDate.setDate(defaultEndDate.getDate() + 30); // 30 days from now

		const sharingPeriodStart =
			isDraft &&
			(!fields.sharingPeriodStart ||
				Number.isNaN(fields.sharingPeriodStart.getTime()))
				? defaultStartDate
				: fields.sharingPeriodStart;
		const sharingPeriodEnd =
			isDraft &&
			(!fields.sharingPeriodEnd ||
				Number.isNaN(fields.sharingPeriodEnd.getTime()))
				? defaultEndDate
				: fields.sharingPeriodEnd;

		const itemListingProps = {
			id,
			sharer: sharer,
			title: title,
			description: new ValueObjects.Description(description),
			category: new ValueObjects.Category(category),
			location: new ValueObjects.Location(location),
			sharingPeriodStart: sharingPeriodStart,
			sharingPeriodEnd: sharingPeriodEnd,
			images: fields.images ?? [],
			state: isDraft
				? ValueObjects.ListingState.Drafted
				: ValueObjects.ListingState.Published,
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
			reports: 0,
			sharingHistory: [],
			listingType: 'item-listing',
		} as unknown as props;

		const aggregate = new ItemListing(itemListingProps, passport);
		aggregate.markAsNew();
		return aggregate;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	//#endregion Methods

	//#region Properties
	get sharer(): PersonalUserEntityReference {
		return this.props.sharer;
	}

	set sharer(value: PersonalUserEntityReference) {
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
		this.props.updatedAt = new Date();
	}

	get description(): string {
		return this.props.description.valueOf();
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
		this.props.updatedAt = new Date();
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
		this.props.updatedAt = new Date();
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
		this.props.updatedAt = new Date();
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
		this.props.updatedAt = new Date();
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
		this.props.updatedAt = new Date();
	}

	get state(): string {
		return this.props.state;
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
		this.props.updatedAt = new Date();
	}

	get isActive(): boolean {
		return (
			this.props.state.valueOf() === ValueObjects.ListingStateEnum.Published
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

	public publish(): void {
		if (
			!this.visa.determineIf((permissions) => permissions.canPublishItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to publish this listing',
			);
		}

		this.props.state = new ValueObjects.ListingState('Published').valueOf();
		this.props.updatedAt = new Date();
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
		this.props.updatedAt = new Date();
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
		this.props.updatedAt = new Date();
	}

	get listingType(): string {
		return this.props.listingType;
	}

	/**
	 * Create a reference to this entity for use in other contexts
	 */
	getEntityReference(): ItemListingEntityReference {
		return this.props as ItemListingEntityReference;
	}
}
