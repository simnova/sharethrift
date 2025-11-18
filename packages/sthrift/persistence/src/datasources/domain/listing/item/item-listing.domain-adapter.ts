import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	getSharer,
	loadSharer,
	setSharer,
} from '../../domain-adapter-helpers.ts';

export class ItemListingConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.Listing.ItemListing,
	ItemListingDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>
> {
	constructor() {
		super(
			ItemListingDomainAdapter,
			Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>,
		);
	}
}

export class ItemListingDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.Listing.ItemListing>
	implements Domain.Contexts.Listing.ItemListing.ItemListingProps
{
	// Primitive Fields Getters and Setters
	get title(): string {
		return this.doc.title;
	}
	set title(value: string) {
		this.doc.title = value;
	}

	get description(): string {
		return this.doc.description;
	}
	set description(value: string) {
		this.doc.description = value;
	}

	get category(): string {
		return this.doc.category;
	}
	set category(value: string) {
		this.doc.category = value;
	}

	get location(): string {
		return this.doc.location;
	}
	set location(value: string) {
		this.doc.location = value;
	}

	get state(): string {
		return this.doc.state || 'Published';
	}
	set state(value: string) {
		this.doc.state = value as NonNullable<Models.Listing.ItemListing['state']>;
	}

	get sharingPeriodStart(): Date {
		return this.doc.sharingPeriodStart;
	}
	set sharingPeriodStart(value: Date) {
		this.doc.sharingPeriodStart = value;
	}

	get sharingPeriodEnd(): Date {
		return this.doc.sharingPeriodEnd;
	}
	set sharingPeriodEnd(value: Date) {
		this.doc.sharingPeriodEnd = value;
	}

	get sharer(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return getSharer(this.doc.sharer);
	}
	async loadSharer(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		return await loadSharer(this.doc);
	}
	set sharer(user: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) {
		setSharer(this.doc, user);
	}

	get sharingHistory(): string[] {
		return (this.doc.sharingHistory || []).map((id) => String(id));
	}
	set sharingHistory(value: string[]) {
		// Simple conversion - in production this would handle ObjectId conversion properly
		this.doc.sharingHistory =
			(value as unknown as Models.Listing.ItemListing['sharingHistory']) || [];
	}

	get reports(): number {
		return this.doc.reports || 0;
	}
	set reports(value: number) {
		this.doc.reports = value;
	}

	get images(): string[] {
		return this.doc.images || [];
	}
	set images(value: string[]) {
		this.doc.images = value;
	}

	get listingType(): string {
		return this.doc.listingType;
	}
	set listingType(value: string) {
		this.doc.listingType = value;
	}
}
