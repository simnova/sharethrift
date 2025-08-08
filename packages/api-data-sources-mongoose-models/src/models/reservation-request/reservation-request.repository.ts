import type { Model } from 'mongoose';
import {
	ReservationRequest,
	type ReservationRequestRepository,
	type ReservationRequestEntityReference,
	ReservationPeriod,
	ReservationRequestStateValue,
	ReservationRequestState,
} from '@ocom/api-domain';

export class ReservationRequestRepositoryImpl<PassportType>
	implements ReservationRequestRepository<PassportType>
{
	private readonly model: Model<any>;
	private readonly createPassport: () => PassportType;

	constructor(
		model: Model<any>,
		createPassport: () => PassportType,
	) {
		this.model = model;
		this.createPassport = createPassport;
	}

	async get(id: string): Promise<ReservationRequest<PassportType>> {
		const doc = await this.model.findById(id);
		if (!doc) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.mapToEntity(doc);
	}

	async save(reservationRequest: ReservationRequest<PassportType>): Promise<ReservationRequest<PassportType>> {
		const doc = await this.model.findByIdAndUpdate(
			reservationRequest.id,
			{
				state: reservationRequest.state.value,
				reservationPeriodStart: reservationRequest.reservationPeriod.start,
				reservationPeriodEnd: reservationRequest.reservationPeriod.end,
				createdAt: reservationRequest.createdAt,
				updatedAt: reservationRequest.updatedAt,
				schemaversion: reservationRequest.schemaVersion,
				listing: reservationRequest.listingId,
				reserver: reservationRequest.reserverId,
				closeRequested: reservationRequest.closeRequested,
			},
			{ upsert: true, new: true }
		);

		return this.mapToEntity(doc);
	}

	async getById(id: string): Promise<ReservationRequest<PassportType> | undefined> {
		const doc = await this.model.findById(id);
		if (!doc) {
			return undefined;
		}
		return this.mapToEntity(doc);
	}

	async getByReserverId(reserverId: string): Promise<ReservationRequest<PassportType>[]> {
		const docs = await this.model.find({ reserver: reserverId });
		return docs.map(doc => this.mapToEntity(doc));
	}

	async getByListingId(listingId: string): Promise<ReservationRequest<PassportType>[]> {
		const docs = await this.model.find({ listing: listingId });
		return docs.map(doc => this.mapToEntity(doc));
	}

	async saveAndGetReference(reservationRequest: ReservationRequest<PassportType>): Promise<ReservationRequestEntityReference> {
		const doc = await this.model.findByIdAndUpdate(
			reservationRequest.id,
			{
				state: reservationRequest.state.value,
				reservationPeriodStart: reservationRequest.reservationPeriod.start,
				reservationPeriodEnd: reservationRequest.reservationPeriod.end,
				createdAt: reservationRequest.createdAt,
				updatedAt: reservationRequest.updatedAt,
				schemaversion: reservationRequest.schemaVersion,
				listing: reservationRequest.listingId,
				reserver: reservationRequest.reserverId,
				closeRequested: reservationRequest.closeRequested,
			},
			{ upsert: true, new: true }
		);

		return {
			id: doc._id.toString(),
		};
	}

	private mapToEntity(doc: any): ReservationRequest<PassportType> {
		const reservationPeriod = ReservationPeriod.create(
			doc.reservationPeriodStart,
			doc.reservationPeriodEnd,
		);

		const state = ReservationRequestStateValue.create(
			doc.state as ReservationRequestState,
		);

		const props = {
			id: doc._id.toString(),
			state,
			reservationPeriod,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
			schemaVersion: doc.schemaversion,
			listingId: doc.listing.toString(),
			reserverId: doc.reserver.toString(),
			closeRequested: doc.closeRequested,
		};

		return new ReservationRequest(props, this.createPassport());
	}
}