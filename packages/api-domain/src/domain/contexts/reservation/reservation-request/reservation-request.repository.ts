import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	ReservationRequest,
	ReservationRequestEntityReference,
	ReservationRequestProps,
} from './reservation-request.aggregate.ts';

export interface ReservationRequestRepository
	extends DomainSeedwork.Repository<ReservationRequest<ReservationRequestProps>> {
	get(id: string): Promise<ReservationRequest<ReservationRequestProps>>;
	save(reservationRequest: ReservationRequest<ReservationRequestProps>): Promise<ReservationRequest<ReservationRequestProps>>;
	getById(id: string): Promise<ReservationRequest<ReservationRequestProps> | undefined>;
	getByReserverId(
		reserverId: string,
	): Promise<ReservationRequest<ReservationRequestProps>[]>;
	getByListingId(
		listingId: string,
	): Promise<ReservationRequest<ReservationRequestProps>[]>;
	saveAndGetReference(
		reservationRequest: ReservationRequest<ReservationRequestProps>,
	): Promise<ReservationRequestEntityReference>;
}
