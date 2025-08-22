import type { DomainSeedwork } from "@cellix/domain-seedwork";
import type {
  ReservationRequest,
  ReservationRequestEntityReference,
  ReservationRequestProps,
  UserEntityReference,
  ListingEntityReference,
} from "./reservation-request.aggregate.ts";

import type {
  ReservationPeriod,
  ReservationRequestStateValue,
} from "./reservation-request.value-objects.ts";

export interface ReservationRequestRepository<
  props extends ReservationRequestProps
> extends DomainSeedwork.Repository<ReservationRequest<props>> {
  getNewInstance(
    state: ReservationRequestStateValue,
    listing: ListingEntityReference,
    reserver: UserEntityReference,
    reservationPeriod: ReservationPeriod,
  ): Promise<ReservationRequest<props>>;
  save(
    reservationRequest: ReservationRequest<props>
  ): Promise<ReservationRequest<props>>;
  getById(id: string): Promise<ReservationRequest<props> | undefined>;
  getByReserverId(reserverId: string): Promise<ReservationRequest<props>[]>;
  getByListingId(listingId: string): Promise<ReservationRequest<props>[]>;
  saveAndGetReference(
    reservationRequest: ReservationRequest<props>
  ): Promise<ReservationRequestEntityReference>;
}
