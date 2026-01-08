import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	ConversationDataSourceImpl,
	type ConversationDataSource,
} from './conversation.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ConversationConverter } from '../../../domain/conversation/conversation/conversation.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const populateFields = ['sharer', 'reserver', 'listing'];

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

	getBySharerReserverListing: (
		sharerId: string,
		reserverId: string,
		listingId: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;

	getByListingId: (
		listingId: string,
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
		const result = await this.mongoDataSource.find(
			{},
			{ ...options, populateFields: populateFields },
		);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, {
			...options,
			populateFields: populateFields,
		});
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

		let userObjectId: MongooseSeedwork.ObjectId;
		try {
			userObjectId = new MongooseSeedwork.ObjectId(userId);
		} catch (error) {
			console.error('[ConversationReadRepository] Invalid ObjectId format for userId:', {
				userId,
				error: error instanceof Error ? error.message : String(error),
			});
			return [];
		}

		const result = await this.mongoDataSource.find(
			{
				$or: [
					{ sharer: userObjectId },
					{ reserver: userObjectId },
				],
			},
			{
				...options,
				populateFields: populateFields,
			},
		);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getBySharerReserverListing(
		sharerId: string,
		reserverId: string,
		listingId: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> {
		if (!sharerId || !reserverId || !listingId) {
			return null;
		}

		let sharerObjectId: MongooseSeedwork.ObjectId;
		let reserverObjectId: MongooseSeedwork.ObjectId;
		let listingObjectId: MongooseSeedwork.ObjectId;
		
		try {
			sharerObjectId = new MongooseSeedwork.ObjectId(sharerId);
			reserverObjectId = new MongooseSeedwork.ObjectId(reserverId);
			listingObjectId = new MongooseSeedwork.ObjectId(listingId);
		} catch (error) {
			console.error('[ConversationReadRepository] Invalid ObjectId format in getBySharerReserverListing:', {
				sharerId,
				reserverId,
				listingId,
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}

		const result = await this.mongoDataSource.findOne(
			{
				sharer: sharerObjectId,
				reserver: reserverObjectId,
				listing: listingObjectId,
			},
			{
				...options,
				populateFields: populateFields,
			},
		);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByListingId(
		listingId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> {
		if (!listingId || listingId.trim() === '') {
			return [];
		}

		let objectId: MongooseSeedwork.ObjectId;
		try {
			objectId = new MongooseSeedwork.ObjectId(listingId);
		} catch (error) {
			console.error('[ConversationReadRepository] Invalid ObjectId format for listingId:', {
				listingId,
				error: error instanceof Error ? error.message : String(error),
			});
			return [];
		}

		const result = await this.mongoDataSource.find(
			{ listing: objectId },
			{ ...options, populateFields: populateFields },
		);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}
}

export const getConversationReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ConversationReadRepositoryImpl(models, passport);
};
