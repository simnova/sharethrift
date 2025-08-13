import { Domain } from '@ocom/api-domain';
import type { Models } from '@ocom/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';


// Type aliases for model and adapter
type ReservationRequestModelType = Models.ReservationRequest.ReservationRequest;
type PropType = ReservationRequestDomainAdapter;

export class ReservationRequestRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ReservationRequestModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.ReservationRequest.ReservationRequest<PropType>
	>
	implements Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<PropType>
{
	async getByIdWithListing(
		id: string,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest<PropType>> {
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
		state: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStateValue,
		listing: Domain.Contexts.Listing.Listing.ListingEntityReference,
		reserver: Domain.Contexts.User.EndUser.EndUserEntityReference,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest.getNewInstance(
				adapter,
				state,
				listing,
				reserver,
				this.passport,
			),
		);
	}

	async findByReserverId(reserverId: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ reserver: reserverId })
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async findByListingId(listingId: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ listing: listingId })
			.populate('listing reserver')
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async saveAndGetReference(reservationRequest: Domain.Contexts.ReservationRequest.ReservationRequest<PropType>): Promise<Domain.Contexts.ReservationRequest.ReservationRequestEntityReference> {
		await this.save(reservationRequest);
		return reservationRequest.getEntityReference();
	}
}