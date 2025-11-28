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
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
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
	queryOverlapByListingIdAndReservationPeriod: (params: {
		listingId: string;
		reservationPeriodStart: Date;
		reservationPeriodEnd: Date;
	}) => Promise<
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

	/**
	 * Helper method for querying a single document
	 */
	private async queryOne(
		filter: FilterQuery<Models.ReservationRequest.ReservationRequest>,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const doc = await this.mongoDataSource.findOne(filter, options);
		return doc ? this.converter.toDomain(doc, this.passport) : null;
	}

	/**
	 * Helper method for querying by ID
	 */
	private async queryById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const doc = await this.mongoDataSource.findById(id, options);
		return doc ? this.converter.toDomain(doc, this.passport) : null;
	}

	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		return await this.queryMany({}, options);
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		return await this.queryById(id, options);
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
		return await this.queryMany(filter, options);
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
			populateFields: ['listing', 'reserver'],
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
			populateFields: ['listing', 'reserver'],
		});
	}

	async getListingRequestsBySharerId(
		sharerId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		// Use aggregation pipeline to join listings and filter by sharerId
		const pipeline: PipelineStage[] = [
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
					'listingDoc.sharer': new MongooseSeedwork.ObjectId(sharerId),
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'reserver',
					foreignField: '_id',
					as: 'reserverDoc',
				},
			},
			{ $unwind: '$reserverDoc' },
		];

		// Apply additional options if provided (e.g., limit, sort)
		if (options?.limit) {
			pipeline.push({ $limit: options.limit } as PipelineStage);
		}
		if (options?.sort) {
			pipeline.push({ $sort: options.sort } as PipelineStage);
		}

		try {
			const docs =
				await this.models.ReservationRequest.ReservationRequest.aggregate(
					pipeline,
				).exec();

			console.log('Aggregation returned', docs.length, 'documents');

			// Hydrate aggregation results into proper Mongoose documents
			// This ensures the documents have virtual getters like `id` that map `_id` to string
			const hydratedDocs = docs.map((doc) => {
				const { listingDoc, reserverDoc, ...rest } = doc;

				// Create a new document instance from the aggregation result
				const hydratedDoc =
					this.models.ReservationRequest.ReservationRequest.hydrate({
						...rest,
						listing: listingDoc,
						reserver: reserverDoc,
					});

				return hydratedDoc;
			});

			console.log(
				'Converted docs sample:',
				hydratedDocs.length > 0
					? {
							id: hydratedDocs[0]?.id,
							hasListing: !!hydratedDocs[0]?.listing,
							hasReserver: !!hydratedDocs[0]?.reserver,
						}
					: 'none',
			);

			// Convert to domain entities
			return hydratedDocs.map((doc) =>
				this.converter.toDomain(doc, this.passport),
			);
		} catch (error) {
			console.error('Error in getListingRequestsBySharerId:', error);
			throw error;
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
		return await this.queryOne(filter, options);
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
		return await this.queryMany(filter, options);
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

	async queryOverlapByListingIdAndReservationPeriod(params: {
		listingId: string;
		reservationPeriodStart: Date;
		reservationPeriodEnd: Date;
	}): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			listing: new MongooseSeedwork.ObjectId(params.listingId),
			state: { $in: ACTIVE_STATES },
			reservationPeriodStart: { $lt: params.reservationPeriodEnd },
			reservationPeriodEnd: { $gt: params.reservationPeriodStart },
		};
		return await this.queryMany(filter);
	}
}

export const getReservationRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ReservationRequestReadRepositoryImpl(models, passport);
};
