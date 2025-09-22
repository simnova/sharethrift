import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
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
		if (!this.doc.sharer) {
			throw new Error('listing is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			// Return a minimal entity reference when sharer is not populated
			return {
				id: this.doc.sharer.toString(),
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
		}
		return new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
	}
	async loadSharer(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('sharer');
		}
		return new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
	}
	set sharer(user: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) {
		if (!user?.id) {
			throw new Error('user reference is missing id');
		}
		this.doc.set('sharer', new MongooseSeedwork.ObjectId(user.id));
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
}
