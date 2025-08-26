import { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';


// Type aliases for model and adapter

type PropType = ReservationRequestDomainAdapter;
type ReservationRequestModelType = Models.ReservationRequest.ReservationRequest;
export class ReservationRequestRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ReservationRequestModelType,
		PropType,
		Domain.Contexts.Passport,
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>
	>
	implements Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<PropType>
{
	async getById(id: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>> {
		const mongoReservation = await this.model
			.findById(id)
			.populate('listing reserver')
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	async getAll(): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find()
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}
	async getByIdWithListing(
		id: string,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>> {
		const mongoReservation = await this.model
			.findById(id)
			.populate('listing reserver')
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	getNewInstance(
		state: Domain.Contexts.ReservationRequestStateValue,
		listing: Domain.Contexts.ReservationRequest.ReservationRequest.ListingEntityReference,
		reserver: Domain.Contexts.ReservationRequest.ReservationRequest.UserEntityReference,
        reservationPeriod: Domain.Contexts.ReservationPeriod,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest.getNewInstance(
				adapter,
				state,
				listing, 
				reserver, 
				reservationPeriod, 
				this.passport,
			),
		);
	}

	async getByReserverId(reserverId: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ reserver: reserverId })
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async getByListingId(listingId: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ listing: listingId })
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}
}