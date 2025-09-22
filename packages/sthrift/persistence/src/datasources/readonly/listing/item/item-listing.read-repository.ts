import type { Domain } from '@sthrift/domain';
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
	getPaged: (args: {
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilters?: string[];
		sharerId?: string; // optional filter by sharer
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}>;
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

	async getPaged(args: {
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilters?: string[];
		sharerId?: string;
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}): Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		// Basic in-memory filtering using existing repository methods & mock fallback
		let listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

		if (args.sharerId) {
			listings = await this.getBySharer(args.sharerId);
		} else {
			listings = await this.getAll();
		}

		// Apply search filter
		if (args.searchText) {
			const text = args.searchText.toLowerCase();
			listings = listings.filter((l) => l.title.toLowerCase().includes(text));
		}

		// Apply status filters (map to domain state property if present)
		if (args.statusFilters && args.statusFilters.length > 0) {
			listings = listings.filter((l) =>
				l.state ? args.statusFilters?.includes(l.state) === true : true,
			);
		}

		// Apply sorter
		if (args.sorter?.field) {
			const { field, order } = args.sorter;
			listings = [...listings].sort((a, b) => {
				// Access dynamic field in a type-safe way by narrowing via keyof
				// Cast through unknown to satisfy exactOptionalPropertyTypes without asserting broad index signature
				const key = field as keyof typeof a & keyof typeof b;
				// Use a generic indexable helper type instead of Record<any, unknown>
				type Indexable<T> = { [K in keyof T]: T[K] };
				const fieldA = (a as unknown as Indexable<typeof a>)[key] as
					| string
					| number
					| Date
					| undefined;
				const fieldB = (b as unknown as Indexable<typeof b>)[key] as
					| string
					| number
					| Date
					| undefined;
				if (fieldA == null && fieldB == null) {
					return 0;
				}
				if (fieldA == null) {
					return order === 'ascend' ? -1 : 1;
				}
				if (fieldB == null) {
					return order === 'ascend' ? 1 : -1;
				}
				if (fieldA < fieldB) {
					return order === 'ascend' ? -1 : 1;
				}
				if (fieldA > fieldB) {
					return order === 'ascend' ? 1 : -1;
				}
				return 0;
			});
		}

		const total = listings.length;
		const startIndex = (args.page - 1) * args.pageSize;
		const endIndex = startIndex + args.pageSize;
		const items = listings.slice(startIndex, endIndex);

		return { items, total, page: args.page, pageSize: args.pageSize };
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
