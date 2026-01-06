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
	get sharer():
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference {
		if (!this.doc.sharer) {
			throw new Error('sharer is not populated');
		}
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			return {
				id: this.doc.sharer.toString(),
			} as Domain.Contexts.User.UserEntityReference;
		}
		// Check userType discriminator to determine which adapter to use
		const sharerDoc = this.doc.sharer as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (sharerDoc.userType === 'admin-user') {
			return new AdminUserDomainAdapter(
				this.doc.sharer as Models.User.AdminUser,
			);
		}
		// Assuming the domain adapter exposes an entityReference property or method
		const adapter = new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
		return adapter.entityReference; // need this to resolve issue with PropArray of account.billing.transactions
	}

	async loadSharer(): Promise<
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference
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
		if (sharerDoc.userType === 'admin-user') {
			return new AdminUserDomainAdapter(
				this.doc.sharer as Models.User.AdminUser,
			);
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.sharer as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	set sharer(user:
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference) {
		if (
			user instanceof Domain.Contexts.User.PersonalUser.PersonalUser ||
			user instanceof Domain.Contexts.User.AdminUser.AdminUser
		) {
			this.doc.set('sharer', user.props.doc);
			return;
		}

		if (!user?.id) {
			throw new Error('sharer reference is missing id');
		}
		this.doc.set('sharer', new MongooseSeedwork.ObjectId(user.id));
	}

	get reserver():
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference {
		if (!this.doc.reserver) {
			throw new Error('reserver is not populated');
		}
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			throw new TypeError(
				'reserver is not populated or is not of the correct type',
			);
		}
		// Check userType discriminator to determine which adapter to use
		const reserverDoc = this.doc.reserver as
			| Models.User.PersonalUser
			| Models.User.AdminUser;
		if (reserverDoc.userType === 'admin-user') {
			return new AdminUserDomainAdapter(
				this.doc.reserver as Models.User.AdminUser,
			);
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	async loadReserver(): Promise<
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference
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
		if (reserverDoc.userType === 'admin-user') {
			return new AdminUserDomainAdapter(
				this.doc.reserver as Models.User.AdminUser,
			);
		}
		const adapter = new PersonalUserDomainAdapter(
			this.doc.reserver as Models.User.PersonalUser,
		);
		return adapter.entityReference;
	}

	set reserver(user:
		| Domain.Contexts.User.PersonalUser.PersonalUserEntityReference
		| Domain.Contexts.User.AdminUser.AdminUserEntityReference) {
		if (
			user instanceof Domain.Contexts.User.PersonalUser.PersonalUser ||
			user instanceof Domain.Contexts.User.AdminUser.AdminUser
		) {
			this.doc.set('reserver', user.props.doc);
			return;
		}

		if (!user?.id) {
			throw new Error('reserver reference is missing id');
		}
		this.doc.set('reserver', new MongooseSeedwork.ObjectId(user.id));
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

	set listing(listing:
		| ItemListingDomainAdapter
		| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference) {
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

	private _messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[] =
		[];

	get messages(): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection
		return this._messages;
	}

	set messages(value: Domain.Contexts.Conversation.Conversation.MessageEntityReference[]) {
		this._messages = value;
	}

	loadMessages(): Promise<
		Domain.Contexts.Conversation.Conversation.MessageEntityReference[]
	> {
		// For now, return empty array since messages are not stored as subdocuments
		// TODO: Implement proper message loading from separate collection or populate from subdocuments
		return Promise.resolve(this._messages);
	}

	/**
	 * Gets the expiration date for this conversation.
	 * When set, the conversation will be automatically deleted by MongoDB TTL index
	 * after this date passes.
	 */
	get expiresAt(): Date | undefined {
		return this.doc.expiresAt;
	}

	/**
	 * Sets the expiration date for this conversation.
	 * Should be set to 6 months after the associated listing expires, is cancelled,
	 * or the related reservation request is completed/closed.
	 */
	set expiresAt(value: Date | undefined) {
		this.doc.expiresAt = value;
	}
}
