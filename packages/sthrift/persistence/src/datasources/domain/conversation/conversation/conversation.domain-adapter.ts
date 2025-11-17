import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';
import type { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import {
	getReserver,
	loadReserver,
	setReserver,
	getSharer,
	loadSharer,
	setSharer,
} from '../../domain-adapter-helpers.ts';
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
	get sharer(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return getSharer(this.doc.sharer);
	}

	async loadSharer(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		return await loadSharer(this.doc);
	}

	set sharer(user: PersonalUserDomainAdapter) {
		setSharer(this.doc, user);
	}

	get reserver(): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
		return getReserver(this.doc.reserver);
	}

	async loadReserver(): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		return await loadReserver(this.doc);
	}

	set reserver(user: PersonalUserDomainAdapter) {
		setReserver(this.doc, user);
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

	set listing(listing: ItemListingDomainAdapter) {
		this.doc.set('listing', listing.doc);
	}

	get messagingConversationId(): string {
		return this.doc.messagingConversationId;
	}
	set messagingConversationId(value: string) {
		this.doc.messagingConversationId = value;
	}

	get messages(): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection
		return [];
	}

	loadMessages(): Promise<
		Domain.Contexts.Conversation.Conversation.MessageEntityReference[]
	> {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection or populate from subdocuments
		return Promise.resolve([]);
	}
}
