import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';
import type { ReservationRequestPassport } from '../../../../contexts/reservation-request/reservation-request.passport.ts';
import type { ReservationRequestVisa } from '../../../../contexts/reservation-request/reservation-request.visa.ts';
import { AdminUserPassportBase } from '../admin-user.passport-base.ts';
import { AdminUserReservationRequestVisa } from './admin-user.reservation-request.visa.ts';

export class AdminUserReservationRequestPassport
	extends AdminUserPassportBase
	implements ReservationRequestPassport
{
	forReservationRequest(
		root: ReservationRequestEntityReference,
	): ReservationRequestVisa {
		return new AdminUserReservationRequestVisa(root, this._user);
	}
}
