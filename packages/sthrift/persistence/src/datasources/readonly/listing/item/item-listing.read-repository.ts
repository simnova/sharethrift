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
    let listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

    if (args.sharerId) listings = await this.getBySharer(args.sharerId);
    else listings = await this.getAll();

    if (args.searchText) {
      const text = args.searchText.toLowerCase();
      listings = listings.filter((l) => l.title.toLowerCase().includes(text));
    }

    if (args.statusFilters && args.statusFilters.length > 0) {
      listings = listings.filter((l) => (l.state ? args.statusFilters?.includes(l.state) === true : true));
    }

    if (args.sorter?.field) {
      const { field, order } = args.sorter;
      listings = [...listings].sort((a, b) => {
        const key = field as keyof typeof a & keyof typeof b;
        type Indexable<T> = { [K in keyof T]: T[K] };
        const fieldA = (a as unknown as Indexable<typeof a>)[key] as string | number | Date | undefined;
        const fieldB = (b as unknown as Indexable<typeof b>)[key] as string | number | Date | undefined;
        if (fieldA == null && fieldB == null) return 0;
        if (fieldA == null) return order === 'ascend' ? -1 : 1;
        if (fieldB == null) return order === 'ascend' ? 1 : -1;
        if (fieldA < fieldB) return order === 'ascend' ? -1 : 1;
        if (fieldA > fieldB) return order === 'ascend' ? 1 : -1;
        return 0;
      });
    }

    const total = listings.length;
    const startIndex = (args.page - 1) * args.pageSize;
    const endIndex = startIndex + args.pageSize;
    const items = listings.slice(startIndex, endIndex);

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

    const toIso = (v: unknown): string => {
      if (v == null) return '';
      if (typeof v === 'string') return v;
      if (v instanceof Date) return v.toISOString();
      if (typeof v === 'object' && v !== null && 'toISOString' in v) {
        const maybe = v as { toISOString?: unknown };
        if (typeof maybe.toISOString === 'function') return (maybe.toISOString as () => string)();
      }
      try {
        return String(v);
      } catch {
        return '';
      }
    };

    type ListingLike = {
      id?: string;
      title?: string;
      images?: string[] | undefined;
      createdAt?: Date | string | null;
      sharingPeriodStart?: Date | string | null;
      sharingPeriodEnd?: Date | string | null;
      state?: string | undefined;
      pendingRequestsCount?: number | undefined;
    };

    const items = result.items.map((it) => {
      const l = it as unknown as ListingLike;
      const images = l.images;
      const img = images && images.length > 0 && images[0] ? images[0] : null;
      const start = toIso(l.sharingPeriodStart);
      const end = toIso(l.sharingPeriodEnd);
      return {
        id: l.id ?? '',
        title: l.title ?? '',
        image: img,
        publishedAt: toIso(l.createdAt) || null,
        reservationPeriod: `${start.slice(0, 10)} - ${end.slice(0, 10)}`,
        status: l.state ?? 'Unknown',
        pendingRequestsCount: l.pendingRequestsCount ?? 0,
      };
    });

    return { items: items as AdminListingDto[], total: result.total, page: result.page, pageSize: result.pageSize };
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
