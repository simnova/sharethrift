import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { ConversationDomainAdapter } from './conversation.domain-adapter.ts';

type ConversationModelType = Models.Conversation.Conversation;
type PropType = ConversationDomainAdapter;

export class ConversationRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ConversationModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.Conversation.Conversation.Conversation<PropType>
	>
	implements
		Domain.Contexts.Conversation.Conversation.ConversationRepository<PropType>
{
	async getByIdWithReferences(
		id: string,
	): Promise<Domain.Contexts.Conversation.Conversation.Conversation<PropType>> {
		const mongoConversation = await this.model
			.findById(id)
			.populate('sharer')
			.populate('reserver')
			.populate('listing')
			.exec();
		if (!mongoConversation) {
			throw new Error(`Conversation with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoConversation, this.passport);
	}

	async getByMessagingId(
		messagingConversationId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.Conversation<PropType> | null> {
		const mongoConversation = await this.model
			.findOne({ messagingConversationId })
			.populate('sharer')
			.populate('reserver')
			.populate('listing')
			.exec();
		if (!mongoConversation) {
			return null;
		}
		return this.typeConverter.toDomain(mongoConversation, this.passport);
	}

	async getByIdWithSharerReserver(
		sharer: string,
		reserver: string,
	): Promise<Domain.Contexts.Conversation.Conversation.Conversation<PropType> | null> {
		const query = {
			sharer: new MongooseSeedwork.ObjectId(sharer),
			reserver: new MongooseSeedwork.ObjectId(reserver),
		};
		const mongoConversation = await this.model
			.findOne(query)
			.populate('sharer')
			.populate('reserver')
			.exec();
		if (!mongoConversation) {
			return null;
		}
		return this.typeConverter.toDomain(mongoConversation, this.passport);
	}

	/**
	 * Finds all conversations associated with a specific listing.
	 * Used for scheduling conversation deletion when a listing expires or is archived.
	 * @param listingId - The ID of the listing to find conversations for
	 * @returns Array of conversations associated with the listing
	 */
	async getByListingId(
		listingId: string,
	): Promise<
		Domain.Contexts.Conversation.Conversation.Conversation<PropType>[]
	> {
		const mongoConversations = await this.model
			.find({ listing: new MongooseSeedwork.ObjectId(listingId) })
			.populate('sharer')
			.populate('reserver')
			.populate('listing')
			.exec();
		return Promise.all(
			mongoConversations.map((doc) =>
				this.typeConverter.toDomain(doc, this.passport),
			),
		);
	}

	/**
	 * Finds all conversations that have expired (expiresAt is in the past).
	 * Used by cleanup processes to identify conversations ready for deletion.
	 * Note: MongoDB TTL index handles automatic deletion, but this method
	 * can be used for manual cleanup or verification.
	 * @param limit - Maximum number of conversations to return (default: 100)
	 * @returns Array of expired conversations
	 */
	async getExpired(
		limit = 100,
	): Promise<
		Domain.Contexts.Conversation.Conversation.Conversation<PropType>[]
	> {
		const mongoConversations = await this.model
			.find({
				expiresAt: { $lte: new Date() },
			})
			.limit(limit)
			.populate('sharer')
			.populate('reserver')
			.populate('listing')
			.exec();
		return Promise.all(
			mongoConversations.map((doc) =>
				this.typeConverter.toDomain(doc, this.passport),
			),
		);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		sharer: Domain.Contexts.User.UserEntityReference,
		reserver: Domain.Contexts.User.UserEntityReference,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		messagingConversationId?: string,
	): Promise<Domain.Contexts.Conversation.Conversation.Conversation<PropType>> {
		const newDoc = new this.model();
		// Set a placeholder messagingConversationId for new conversations
		// In production, this would typically be set when creating the messaging conversation
		newDoc.messagingConversationId = `temp-${Date.now()}-${crypto.randomUUID()}`;

		const adapter = this.typeConverter.toAdapter(newDoc);

		return Domain.Contexts.Conversation.Conversation.Conversation.getNewInstance(
			adapter,
			sharer,
			reserver,
			listing,
			[], // Empty messages array for new conversations
			messagingConversationId,
			this.passport,
		);
	}
}
