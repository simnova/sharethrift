import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import type { Domain } from '@sthrift/api-domain';
import type { ConversationDomainAdapter } from './conversation.domain-adapter';

type ConversationModelType = Models.Conversation.ConversationModel;
type PropType = ConversationDomainAdapter;

export class ConversationRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ConversationModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.Conversation.Conversation<PropType>
	>
	implements Domain.Contexts.Conversation.ConversationRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.Conversation.Conversation<PropType> | null> {
		const mongoConversation = await this.model.findById(id).exec();
		if (!mongoConversation) return null;
		return this.typeConverter.toDomain(mongoConversation, this.passport);
	}

	async getByListingAndParticipants(
		listing: string,
		sharer: string,
		reserver: string,
	): Promise<Domain.Contexts.Conversation.Conversation<PropType> | null> {
		const mongoConversation = await this.model
			.findOne({ listing, sharer, reserver })
			.exec();
		if (!mongoConversation) return null;
		return this.typeConverter.toDomain(mongoConversation, this.passport);
	}

	async getUserConversations(
		userId: string,
	): Promise<Domain.Contexts.Conversation.Conversation<PropType>[]> {
		const mongoConversations = await this.model
			.find({ $or: [{ sharer: userId }, { reserver: userId }] })
			.exec();
		return mongoConversations.map((doc) =>
			this.typeConverter.toDomain(doc, this.passport),
		);
	}

	createNewInstance(
		sharer: string,
		reserver: string,
		listing: string,
		twilioConversationId: string,
		schemaversion: number,
		passport: Domain.Passport,
	): Domain.Contexts.Conversation.Conversation<PropType> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		adapter.sharer = sharer;
		adapter.reserver = reserver;
		adapter.listing = listing;
		adapter.twilioConversationId = twilioConversationId;
		adapter.schemaversion = schemaversion;
		adapter.createdAt = new Date();
		adapter.updatedAt = new Date();
		return this.typeConverter.toDomain(adapter.doc, passport);
		return Domain.Contexts.Conversation.Conversation.create(
			adapter.id,
			twilioConversationSid,
			listingId,
			participants,
			passport,
		);
	}
}
