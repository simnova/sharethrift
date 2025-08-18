import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { ItemListingVisa } from './item.visa.ts';
import {
	Category,
	Description,
	ListingState,
	ListingStateEnum,
	Location,
	Title,
} from './item.value-objects.ts';

export interface ItemListingProps extends DomainSeedwork.DomainEntityProps {
	sharer: string; // User ID who created the listing
	title: Title;
	description: Description;
	category: Category;
	location: Location;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: ListingState;
	readonly createdAt: Date;
	updatedAt: Date;
	readonly schemaVersion: number;
	sharingHistory?: string[]; // Array of reservation/sharing IDs
	reports?: number;
	images?: string[]; // Array of image URLs
}

export interface ItemListingEntityReference extends Readonly<Omit<ItemListingProps, 'sharingHistory' | 'images'>> {
	readonly sharingHistory?: readonly string[];
	readonly images?: readonly string[];
}

export class ItemListing<props extends ItemListingProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ItemListingEntityReference {
	//#region Fields
	private isNew: boolean = false;
	private readonly visa: ItemListingVisa;
	//#endregion Fields

	//#region Constructor
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.itemListing.forItemListing(this);
	}
	//#endregion Constructor

	//#region Methods
	public static getNewInstance<props extends ItemListingProps>(
		newProps: {
			sharer: string;
			title: string;
			description: string;
			category: string;
			location: string;
			sharingPeriodStart: Date;
			sharingPeriodEnd: Date;
			images?: string[];
		},
		passport: Passport,
	): ItemListing<props> {
		const id = crypto.randomUUID();
		const now = new Date();

		const itemListingProps = {
			...newProps,
			id,
			title: new Title(newProps.title),
			description: new Description(newProps.description),
			category: new Category(newProps.category),
			location: new Location(newProps.location),
			state: ListingState.Published,
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
			reports: 0,
			sharingHistory: [],
		} as unknown as props;

		const aggregate = new ItemListing(itemListingProps, passport);
		aggregate.markAsNew();
		return aggregate;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	/** @deprecated Use getNewInstance instead */
	public static create<PassportType>(
		props: {
			sharer: string;
			title: string;
			description: string;
			category: string;
			location: string;
			sharingPeriodStart: Date;
			sharingPeriodEnd: Date;
		},
		passport: PassportType,
	): ItemListing<ItemListingProps> {
		return ItemListing.getNewInstance(props, passport as Passport);
	}
	//#endregion Methods

	//#region Properties
	get sharer(): string {
		return this.props.sharer;
	}
	set sharer(value: string) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this sharer'
			);
		}
		this.props.sharer = value;
	}

	get title(): Title {
		return this.props.title;
	}
	set title(value: Title) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this title'
			);
		}
		this.props.title = value;
		this.props.updatedAt = new Date();
	}

	get description(): Description {
		return this.props.description;
	}
	set description(value: Description) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this description'
			);
		}
		this.props.description = value;
		this.props.updatedAt = new Date();
	}

	get category(): Category {
		return this.props.category;
	}
	set category(value: Category) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this category'
			);
		}
		this.props.category = value;
		this.props.updatedAt = new Date();
	}

	get location(): Location {
		return this.props.location;
	}
	set location(value: Location) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this location'
			);
		}
		this.props.location = value;
		this.props.updatedAt = new Date();
	}

	get sharingPeriodStart(): Date {
		return this.props.sharingPeriodStart;
	}
	set sharingPeriodStart(value: Date) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this sharing period'
			);
		}
		this.props.sharingPeriodStart = value;
		this.props.updatedAt = new Date();
	}

	get sharingPeriodEnd(): Date {
		return this.props.sharingPeriodEnd;
	}
	set sharingPeriodEnd(value: Date) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this sharing period'
			);
		}
		this.props.sharingPeriodEnd = value;
		this.props.updatedAt = new Date();
	}

	get state(): ListingState {
		return this.props.state;
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

	get sharingHistory(): readonly string[] {
		return this.props.sharingHistory ?? [];
	}

	get reports(): number {
		return this.props.reports ?? 0;
	}

	get images(): readonly string[] {
		return this.props.images ?? [];
	}
	set images(value: string[]) {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canUpdateItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this images'
			);
		}
		this.props.images = value;
		this.props.updatedAt = new Date();
	}
	//#endregion Properties

	/**
	 * Determines if this listing is visible to regular users
	 */
	get isActive(): boolean {
		return this.props.state.valueOf() === ListingStateEnum.Published;
	}

	/**
	 * Determines if the current user can edit this listing
	 */
	canEdit(userId: string): boolean {
		return this.props.sharer === userId;
	}

	/**
	 * Gets a formatted date range string for display
	 */
	get dateRange(): string {
		const startDate = this.sharingPeriodStart.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		const endDate = this.sharingPeriodEnd.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		return `${startDate} → ${endDate}`;
	}

	/**
	 * Gets the location in a display-friendly format
	 */
	get displayLocation(): string {
		return this.location.cityState;
	}

	public publish(): void {
		if (!this.visa.determineIf((permissions) => permissions.canPublishItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to publish this listing'
			);
		}

		this.props.state = ListingState.Published;
		this.props.updatedAt = new Date();
	}

	public pause(): void {
		if (!this.visa.determineIf((permissions) => permissions.canUnpublishItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to pause this listing'
			);
		}

		this.props.state = ListingState.Paused;
		this.props.updatedAt = new Date();
	}

	public cancel(): void {
		if (!this.visa.determineIf((permissions) => permissions.canDeleteItemListing)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this listing'
			);
		}

		this.props.state = ListingState.Cancelled;
		this.props.updatedAt = new Date();
	}

	/**
	 * Create a reference to this entity for use in other contexts
	 */
	getEntityReference(): ItemListingEntityReference {
		return this.props as ItemListingEntityReference;
	}
}