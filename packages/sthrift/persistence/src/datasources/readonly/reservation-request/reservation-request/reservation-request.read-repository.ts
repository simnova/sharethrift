import type { Domain } from '@sthrift/domain';
import { Types } from 'mongoose';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	ReservationRequestDataSourceImpl,
	type ReservationRequestDataSource,
} from './reservation-request.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	getActiveReservationStateFilter,
	getInactiveReservationStateFilter,
} from './reservation-state-filters.ts';

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

// Database-seeded mock data is now handled by the mock-mongodb-memory-server package

export class ReservationRequestReadRepositoryImpl
	implements ReservationRequestReadRepository
{
	private readonly mongoDataSource: ReservationRequestDataSource;
	private readonly converter: ReservationRequestConverter;
	private readonly passport: Domain.Passport;
	private readonly models: ModelsContext;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.models = models;
		this.mongoDataSource = new ReservationRequestDataSourceImpl(
			models.ReservationRequest.ReservationRequest,
		);
		this.converter = new ReservationRequestConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
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
		const filter = {
			reserver: new Types.ObjectId(reserverId),
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter = {
			reserver: new Types.ObjectId(reserverId),
			...getActiveReservationStateFilter(),
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getPastByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter = {
			reserver: new Types.ObjectId(reserverId),
			...getInactiveReservationStateFilter(),
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
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
		const filter = {
			listing: { $in: listingIds },
		};

		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByReserverIdAndListingId(
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const filter = {
			reserver: new MongooseSeedwork.ObjectId(reserverId),
			listing: new MongooseSeedwork.ObjectId(listingId),
			...getActiveReservationStateFilter(),
		};
		const result = await this.mongoDataSource.findOne(filter, options);
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
		const filter = {
			listing: new MongooseSeedwork.ObjectId(listingId),
			...getActiveReservationStateFilter(),
			reservationPeriodStart: { $lt: reservationPeriodEnd },
			reservationPeriodEnd: { $gt: reservationPeriodStart },
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByListingId(
		listingId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter = {
			listing: new MongooseSeedwork.ObjectId(listingId),
			...getActiveReservationStateFilter(),
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}
}

export const getReservationRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ReservationRequestReadRepositoryImpl(models, passport);
};
