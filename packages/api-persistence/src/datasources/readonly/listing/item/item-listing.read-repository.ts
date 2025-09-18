import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	ItemListingDataSourceImpl,
	type ItemListingDataSource,
} from './item-listing.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ItemListingConverter } from '../../../domain/listing/item/item-listing.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { getMockItemListings } from './mock-item-listings.js';

export interface ItemListingReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null>;
	getBySharer: (
		sharerId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
}

export class ItemListingReadRepositoryImpl
	implements ItemListingReadRepository
{
	private readonly mongoDataSource: ItemListingDataSource;
	private readonly converter: ItemListingConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new ItemListingDataSourceImpl(
			models.Listing.ItemListingModel,
		);
		this.converter = new ItemListingConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		if (!result || result.length === 0) {
			// Return mock data when no real data exists
			return getMockItemListings();
		}
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			// Try to find in mock data
			const mockResult = getMockItemListings().find(
				(
					listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
				) => listing.id === id,
			);
			if (mockResult) {
				return mockResult;
			}
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getBySharer(
		sharerId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
		// Handle empty or invalid sharerId (for development/testing)
		if (!sharerId || sharerId.trim() === '') {
			return getMockItemListings();
		}

        console.log("SHARER ID:", sharerId);
		try {
			// Assuming the field is 'sharer' in the model and stores the user's ObjectId or externalId
			const result = await this.mongoDataSource.find(
				{ sharer: new MongooseSeedwork.ObjectId(sharerId) },
				options,
			);
			if (!result || result.length === 0) {
				// Return all mock data when no real data exists (for development/testing)
				// Update mock users to use the current sharerId for consistency
				const mockListings = getMockItemListings();
				return mockListings.map(
					(
						listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
					) => ({
						...listing,
						sharer: {
							...listing.sharer,
							id: sharerId, // Use the actual sharerId from the request
						},
					}),
				);
			}
			return result.map((doc) => this.converter.toDomain(doc, this.passport));
		} catch (error) {
			// If ObjectId creation fails, return mock data
			console.warn('Error with ObjectId, returning mock data:', error);
			const mockListings = getMockItemListings();
			return mockListings.map(
				(
					listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
				) => ({
					...listing,
					sharer: {
						...listing.sharer,
						id: sharerId, // Use the actual sharerId from the request
					},
				}),
			);
		}
	}
}

export const getItemListingReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ItemListingReadRepositoryImpl(models, passport);
};
