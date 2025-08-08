import type {
	ReservationRequest,
	ReservationRequestRepository,
	ReservationRequestEntityReference,
	ReservationRequestProps,
} from '@ocom/api-domain';

/**
 * MongoDB repository implementation for ReservationRequest aggregate.
 * Implements the domain repository interface using Mongoose models.
 */
export class ReservationRequestRepositoryImpl implements ReservationRequestRepository {

	async get(id: string): Promise<ReservationRequest<ReservationRequestProps>> {
		const result = await this.getById(id);
		if (!result) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return result;
	}

	save(_reservationRequest: ReservationRequest<ReservationRequestProps>): Promise<ReservationRequest<ReservationRequestProps>> {
		// TODO: Implement actual save logic
		return Promise.reject(new Error('Method not implemented.'));
	}

	getById(_id: string): Promise<ReservationRequest<ReservationRequestProps> | undefined> {
		// TODO: Implement actual getById logic
		return Promise.reject(new Error('Method not implemented.'));
	}

	getByReserverId(_reserverId: string): Promise<ReservationRequest<ReservationRequestProps>[]> {
		// TODO: Implement actual getByReserverId logic
		return Promise.reject(new Error('Method not implemented.'));
	}

	getByListingId(_listingId: string): Promise<ReservationRequest<ReservationRequestProps>[]> {
		// TODO: Implement actual getByListingId logic
		return Promise.reject(new Error('Method not implemented.'));
	}

	async saveAndGetReference(
		reservationRequest: ReservationRequest<ReservationRequestProps>
	): Promise<ReservationRequestEntityReference> {
		const saved = await this.save(reservationRequest);
		return saved.getEntityReference();
	}
}