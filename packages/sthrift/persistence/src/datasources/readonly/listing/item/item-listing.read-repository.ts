import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	ItemListingDataSourceImpl,
	type ItemListingDataSource,
} from './item-listing.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ItemListingConverter } from '../../../domain/listing/item/item-listing.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const populateFields = ['sharer'];

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
		sharerId?: string;
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

class ItemListingReadRepositoryImpl
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
		const result = await this.mongoDataSource.find({}, {
			...options,
			populateFields: populateFields,
		});
		if (!result || result.length === 0) return [];
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
		// Build MongoDB query
		const query: Record<string, unknown> = {};

		// Add sharerId filter
		if (args.sharerId) {
			try {
				// biome-ignore lint/complexity/useLiteralKeys: MongoDB query uses index signature
				query['sharer'] = new MongooseSeedwork.ObjectId(args.sharerId);
			} catch {
				return {
					items: [],
					total: 0,
					page: args.page,
					pageSize: args.pageSize,
				};
			}
		}

		// Add search text filter (search across multiple fields)
		if (args.searchText) {
			const searchRegex = { $regex: args.searchText, $options: 'i' };
			// biome-ignore lint/complexity/useLiteralKeys: MongoDB query uses index signature
			query['$or'] = [
				{ title: searchRegex },
				{ description: searchRegex },
				{ category: searchRegex },
				{ location: searchRegex },
			];
		}

		// Add status filters
		if (args.statusFilters && args.statusFilters.length > 0) {
			// biome-ignore lint/complexity/useLiteralKeys: MongoDB query uses index signature
			query['state'] = { $in: args.statusFilters };
		}

		// Build sort criteria
		const sort: Record<string, 1 | -1> = {};
		if (args.sorter?.field) {
			const direction = args.sorter.order === 'ascend' ? 1 : -1;
			// Map GraphQL field names to MongoDB field names
			const fieldMapping: Record<string, string> = {
				publishedAt: 'createdAt',
				reservationPeriod: 'sharingPeriodStart', // Sort by start date
				status: 'state',
			};
			const mongoField = fieldMapping[args.sorter.field] || args.sorter.field;
			sort[mongoField] = direction;
		} else {
			// biome-ignore lint/complexity/useLiteralKeys: MongoDB sort uses index signature
			sort['createdAt'] = -1; // Default: newest first
		}

		// Calculate pagination
		const skip = (args.page - 1) * args.pageSize;

		// Execute MongoDB queries in parallel
		const [mongoItems, total] = await Promise.all([
			this.mongoDataSource.find(query, { sort, skip, limit: args.pageSize }),
			this.mongoDataSource
				.find(query)
				.then((result) => result?.length ?? 0), // Use find + length since count() not available
		]);

		// Convert to domain objects
		const items = (mongoItems || []).map((doc) =>
			this.converter.toDomain(doc, this.passport),
		);

		return { items, total, page: args.page, pageSize: args.pageSize };
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, {
			...options,
			populateFields: populateFields,
		});
		if (!result) return null;
		return this.converter.toDomain(result, this.passport);
	}

	async getBySharer(
		sharerId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
		if (!sharerId || sharerId.trim() === '') return [];
		try {
			const result = await this.mongoDataSource.find(
				{ sharer: new MongooseSeedwork.ObjectId(sharerId) },
				{
					...options,
					populateFields: populateFields,
				},
			);
			if (!result || result.length === 0) return [];
			return result.map((doc) => this.converter.toDomain(doc, this.passport));
		} catch (_error) {
			return [];
		}
	}
}

export const getItemListingReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ItemListingReadRepositoryImpl(models, passport);
};
