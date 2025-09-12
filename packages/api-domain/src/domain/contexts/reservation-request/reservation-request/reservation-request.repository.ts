import type { DomainSeedwork } from "@cellix/domain-seedwork";
import type {
  ReservationRequest,
  ReservationRequestProps,
} from "./reservation-request.ts";
import type { ItemListingEntityReference } from '../../listing/item/item-listing.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.ts'

export interface ReservationRequestRepository<
  props extends ReservationRequestProps
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
  
  /**
   * Get paginated reservation requests by listing owner ID with filtering and sorting
   */
  getByListingOwnerIDWithPagination(
    ownerId: string,
    options: {
      page: number;
      pageSize: number;
      searchText?: string;
      statusFilters?: string[];
      sorter?: { field: string; order: 'ascend' | 'descend' };
    }
  ): Promise<{
    items: ReservationRequest<props>[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}
