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

	set sharer(user: PersonalUserDomainAdapter | Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) {
		if (user instanceof Domain.Contexts.User.PersonalUser.PersonalUser) {
			this.doc.set('sharer', user.props.doc);
			return;
		}

		if (!user?.id) {
			throw new Error('sharer reference is missing id');
		}
		this.doc.set('sharer', new MongooseSeedwork.ObjectId(user.id));
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

	set reserver(user: PersonalUserDomainAdapter | Domain.Contexts.User.PersonalUser.PersonalUserEntityReference) {
		if (user instanceof Domain.Contexts.User.PersonalUser.PersonalUser) {
			this.doc.set('reserver', user.props.doc);
			return;
		}

		if (!user?.id) {
			throw new Error('reserver reference is missing id');
		}
		this.doc.set('reserver', new MongooseSeedwork.ObjectId(user.id));
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

	set listing(listing: ItemListingDomainAdapter | Domain.Contexts.Listing.ItemListing.ItemListingEntityReference) {
		if (listing instanceof Domain.Contexts.Listing.ItemListing.ItemListing) {
			this.doc.set('listing', listing.props.doc);
			return;
		}

		if (!listing?.id) {
			throw new Error('listing reference is missing id');
		}
		this.doc.set('listing', new MongooseSeedwork.ObjectId(listing.id));
	}

	get messagingConversationId(): string {
		return this.doc.messagingConversationId;
	}
	set messagingConversationId(value: string) {
		this.doc.messagingConversationId = value;
	}

	private _messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[] = [];

	get messages(): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection
		return this._messages;
	}

	set messages(value: Domain.Contexts.Conversation.Conversation.MessageEntityReference[]) {
		this._messages = value;
	}

	loadMessages(): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]> {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection or populate from subdocuments
		return Promise.resolve(this._messages);
	}
}
