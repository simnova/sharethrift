import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	ConversationDataSourceImpl,
	type ConversationDataSource,
} from './conversation.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ConversationConverter } from '../../../domain/conversation/conversation/conversation.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export interface ConversationReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;

	getByUser: (
		userId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	>;
}

export class ConversationReadRepositoryImpl
	implements ConversationReadRepository
{
	private readonly mongoDataSource: ConversationDataSource;
	private readonly converter: ConversationConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new ConversationDataSourceImpl(
			models.Conversation.ConversationModel,
		);
		this.converter = new ConversationConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByUser(
		userId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> {
		if (!userId || userId.trim() === '') {
			return [];
		}

		try {
			const result = await this.mongoDataSource.find(
				{
					$or: [
						{ sharer: new MongooseSeedwork.ObjectId(userId) },
						{ reserver: new MongooseSeedwork.ObjectId(userId) },
					],
				},
				options,
			);
			
			return result.map((doc) => this.converter.toDomain(doc, this.passport));
		} catch (error) {
			console.warn('Error with ObjectId:', error);
			return [];
		}
	}
}

export const getConversationReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ConversationReadRepositoryImpl(models, passport);
};
