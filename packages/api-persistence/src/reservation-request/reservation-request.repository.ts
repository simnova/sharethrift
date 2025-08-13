import { Domain } from '@ocom/api-domain';
import type { Models } from '@ocom/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';


// Type aliases for model and adapter

type PropType = ReservationRequestDomainAdapter;
type ReservationRequestModelType = Models.ReservationRequest;
export class ReservationRequestRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ReservationRequestModelType,
		PropType,
		Domain.Contexts.Passport,
		Domain.Contexts.ReservationRequest<PropType>
	>
	implements Domain.Contexts.ReservationRequestRepository<PropType>
{
	async getById(id: string): Promise<Domain.Contexts.ReservationRequest<PropType>> {
		const mongoReservation = await this.model
			.findById(id)
			.populate('listing reserver')
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	async getAll(): Promise<Domain.Contexts.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find()
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}
	async getByIdWithListing(
		id: string,
	): Promise<Domain.Contexts.ReservationRequest<PropType>> {
		const mongoReservation = await this.model
			.findById(id)
			.populate('listing reserver')
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	async getNewInstance(
		state: Domain.Contexts.ReservationRequestStateValue,
		listing: Domain.Contexts.ListingEntityReference,  // Does not exist yet
		reserver: Domain.Contexts.EndUserEntityReference, // Does not exist yet
	): Promise<Domain.Contexts.ReservationRequest<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.ReservationRequest.getNewInstance(
				adapter,
				state,
				listing, // listingId
				reserver, // reserverId
				adapter.reservationPeriod, // reservationPeriod
				this.passport,
			),
		);
	}

	async getByReserverId(reserverId: string): Promise<Domain.Contexts.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ reserver: reserverId })
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async getByListingId(listingId: string): Promise<Domain.Contexts.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ listing: listingId })
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async saveAndGetReference(reservationRequest: Domain.Contexts.ReservationRequest<PropType>): Promise<Domain.Contexts.ReservationRequestEntityReference> {
		await this.save(reservationRequest);
		return reservationRequest.getEntityReference();
	}
}