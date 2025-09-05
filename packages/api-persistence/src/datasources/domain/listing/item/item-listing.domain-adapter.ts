import { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';

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
	get title(): Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Title {
		return new Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Title(
			this.doc.title,
		);
	}
	set title(value: Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Title) {
		this.doc.title = value.valueOf();
	}

	get description(): Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Description {
		return new Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Description(
			this.doc.description,
		);
	}
	set description(value: Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Description) {
		this.doc.description = value.valueOf();
	}

	get category(): Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Category {
		return new Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Category(
			this.doc.category,
		);
	}
	set category(value: Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Category) {
		this.doc.category = value.valueOf();
	}

	get location(): Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Location {
		return new Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Location(
			this.doc.location,
		);
	}
	set location(value: Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.Location) {
		this.doc.location = value.valueOf();
	}

	get state(): Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingState {
		return new Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingState(
			this.doc.state || 'Published',
		);
	}
	set state(value: Domain.Contexts.Listing.ItemListing.ItemListingValueObjects.ListingState) {
		this.doc.state = value.valueOf() as NonNullable<
			Models.Listing.ItemListing['state']
		>;
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

	get sharer(): PersonalUserDomainAdapter {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			throw new Error('sharer is not populated or is not of the correct type');
		}
		return new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
	}
	set sharer(user: PersonalUserDomainAdapter) {
		this.doc.set('sharer', user.doc);
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
		return []; // Images not stored in the current model
	}
	set images(_value: string[]) {
		// Images not supported in the current model
	}
}
