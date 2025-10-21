import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	filterByStates,
	RESERVATION_STATES,
} from './reservation-state-filters.ts';
import type { FilterQuery } from 'mongoose';
import { BaseReadRepository } from '../../base-read-repository.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';

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
	extends BaseReadRepository<
		Models.ReservationRequest.ReservationRequest,
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
	>
	implements ReservationRequestReadRepository
{
	private readonly models: ModelsContext;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		const mongoDataSource = new ReservationRequestDataSourceImpl(
			models.ReservationRequest.ReservationRequest,
		);
		const converter = new ReservationRequestConverter();
		super(mongoDataSource, converter, passport);
		this.models = models;
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
			...filterByStates(RESERVATION_STATES.ACTIVE),
		};
		return await this.queryMany(filter, options);
	}

	async getPastByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
			...filterByStates(RESERVATION_STATES.INACTIVE),
		};
		return await this.queryMany(filter, options);
	}

	async getListingRequestsBySharerId(
		sharerId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		// Use aggregation pipeline to join listings and filter by sharerId
		const pipeline: Record<string, unknown>[] = [
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
		];

		// Apply additional options if provided (e.g., limit, sort)
		if (options?.limit) {
			pipeline.push({ $limit: options.limit });
		}
		if (options?.sort) {
			pipeline.push({ $sort: options.sort });
		}

		const docs = await this.models.ReservationRequest.ReservationRequest.aggregate(pipeline).exec();

		// Convert to domain entities
		return docs.map((doc: Record<string, unknown>) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByReserverIdAndListingId(
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const filter: FilterQuery<Models.ReservationRequest.ReservationRequest> = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
			listing: new MongooseSeedwork.ObjectId(listingId),
			...filterByStates(RESERVATION_STATES.ACTIVE),
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
			...filterByStates(RESERVATION_STATES.ACTIVE),
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
			...filterByStates(RESERVATION_STATES.ACTIVE),
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
