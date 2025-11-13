import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import { AdminUserDomainAdapter } from '../../user/admin-user/admin-user.domain-adapter.ts';
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
	get sharer(): PersonalUserDomainAdapter | AdminUserDomainAdapter {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			throw new Error('sharer is not populated or is not of the correct type');
		}
		// Check userType discriminator to determine which adapter to use
		const sharerDoc = this.doc.sharer as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (sharerDoc.userType === 'admin') {
			return new AdminUserDomainAdapter(
				this.doc.sharer as Models.User.AdminUser,
			);
		}
		return new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
	}

	async loadSharer(): Promise<
		PersonalUserDomainAdapter | AdminUserDomainAdapter
	> {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('sharer');
		}
		// Check userType discriminator to determine which adapter to use
		const sharerDoc = this.doc.sharer as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (sharerDoc.userType === 'admin') {
			return new AdminUserDomainAdapter(
				this.doc.sharer as Models.User.AdminUser,
			);
		}
		return new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
	}

	set sharer(user: PersonalUserDomainAdapter | AdminUserDomainAdapter) {
		this.doc.set('sharer', user.doc);
	}

	get reserver(): PersonalUserDomainAdapter | AdminUserDomainAdapter {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			throw new Error(
				'reserver is not populated or is not of the correct type',
			);
		}
		// Check userType discriminator to determine which adapter to use
		const reserverDoc = this.doc.reserver as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (reserverDoc.userType === 'admin') {
			return new AdminUserDomainAdapter(
				this.doc.reserver as Models.User.AdminUser,
			);
		}
		return new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
	}

	async loadReserver(): Promise<
		PersonalUserDomainAdapter | AdminUserDomainAdapter
	> {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('reserver');
		}
		// Check userType discriminator to determine which adapter to use
		const reserverDoc = this.doc.reserver as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (reserverDoc.userType === 'admin') {
			return new AdminUserDomainAdapter(
				this.doc.reserver as Models.User.AdminUser,
			);
		}
		return new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
	}

	set reserver(user: PersonalUserDomainAdapter | AdminUserDomainAdapter) {
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
