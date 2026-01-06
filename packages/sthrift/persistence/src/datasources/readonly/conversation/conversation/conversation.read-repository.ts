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

	/**
	 * Finds all conversations associated with a specific listing.
	 * Used for scheduling conversation deletion when a listing expires or is archived.
	 * @param listingId - The ID of the listing to find conversations for
	 * @param options - Optional find options
	 * @returns Array of conversations associated with the listing
	 */
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

		try {
			const result = await this.mongoDataSource.find(
				{
					$or: [
						{ sharer: new MongooseSeedwork.ObjectId(userId) },
						{ reserver: new MongooseSeedwork.ObjectId(userId) },
					],
				},
				{
					...options,
					populateFields: populateFields,
				},
			);
			return result.map((doc) => this.converter.toDomain(doc, this.passport));
		} catch (error) {
			console.warn('Error with ObjectId:', error);
			return [];
		}
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

		try {
			const result = await this.mongoDataSource.findOne(
				{
					sharer: new MongooseSeedwork.ObjectId(sharerId),
					reserver: new MongooseSeedwork.ObjectId(reserverId),
					listing: new MongooseSeedwork.ObjectId(listingId),
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
		} catch (error) {
			console.warn('Error with ObjectId in getBySharerReserverListing:', error);
			return null;
		}
	}

	/**
	 * Finds all conversations associated with a specific listing.
	 * Used for scheduling conversation deletion when a listing expires or is archived.
	 * @param listingId - The ID of the listing to find conversations for
	 * @param options - Optional find options
	 * @returns Array of conversations associated with the listing
	 */
	async getByListingId(
		listingId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> {
		if (!listingId || listingId.trim() === '') {
			return [];
		}

		try {
			const result = await this.mongoDataSource.find(
				{
					listing: new MongooseSeedwork.ObjectId(listingId),
				},
				{
					...options,
					populateFields: populateFields,
				},
			);
			return result.map((doc) => this.converter.toDomain(doc, this.passport));
		} catch (error) {
			console.warn('Error with ObjectId in getByListingId:', error);
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
