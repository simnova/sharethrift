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
	get sharer(): Readonly<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			throw new Error('sharer is not populated or is not of the correct type');
		}
		// Assuming the domain adapter exposes an entityReference property or method
		const adapter = new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	async loadSharer(): Promise<
		Readonly<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>
	> {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('sharer');
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	set sharer(user: PersonalUserDomainAdapter) {
		this.doc.set('sharer', user.doc);
	}

	get reserver(): Readonly<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			throw new Error(
				'reserver is not populated or is not of the correct type',
			);
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	async loadReserver(): Promise<
		Readonly<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>
	> {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('reserver');
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
		return adapter.entityReference;
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

	get messages(): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection
		return [];
	}

	loadMessages(): Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference[]> {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection or populate from subdocuments
		return Promise.resolve([]);
	}
}
