import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';

// Type aliases for model and adapter

type PropType = ReservationRequestDomainAdapter;
type ReservationRequestModelType = Models.ReservationRequest.ReservationRequest;
export class ReservationRequestRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ReservationRequestModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>
	>
	implements
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<PropType>
{
	async getById(
		id: string,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>
	> {
		const mongoReservation = await this.model
			.findById(id)
			.populate(['listing', 'reserver'])
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	async getAll(): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]
	> {
		const mongoReservations = await this.model
			.find()
			.populate(['listing', 'reserver'])
			.exec();
		return mongoReservations.map((doc) =>
			this.typeConverter.toDomain(doc, this.passport),
		);
	}

	getNewInstance(
		state: string,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		reserver: Domain.Contexts.User.UserEntityReference,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>
	> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest.getNewInstance(
				adapter,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				this.passport,
			),
		);
	}

	async getByReserverId(
		reserverId: string,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]
	> {
		const mongoReservations = await this.model
			.find({ reserver: reserverId })
			.populate(['listing', 'reserver'])
			.exec();
		return mongoReservations.map((doc) =>
			this.typeConverter.toDomain(doc, this.passport),
		);
	}

	async getByListingId(
		listingId: string,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]
	> {
		const mongoReservations = await this.model
			.find({ listing: listingId })
			.populate(['listing', 'reserver'])
			.exec();
		return mongoReservations.map((doc) =>
			this.typeConverter.toDomain(doc, this.passport),
		);
	}
}
