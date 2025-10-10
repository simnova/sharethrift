import type { ReservationRequestEntityReference } from '../../../contexts/reservation-request/reservation-request/index.ts';
import type { ReservationRequestPassport } from './../../../contexts/reservation-request/reservation-request.passport.ts';
import type { ReservationRequestVisa } from '../../../contexts/reservation-request/reservation-request.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestReservationRequestPassport
	extends GuestPassportBase
	implements ReservationRequestPassport
{
	forReservationRequest(
		_root: ReservationRequestEntityReference,
	): ReservationRequestVisa {
		return { determineIf: () => false };
	}
}
