import type { ReservationRequestVisa } from './reservation-request.visa.ts';
import type { ReservationRequestEntityReference } from './reservation-request.aggregate.ts';

export interface ReservationRequestPassport {
    forReservationRequest(root: ReservationRequestEntityReference): ReservationRequestVisa;
}
