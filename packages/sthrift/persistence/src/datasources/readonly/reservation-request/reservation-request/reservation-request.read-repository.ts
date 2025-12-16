import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { FilterQuery, PipelineStage } from 'mongoose';
import type { ModelsContext } from '../../../../models-context.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import type {
	FindOneOptions,
	FindOptions,
	MongoDataSource,
} from '../../mongo-data-source.ts';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';

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
			populateFields: ['listing', 'reserver'],
		});
	}

	async getListingRequestsBySharerId(
		sharerId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		// Strongly typed aggregation result with joined documents
		type AggregateResult = Omit<
			Models.ReservationRequest.ReservationRequest,
			'listing' | 'reserver'
		> & {
			listingDoc: unknown;
			reserverDoc: unknown;
			listing: Models.ReservationRequest.ReservationRequest['listing'];
			reserver: Models.ReservationRequest.ReservationRequest['reserver'];
		};

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
		const docs =
			await this.models.ReservationRequest.ReservationRequest.aggregate<AggregateResult>(
				pipeline,
			).exec();

		return this.mapAggregateResultsToDomain(docs);
	}

	/**
	 * Private helper to map aggregation results to domain entities
	 * Handles document reshaping, hydration, and domain conversion
	 */
	private mapAggregateResultsToDomain<
		T extends Omit<
			Models.ReservationRequest.ReservationRequest,
			'listing' | 'reserver'
		> & {
			listingDoc: unknown;
			reserverDoc: unknown;
			listing: Models.ReservationRequest.ReservationRequest['listing'];
			reserver: Models.ReservationRequest.ReservationRequest['reserver'];
		},
	>(
		docs: T[],
	): Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[] {
		const hydrate =
			typeof this.models.ReservationRequest.ReservationRequest.hydrate ===
			'function'
				? this.models.ReservationRequest.ReservationRequest.hydrate.bind(
						this.models.ReservationRequest.ReservationRequest,
					)
				: undefined;

		// Map aggregation results back to proper document structure
		// Use explicit typing to prevent index signature widening
		const docsWithRelations: Models.ReservationRequest.ReservationRequest[] =
			docs.map((doc) => {
				const { listingDoc, reserverDoc, ...restProps } = doc;
				// Reconstruct with proper ReservationRequest typing
				const reconstructed: Models.ReservationRequest.ReservationRequest = {
					...(restProps as Omit<
						Models.ReservationRequest.ReservationRequest,
						'listing' | 'reserver'
					>),
					listing: (listingDoc ?? restProps.listing) as Models.ReservationRequest.ReservationRequest['listing'],
					reserver: (reserverDoc ?? restProps.reserver) as Models.ReservationRequest.ReservationRequest['reserver'],
				};
				return reconstructed;
			});

		// Hydrate documents and convert to domain
		const hydratedDocs = hydrate
			? docsWithRelations.map((doc) => hydrate(doc))
			: docsWithRelations;

		return hydratedDocs.map((doc) =>
			this.converter.toDomain(doc, this.passport),
		);
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
