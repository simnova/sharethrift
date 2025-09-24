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

	async getByTwilioSid(
		twilioConversationId: string,
	): Promise<Domain.Contexts.Conversation.Conversation.Conversation<PropType> | null> {
		const mongoConversation = await this.model
			.findOne({ twilioConversationId })
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

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
	): Promise<Domain.Contexts.Conversation.Conversation.Conversation<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Conversation.Conversation.Conversation.getNewInstance(
				adapter,
				sharer,
				reserver,
				listing,
				this.passport,
			),
		);
	}
}
