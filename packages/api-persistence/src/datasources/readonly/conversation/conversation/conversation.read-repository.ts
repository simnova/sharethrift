import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import {
	ConversationDataSourceImpl,
	type ConversationDataSource,
} from './conversation.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ConversationConverter } from '../../../domain/conversation/conversation/conversation.domain-adapter.ts';

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
}

export const getConversationReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ConversationReadRepositoryImpl(models, passport);
};
