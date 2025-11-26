import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import { getUser, loadUser, setUser } from '../user-appeal-request-helpers.ts';


// Helper functions for user getter/setter/loadUser
// Removed helper functions for user getter/setter/loadUser
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
		return getUser(this.doc);
	}

		async loadUser(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
			return await loadUser(this.doc);
		}

	set user(
		user:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		setUser(this.doc, user);
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
		const adapter = new PersonalUserDomainAdapter(
			this.doc.blocker as Models.User.PersonalUser,
		);
		return adapter.entityReference as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	}

	async loadBlocker(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.blocker) {
			throw new Error('blocker is not populated');
		}
		if (this.doc.blocker instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('blocker');
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.blocker as Models.User.PersonalUser,
		);
		return adapter.entityReference as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
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
