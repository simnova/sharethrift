import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { ReservationRequestDomainPermissions } from './reservation-request.domain-permissions.js';

export interface ReservationRequestVisa
	extends PassportSeedwork.Visa<ReservationRequestDomainPermissions> {
	determineIf(
		func: (
			permissions: Readonly<ReservationRequestDomainPermissions>,
		) => boolean,
	): boolean;
}
