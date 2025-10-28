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
			throw new Error('user is not populated or is not of the correct type');
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
		if (
			user instanceof Domain.Contexts.User.PersonalUser.PersonalUser
		) {
			this.doc.set('user', user.props.doc);
			return;
		}
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
			throw new Error('listing is not populated or is not of the correct type');
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
		if (
			listing instanceof Domain.Contexts.Listing.ItemListing.ItemListing
		) {
			this.doc.set('listing', listing.props.doc);
			return;
		}
		if (!listing?.id) {
			throw new Error('listing reference is missing id');
		}
		this.doc.set('listing', new MongooseSeedwork.ObjectId(listing.id));
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

	get blocker(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		if (!this.doc.blocker) {
			throw new Error('blocker is not populated');
		}
		if (this.doc.blocker instanceof MongooseSeedwork.ObjectId) {
			throw new Error('blocker is not populated or is not of the correct type');
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
		if (
			blocker instanceof Domain.Contexts.User.PersonalUser.PersonalUser
		) {
			this.doc.set('blocker', blocker.props.doc);
			return;
		}
		if (!blocker?.id) {
			throw new Error('blocker reference is missing id');
		}
		this.doc.set('blocker', new MongooseSeedwork.ObjectId(blocker.id));
	}
}
