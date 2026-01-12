import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';
import type {
	FindOneOptions,
	FindOptions,
	MongoDataSource,
} from '../../mongo-data-source.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { FilterQuery, PipelineStage } from 'mongoose';
import type { Models } from '@sthrift/data-sources-mongoose-models';

// Reservation state constants for filtering (inline per codebase patterns)
const ACTIVE_STATES = ['Accepted', 'Requested'];
const INACTIVE_STATES = ['Cancelled', 'Closed', 'Rejected'];

const PopulatedFields = ['listing', 'reserver'];
export interface ReservationRequestReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
	getByReserverId: (
		reserverId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getActiveByReserverIdWithListingWithSharer: (
		reserverId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getPastByReserverIdWithListingWithSharer: (
		reserverId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	// Returns reservation requests for listings owned by the sharer (listing owner dashboard)
	getListingRequestsBySharerId: (
		sharerId: string,
		options?: {
			page?: number;
			pageSize?: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string | null; order: 'ascend' | 'descend' | null };
		},
	) => Promise<{
		items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}>;
	getActiveByReserverIdAndListingId: (
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
	getOverlapActiveReservationRequestsForListing: (
		listingId: string,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getActiveByListingId: (
		listingId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
}

/**
 * ReservationRequestReadRepositoryImpl
 *
 * Architectural note:
 * Inline mock data generation was removed in favor of database-seeded test data using the
 * mock-mongodb-memory-server package.
 * This change improves test reliability and maintains separation of concerns between data
 * setup and repository logic.
 */
export class ReservationRequestReadRepositoryImpl
	implements ReservationRequestReadRepository
{
	private readonly models: ModelsContext;
	private readonly mongoDataSource: MongoDataSource<Models.ReservationRequest.ReservationRequest>;
	private readonly converter: ReservationRequestConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.models = models;
		this.mongoDataSource = new ReservationRequestDataSourceImpl(
			models.ReservationRequest.ReservationRequest,
		);
		this.converter = new ReservationRequestConverter();
		this.passport = passport;
	}

	/**
	 * Helper method for querying multiple documents
	 */
	private async queryMany(
		filter: FilterQuery<Models.ReservationRequest.ReservationRequest>,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const docs = await this.mongoDataSource.find(filter, options);
		return docs.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const result = await this.mongoDataSource.find(
			{},
			{ ...options, populateFields: PopulatedFields },
		);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, {
			...options,
			populateFields: PopulatedFields,
		});
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getByReserverId(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
		};
		const result = await this.mongoDataSource.find(filter, {
			...options,
			populateFields: PopulatedFields,
		});
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
			state: { $in: ACTIVE_STATES },
		};
		return await this.queryMany(filter, {
			...options,
			populateFields: PopulatedFields,
		});
	}

	async getPastByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
			state: { $in: INACTIVE_STATES },
		};
		return await this.queryMany(filter, {
			...options,
			populateFields: PopulatedFields,
		});
	}

	async getListingRequestsBySharerId(
		sharerId: string,
		options?: {
			page?: number;
			pageSize?: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string | null; order: 'ascend' | 'descend' | null };
		},
	): Promise<{
		items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		const page = options?.page ?? 1;
		const pageSize = options?.pageSize ?? 10;

		// Build filter for sharerId and optional filters
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {};

		// First, we need to find listings owned by the sharer
		const sharerListings = await this.models.Listing.ItemListingModel.find({
			sharer: new MongooseSeedwork.ObjectId(sharerId),
		}).select('_id').exec();

		const listingIds = sharerListings.map(listing => listing._id);
		filter.listing = { $in: listingIds };

		// Apply status filters
		if (options?.statusFilters?.length) {
			filter.state = { $in: options.statusFilters };
		}

		// Apply search filter (on listing title via join)
		if (options?.searchText) {
			const searchTerm = options.searchText;
			// For search, we need to use aggregation to join with listings
			const searchPipeline: PipelineStage[] = [
				{ $match: filter },
				{
					$lookup: {
						from: this.models.Listing.ItemListingModel.collection.name,
						localField: 'listing',
						foreignField: '_id',
						as: 'listingDoc',
					},
				},
				{ $unwind: '$listingDoc' },
				{
					$match: {
						'listingDoc.title': { $regex: searchTerm, $options: 'i' },
					},
				},
			];

			// Get total count for search
			const countPipeline = [...searchPipeline, { $count: 'total' }];
			const countResult = await this.models.ReservationRequest.ReservationRequest.aggregate(countPipeline).exec();
			const total = countResult[0]?.total ?? 0;

			// Apply sorting
			if (options?.sorter?.field) {
				const sortOrder = options.sorter.order === 'descend' ? -1 : 1;
				let sortField = options.sorter.field;
				// Map UI field names to database field names
				if (sortField === 'requestedOn') sortField = 'createdAt';
				if (sortField === 'title') {
					// For title sorting, we need to sort by the joined field
					searchPipeline.push({
						$sort: { 'listingDoc.title': sortOrder },
					} as PipelineStage);
				} else {
					searchPipeline.push({
						$sort: { [sortField]: sortOrder },
					} as PipelineStage);
				}
			} else {
				// Default sort by createdAt desc
				searchPipeline.push({ $sort: { createdAt: -1 } } as PipelineStage);
			}

			// Apply pagination
			const skip = (page - 1) * pageSize;
			searchPipeline.push({ $skip: skip } as PipelineStage);
			searchPipeline.push({ $limit: pageSize } as PipelineStage);

			// Execute search aggregation and convert to domain entities
			const docs = await this.models.ReservationRequest.ReservationRequest.aggregate(searchPipeline).exec();
			const items = docs.map((doc) => this.converter.toDomain(doc, this.passport));

			return {
				items,
				total,
				page,
				pageSize,
			};
		} else {
			// No search - use regular query with population
			const sortOptions: Record<string, 1 | -1> = {};
			if (options?.sorter?.field) {
				const sortOrder = options.sorter.order === 'descend' ? -1 : 1;
				let sortField = options.sorter.field;
				if (sortField === 'requestedOn') sortField = 'createdAt';
				sortOptions[sortField] = sortOrder;
			} else {
				sortOptions['createdAt'] = -1;
			}

			// Get total count
			const total = await this.models.ReservationRequest.ReservationRequest.countDocuments(filter).exec();

			// Get paginated results with population
			const docs = await this.mongoDataSource.find(filter, {
				populateFields: PopulatedFields,
				sort: sortOptions,
				skip: (page - 1) * pageSize,
				limit: pageSize,
			});

			const items = docs.map((doc) => this.converter.toDomain(doc, this.passport));

			return {
				items,
				total,
				page,
				pageSize,
			};
		}
	}

	async getActiveByReserverIdAndListingId(
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
			listing: new MongooseSeedwork.ObjectId(listingId),
			state: { $in: ACTIVE_STATES },
		};
		const result = await this.mongoDataSource.findOne(filter, {
			...options,
			populateFields: PopulatedFields,
		});
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	async getOverlapActiveReservationRequestsForListing(
		listingId: string,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			listing: new MongooseSeedwork.ObjectId(listingId),
			state: { $in: ACTIVE_STATES },
			reservationPeriodStart: { $lt: reservationPeriodEnd },
			reservationPeriodEnd: { $gt: reservationPeriodStart },
		};
		const result = await this.mongoDataSource.find(filter, {
			...options,
			populateFields: PopulatedFields,
		});
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByListingId(
		listingId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			listing: new MongooseSeedwork.ObjectId(listingId),
			state: { $in: ACTIVE_STATES },
		};
		return await this.queryMany(filter, options);
	}
}

export const getReservationRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ReservationRequestReadRepositoryImpl(models, passport);
};
