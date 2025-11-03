import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/index.ts';
import type { ReservationRequestPassport } from '../../../../contexts/reservation-request/reservation-request.passport.ts';
import type { ReservationRequestVisa } from '../../../../contexts/reservation-request/reservation-request.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import { PersonalUserReservationRequestVisa } from './personal-user.reservation-request.visa.ts';

export class PersonalUserReservationRequestPassport
	extends PersonalUserPassportBase
	implements ReservationRequestPassport
{
	forReservationRequest(root: ReservationRequestEntityReference): ReservationRequestVisa {
		return new PersonalUserReservationRequestVisa(root, this._user);
	}
}