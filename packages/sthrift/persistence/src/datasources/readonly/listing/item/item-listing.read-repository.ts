import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import type { AdminListingDto } from '../../../../dtos/listing.ts';
import {
  ItemListingDataSourceImpl,
  type ItemListingDataSource,
} from './item-listing.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ItemListingConverter } from '../../../domain/listing/item/item-listing.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export interface ItemListingReadRepository {
  getAll: (
    options?: FindOptions,
  ) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]>;

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

  // Admin-focused paged result: lightweight DTOs for admin UI
  getPagedAdmin: (args: {
    page: number;
    pageSize: number;
    searchText?: string;
    statusFilters?: string[];
    sharerId?: string;
    sorter?: { field: string; order: 'ascend' | 'descend' };
  }) => Promise<{
    items: AdminListingDto[];
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
  ) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]>;
}

export class ItemListingReadRepositoryImpl implements ItemListingReadRepository {
  private readonly mongoDataSource: ItemListingDataSource;
  private readonly converter: ItemListingConverter;
  private readonly passport: Domain.Passport;

  constructor(models: ModelsContext, passport: Domain.Passport) {
    this.mongoDataSource = new ItemListingDataSourceImpl(models.Listing.ItemListingModel);
    this.converter = new ItemListingConverter();
    this.passport = passport;
  }

  async getAll(
    options?: FindOptions,
  ): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
    const result = await this.mongoDataSource.find({}, options);
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
        return { items: [], total: 0, page: args.page, pageSize: args.pageSize };
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
      this.mongoDataSource.find(query).then((result) => result?.length ?? 0), // Use find + length since count() not available
    ]);

    // Convert to domain objects
    const items = (mongoItems || []).map((doc) => this.converter.toDomain(doc, this.passport));

    return { items, total, page: args.page, pageSize: args.pageSize };
  }

  async getPagedAdmin(args: {
    page: number;
    pageSize: number;
    searchText?: string;
    statusFilters?: string[];
    sharerId?: string;
    sorter?: { field: string; order: 'ascend' | 'descend' };
  }): Promise<{
    items: AdminListingDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.getPaged(args);

    // Map domain entities to lightweight admin DTOs
    const items = result.items.map((listing) => this.toAdminListingDto(listing));

    return { items, total: result.total, page: result.page, pageSize: result.pageSize };
  }

  /**
   * Convert a domain ItemListing entity to an AdminListingDto
   */
  private toAdminListingDto(listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference): AdminListingDto {
    const formatDate = (date: Date | string | null | undefined): string => {
      if (!date) return '';
      try {
        const d = date instanceof Date ? date : new Date(date);
        return d.toISOString();
      } catch {
        return '';
      }
    };

    const firstImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;
    const startDate = formatDate(listing.sharingPeriodStart);
    const endDate = formatDate(listing.sharingPeriodEnd);

    return {
      id: listing.id,
      title: listing.title,
      image: firstImage ?? null, // Ensure null, not undefined
      publishedAt: formatDate(listing.createdAt),
      reservationPeriod: `${startDate.slice(0, 10)} - ${endDate.slice(0, 10)}`,
      status: listing.state || 'Unknown',
      pendingRequestsCount: 0, // TODO: Implement reservation request counting
    };
  }

  async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> {
    const result = await this.mongoDataSource.findById(id, options);
    if (!result) return null;
    return this.converter.toDomain(result, this.passport);
  }

  async getBySharer(sharerId: string, options?: FindOptions): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
    if (!sharerId || sharerId.trim() === '') return [];
    try {
      const result = await this.mongoDataSource.find({ sharer: new MongooseSeedwork.ObjectId(sharerId) }, options);
      if (!result || result.length === 0) return [];
      return result.map((doc) => this.converter.toDomain(doc, this.passport));
    } catch (_error) {
      return [];
    }
  }
}

export const getItemListingReadRepository = (models: ModelsContext, passport: Domain.Passport) => {
  return new ItemListingReadRepositoryImpl(models, passport);
};
