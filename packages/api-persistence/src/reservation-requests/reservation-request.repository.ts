import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	ReservationRequest,
	type ReservationRequestRepository as ReservationRequestRepositoryInterface,
	type ReservationRequestProps,
	type ReservationRequestPassport,
	type ReservationRequestState,
	type ReserverId,
	type ReservationListingId
} from '@sthrift/api-domain';
import type { 
	ReservationRequestDocument, 
	ReservationRequestModel
} from '@sthrift/api-data-sources-mongoose-models';
import type { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.js';

/**
 * Repository implementation for ReservationRequest aggregate root.
 * Provides MongoDB-specific data access methods.
 */
export class ReservationRequestRepository 
	extends MongooseSeedwork.MongoRepositoryBase<
		ReservationRequest,
		ReservationRequestProps,
		ReservationRequestDomainAdapter,
		ReservationRequestDocument,
		typeof ReservationRequestModel
	>
	implements ReservationRequestRepositoryInterface {

	/**
	 * Creates a new instance of the aggregate with a new ID.
	 */
	getNewInstance(
		props: Omit<ReservationRequestProps, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'>
	): Promise<ReservationRequest> {
		const passport = {} as ReservationRequestPassport; // TODO: Create proper passport
		return Promise.resolve(ReservationRequest.getNewInstance(props, passport));
	}

	/**
	 * Retrieves a reservation request by its unique identifier.
	 */
	async getById(id: string): Promise<ReservationRequest | null> {
		return await this.get(id);
	}

	/**
	 * Retrieves all reservation requests.
	 */
	async getAll(): Promise<ReservationRequest[]> {
		const documents = await this.adapter.model.find({}).exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}

	/**
	 * Retrieves reservation requests by reserver ID.
	 */
	async getByReserverId(reserverId: ReserverId): Promise<ReservationRequest[]> {
		const documents = await this.adapter.model.find({ 
			reserver: this.adapter.converter.toObjectId(reserverId.valueOf())
		}).exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}

	/**
	 * Retrieves reservation requests by listing ID.
	 */
	async getByListingId(listingId: ReservationListingId): Promise<ReservationRequest[]> {
		const documents = await this.adapter.model.find({ 
			listing: this.adapter.converter.toObjectId(listingId.valueOf())
		}).exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}

	/**
	 * Retrieves reservation requests by state.
	 */
	async getByState(state: ReservationRequestState): Promise<ReservationRequest[]> {
		const documents = await this.adapter.model.find({ 
			state: state.valueOf()
		}).exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}

	/**
	 * Retrieves active reservation requests (not closed or cancelled).
	 */
	async getActiveReservations(reserverId?: ReserverId): Promise<ReservationRequest[]> {
		const query: Record<string, unknown> = {
			state: { $in: ['pending', 'accepted', 'rejected', 'closing'] }
		};

		if (reserverId) {
			query.reserver = this.adapter.converter.toObjectId(reserverId.valueOf());
		}

		const documents = await this.adapter.model.find(query).exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}

	/**
	 * Retrieves reservation history (closed reservations).
	 */
	async getReservationHistory(reserverId?: ReserverId): Promise<ReservationRequest[]> {
		const query: Record<string, unknown> = {
			state: 'closed'
		};

		if (reserverId) {
			query.reserver = this.adapter.converter.toObjectId(reserverId.valueOf());
		}

		const documents = await this.adapter.model.find(query)
			.sort({ updatedAt: -1 })
			.exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}

	/**
	 * Retrieves reservation requests by reserver and state.
	 */
	async getByReserverAndState(reserverId: ReserverId, state: ReservationRequestState): Promise<ReservationRequest[]> {
		const documents = await this.adapter.model.find({ 
			reserver: this.adapter.converter.toObjectId(reserverId.valueOf()),
			state: state.valueOf()
		}).exec();
		return documents.map(doc => this.adapter.toDomainEntity(doc));
	}
}