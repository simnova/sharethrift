import type { ReservationRequestEntityReference } from '../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';
import type { ReservationRequestDomainPermissions } from '../../../contexts/reservation-request/reservation-request.domain-permissions.ts';
import type { ReservationRequestPassport } from '../../../contexts/reservation-request/reservation-request.passport.ts';
import type { ReservationRequestVisa } from '../../../contexts/reservation-request/reservation-request.visa.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

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
