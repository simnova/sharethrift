import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { ReservationDomainPermissions } from './reservation.domain-permissions.ts';

/**
 * Visa interface for the Reservation bounded context.
 * Provides authorization checking capabilities for reservation operations.
 */
export interface ReservationVisa extends PassportSeedwork.Visa<ReservationDomainPermissions> {
	/**
	 * Determines if the current context has permission based on the provided predicate.
	 * @param func - Function that takes permissions and returns boolean authorization result
	 * @returns boolean indicating if the operation is authorized
	 */
	determineIf(
		func: (permissions: Readonly<ReservationDomainPermissions>) => boolean,
	): boolean;
}