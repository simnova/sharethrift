import type { ReservationDomainPermissions } from '../contexts/reservation/reservation.domain-permissions.ts';

// TODO: Define proper principal type
type AuthenticatedPrincipal = unknown;

/**
 * Base passport class for ReservationRequest aggregate authentication and authorization.
 * Encapsulates required entities for authentication and authorization from the perspective of the reservation request aggregate.
 */
export class ReservationRequestPassportBase {
	private readonly principal: AuthenticatedPrincipal;
	private readonly permissions: ReservationDomainPermissions;

	constructor(principal: AuthenticatedPrincipal, permissions: ReservationDomainPermissions) {
		this.principal = principal;
		this.permissions = permissions;
		
		// Common logic for verifying entities within the reservation context
		// TODO: Add validation logic for reservation-specific authorization
	}

	public determineIf(predicate: (permissions: ReservationDomainPermissions) => boolean): boolean {
		return predicate(this.permissions);
	}

	// Additional passport methods can be added here
	protected getPrincipal(): AuthenticatedPrincipal {
		return this.principal;
	}

	protected getPermissions(): ReservationDomainPermissions {
		return this.permissions;
	}
}