import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ReservationRequest } from './reservation-request.js';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.js';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.js';
import type { ReservationRequestProps } from './reservation-request.entity.js';

export interface ReservationRequestRepository<
	props extends ReservationRequestProps,
> extends DomainSeedwork.Repository<ReservationRequest<props>> {
	getNewInstance(
		state: string,
		listing: ItemListingEntityReference,
		reserver: PersonalUserEntityReference,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
	): Promise<ReservationRequest<props>>;
	getById(id: string): Promise<ReservationRequest<props> | undefined>;
	getByReserverId(reserverId: string): Promise<ReservationRequest<props>[]>;
	getByListingId(listingId: string): Promise<ReservationRequest<props>[]>;
}
