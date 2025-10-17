import type { Domain } from '@sthrift/domain';
import { Types } from 'mongoose';
import type { ModelsContext } from '../../../../models-context.ts';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	filterByStates,
	RESERVATION_STATES,
} from './reservation-state-filters.ts';
import { BaseReadRepository } from '../../base-read-repository.ts';
import type { FilterQuery } from 'mongoose';

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

// Removed inline mock data generation in favor of database-seeded test data using the mock-mongodb-memory-server package.
// This change improves test reliability and maintains separation of concerns between data setup and repository logic.

export class ReservationRequestReadRepositoryImpl
	extends BaseReadRepository<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument,
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
		return this.queryMany({}, options);
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		return this.queryById(id, options);
	}

	async getByReserverId(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				reserver: new Types.ObjectId(reserverId),
			};
		return this.queryMany(filter, options);
	}

	async getActiveByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				reserver: new Types.ObjectId(reserverId),
				...filterByStates(RESERVATION_STATES.ACTIVE),
			};
		return this.queryMany(filter, options);
	}

	async getPastByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				reserver: new Types.ObjectId(reserverId),
				...filterByStates(RESERVATION_STATES.INACTIVE),
			};
		return this.queryMany(filter, options);
	}

	async getListingRequestsBySharerId(
		sharerId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		// First, get all listing IDs owned by this sharer
		const sharerListings = await this.models.Listing.ItemListingModel.find(
			{ sharer: new Types.ObjectId(sharerId) },
			{ _id: 1 },
		).lean();

		const listingIds = sharerListings.map((listing) => listing._id);

		if (listingIds.length === 0) {
			return [];
		}

		// Then find reservation requests for those listings
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				listing: { $in: listingIds },
			};

		return this.queryMany(filter, options);
	}

	async getActiveByReserverIdAndListingId(
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				reserver: new MongooseSeedwork.ObjectId(reserverId),
				listing: new MongooseSeedwork.ObjectId(listingId),
				...filterByStates(RESERVATION_STATES.ACTIVE),
			};
		return this.queryOne(filter, options);
	}

	async getOverlapActiveReservationRequestsForListing(
		listingId: string,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				listing: new MongooseSeedwork.ObjectId(listingId),
				...filterByStates(RESERVATION_STATES.ACTIVE),
				reservationPeriodStart: { $lt: reservationPeriodEnd },
				reservationPeriodEnd: { $gt: reservationPeriodStart },
			};
		return this.queryMany(filter, options);
	}

	async getActiveByListingId(
		listingId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter: FilterQuery<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestDocument> =
			{
				listing: new MongooseSeedwork.ObjectId(listingId),
				...filterByStates(RESERVATION_STATES.ACTIVE),
			};
		return this.queryMany(filter, options);
	}
}

export const getReservationRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ReservationRequestReadRepositoryImpl(models, passport);
};
