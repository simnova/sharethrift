import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';

export class ListingAppealRequestConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.AppealRequest.ListingAppealRequest,
	ListingAppealRequestDomainAdapter,
	Domain.Passport,
	Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest<ListingAppealRequestDomainAdapter>
> {
	constructor() {
		super(
			ListingAppealRequestDomainAdapter,
			Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequest<ListingAppealRequestDomainAdapter>,
		);
	}
}

export class ListingAppealRequestDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.AppealRequest.ListingAppealRequest>
	implements
		Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestProps
{
	get user(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		if (!this.doc.user) {
			throw new Error('user is not populated');
		}
		if (this.doc.user instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.user.toString(),
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
		}
		return new PersonalUserDomainAdapter(this.doc.user as Models.User.PersonalUser);
	}

	async loadUser(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.user) {
			throw new Error('user is not populated');
		}
		if (this.doc.user instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('user');
		}
		return new PersonalUserDomainAdapter(
			this.doc.user as Models.User.PersonalUser,
		);
	}

	set user(
		user:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		if (!user?.id) {
			throw new Error('user reference is missing id');
		}
		this.doc.set('user', new MongooseSeedwork.ObjectId(user.id));
	}

	get listing(): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference {
		if (!this.doc.listing) {
			throw new Error('listing is not populated');
		}
		if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.listing.toString(),
			} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
		}
		return new ItemListingDomainAdapter(this.doc.listing as Models.Listing.ItemListing);
	}

	async loadListing(): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {
		if (!this.doc.listing) {
			throw new Error('listing is not populated');
		}
		if (this.doc.listing instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('listing');
		}
		return new ItemListingDomainAdapter(
			this.doc.listing as Models.Listing.ItemListing,
		);
	}

	set listing(
		listing:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>,
	) {
		if (!listing?.id) {
			throw new Error('listing reference is missing id');
		}
		this.doc.set('listing', new MongooseSeedwork.ObjectId(listing.id));
	}

	get blocker(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		if (!this.doc.blocker) {
			throw new Error('blocker is not populated');
		}
		if (this.doc.blocker instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.blocker.toString(),
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
		}
		return new PersonalUserDomainAdapter(this.doc.blocker as Models.User.PersonalUser);
	}

	async loadBlocker(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.blocker) {
			throw new Error('blocker is not populated');
		}
		if (this.doc.blocker instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('blocker');
		}
		return new PersonalUserDomainAdapter(
			this.doc.blocker as Models.User.PersonalUser,
		);
	}

	set blocker(
		blocker:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		if (!blocker?.id) {
			throw new Error('blocker reference is missing id');
		}
		this.doc.set('blocker', new MongooseSeedwork.ObjectId(blocker.id));
	}

	get reason(): string {
		return this.doc.reason;
	}

	set reason(value: string) {
		this.doc.reason = value;
	}

	get state(): string {
		return this.doc.state;
	}

	set state(value: string) {
		this.doc.state = value as 'requested' | 'denied' | 'accepted';
	}

	get type(): string {
		return this.doc.type;
	}
}
