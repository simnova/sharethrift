import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	ReservationRequest,
	ReservationRequestEntityReference,
} from './reservation-request.entity.ts';

export interface ReservationRequestRepository<PassportType>
	extends DomainSeedwork.Repository<ReservationRequest<PassportType>> {
	get(id: string): Promise<ReservationRequest<PassportType>>;
	save(reservationRequest: ReservationRequest<PassportType>): Promise<ReservationRequest<PassportType>>;
	getById(id: string): Promise<ReservationRequest<PassportType> | undefined>;
	getByReserverId(
		reserverId: string,
	): Promise<ReservationRequest<PassportType>[]>;
	getByListingId(
		listingId: string,
	): Promise<ReservationRequest<PassportType>[]>;
	saveAndGetReference(
		reservationRequest: ReservationRequest<PassportType>,
	): Promise<ReservationRequestEntityReference>;
}
