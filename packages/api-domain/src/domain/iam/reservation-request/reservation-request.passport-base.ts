export interface AuthenticatedPrincipal {
	id: string;
	email: string;
	roles: string[];
}

export interface ReservationRequestDomainPermissions {
	canCreateReservationRequest: boolean;
	canUpdateReservationRequest: boolean;
	canDeleteReservationRequest: boolean;
	canAcceptReservationRequest: boolean;
	canRejectReservationRequest: boolean;
	canCancelReservationRequest: boolean;
	canCloseReservationRequest: boolean;
	canViewReservationRequest: boolean;
}

export class ReservationRequestPassportBase {
	protected readonly principal: AuthenticatedPrincipal;
	protected readonly permissions: ReservationRequestDomainPermissions;

	constructor(principal: AuthenticatedPrincipal, permissions: ReservationRequestDomainPermissions) {
		this.principal = principal;
		this.permissions = permissions;
		
		// Validate required entities
		if (!principal?.id) {
			throw new Error('Principal ID is required for passport');
		}
	}

	public determineIf(predicate: (permissions: ReservationRequestDomainPermissions) => boolean): boolean {
		return predicate(this.permissions);
	}

	public get principalId(): string {
		return this.principal.id;
	}

	public get principalEmail(): string {
		return this.principal.email;
	}

	public get principalRoles(): string[] {
		return this.principal.roles;
	}
}