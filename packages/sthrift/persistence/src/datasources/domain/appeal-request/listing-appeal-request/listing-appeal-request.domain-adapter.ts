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
		return this.ref('user', PersonalUserDomainAdapter);
	}

	set user(
		user:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		this.ref('user', PersonalUserDomainAdapter, user);
	}

	get listing(): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference {
		return this.ref('listing', ItemListingDomainAdapter);
	}

	set listing(
		listing:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>,
	) {
		this.ref('listing', ItemListingDomainAdapter, listing);
	}

	get blocker(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return this.ref('blocker', PersonalUserDomainAdapter);
	}

	set blocker(
		blocker:
			| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
			| Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>,
	) {
		this.ref('blocker', PersonalUserDomainAdapter, blocker);
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
