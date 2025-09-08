import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ListingVisa } from '../listing.visa.ts';
import * as ValueObjects from './item-listing.value-objects.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.ts';

export interface ItemListingProps extends DomainSeedwork.DomainEntityProps {
	sharer: PersonalUserEntityReference;
	title: ValueObjects.Title;
	description: ValueObjects.Description;
	category: ValueObjects.Category;
	location: ValueObjects.Location;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: ValueObjects.ListingState;
	readonly createdAt: Date;
	updatedAt: Date;
	readonly schemaVersion: string;
	sharingHistory?: string[]; // Array of reservation/sharing IDs
	reports?: number;
	images?: string[]; // Array of image URLs
}

export interface ItemListingEntityReference
	extends Readonly<Omit<ItemListingProps, 'sharingHistory' | 'images'>> {
	sharingHistory?: string[];
	images?: string[];
}

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
		sharer: PersonalUserEntityReference,
		passport: Passport,
	): ItemListing<props> {
		const id = crypto.randomUUID();
		const now = new Date();

		const itemListingProps = {
			id,
			sharer: sharer,
			title: newProps.title,
			description: newProps.description,
			category: newProps.category,
			location: newProps.location,
			sharingPeriodStart: newProps.sharingPeriodStart,
			sharingPeriodEnd: newProps.sharingPeriodEnd,
			images: newProps.images ?? [],
			state: ValueObjects.ListingState.Published,
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

	//#endregion Methods

	//#region Properties
	get sharer(): PersonalUserEntityReference {
		return this.props.sharer;
	}
	set sharer(value: PersonalUserEntityReference) {
		this.props.sharer = value;
	}

	get title(): ValueObjects.Title {
		return this.props.title;
	}
	set title(value: ValueObjects.Title) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this title',
			);
		}
		this.props.title = value;
		this.props.updatedAt = new Date();
	}

	get description(): ValueObjects.Description {
		return this.props.description;
	}
	set description(value: ValueObjects.Description) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this description',
			);
		}
		this.props.description = value;
		this.props.updatedAt = new Date();
	}

	get category(): ValueObjects.Category {
		return this.props.category;
	}
	set category(value: ValueObjects.Category) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this category',
			);
		}
		this.props.category = value;
		this.props.updatedAt = new Date();
	}

	get location(): ValueObjects.Location {
		return this.props.location;
	}
	set location(value: ValueObjects.Location) {
		if (
			!this.isNew &&
			!this.visa.determineIf((permissions) => permissions.canUpdateItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update this location',
			);
		}
		this.props.location = value;
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

	get state(): ValueObjects.ListingState {
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

	get displayLocation(): string {
		return this.location.cityState;
	}

	public publish(): void {
		if (
			!this.visa.determineIf((permissions) => permissions.canPublishItemListing)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to publish this listing',
			);
		}

		this.props.state = ValueObjects.ListingState.Published;
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

		this.props.state = ValueObjects.ListingState.Paused;
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

		this.props.state = ValueObjects.ListingState.Cancelled;
		this.props.updatedAt = new Date();
	}

	/**
	 * Create a reference to this entity for use in other contexts
	 */
	getEntityReference(): ItemListingEntityReference {
		return this.props as ItemListingEntityReference;
	}
}
