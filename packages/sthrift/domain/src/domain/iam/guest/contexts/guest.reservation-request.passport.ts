import type { ReservationRequestEntityReference } from '../../../contexts/reservation-request/reservation-request/index.js';
import type { ReservationRequestPassport } from './../../../contexts/reservation-request/reservation-request.passport.js';
import type { ReservationRequestVisa } from '../../../contexts/reservation-request/reservation-request.visa.js';
import { GuestPassportBase } from '../guest.passport-base.js';

export class GuestReservationRequestPassport
	extends GuestPassportBase
	implements ReservationRequestPassport
{
	forReservationRequest(_root: ReservationRequestEntityReference): ReservationRequestVisa {
		return { determineIf: () => false };
	}
}
