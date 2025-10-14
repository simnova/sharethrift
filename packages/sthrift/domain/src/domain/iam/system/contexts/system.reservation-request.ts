import type { ReservationRequestEntityReference } from '../../../contexts/reservation-request/reservation-request/reservation-request.entity.js';
import type { ReservationRequestPassport } from '../../../contexts/reservation-request/reservation-request.passport.js';
import { SystemPassportBase } from '../system.passport-base.js';
import type { ReservationRequestVisa } from '../../../contexts/reservation-request/reservation-request.visa.js';
import type { ReservationRequestDomainPermissions } from '../../../contexts/reservation-request/reservation-request.domain-permissions.js';

export class SystemReservationRequestPassport
	extends SystemPassportBase
	implements ReservationRequestPassport
{
	forReservationRequest(
		_root: ReservationRequestEntityReference,
	): ReservationRequestVisa {
		const permissions = this.permissions as ReservationRequestDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
