import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
export class ConversationConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.Conversation.Conversation,
	ConversationDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter>
> {
	constructor() {
		super(
			ConversationDomainAdapter,
			Domain.Contexts.Conversation.Conversation.Conversation,
		);
	}
}

export class ConversationDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.Conversation.Conversation>
	implements Domain.Contexts.Conversation.Conversation.ConversationProps
{
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

	async loadSharer(): Promise<PersonalUserDomainAdapter> {
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

	set sharer(user: PersonalUserDomainAdapter) {
		this.doc.set('sharer', user.doc);
	}

	get reserver(): PersonalUserDomainAdapter {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			throw new Error(
				'reserver is not populated or is not of the correct type',
			);
		}
		return new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
	}

	async loadReserver(): Promise<PersonalUserDomainAdapter> {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('reserver');
		}
		return new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
	}

	set reserver(user: PersonalUserDomainAdapter) {
		this.doc.set('reserver', user.doc);
	}

	get listing(): ItemListingDomainAdapter {
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

	async loadListing(): Promise<ItemListingDomainAdapter> {
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

	set listing(listing: ItemListingDomainAdapter) {
		this.doc.set('listing', listing.doc);
	}

	get twilioConversationId(): string {
		return this.doc.twilioConversationId;
	}
	set twilioConversationId(value: string) {
		this.doc.twilioConversationId = value;
	}
}
