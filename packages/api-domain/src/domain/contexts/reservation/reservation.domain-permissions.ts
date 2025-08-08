/**
 * Domain permissions interface for the Reservation bounded context.
 * Defines the authorization capabilities available for reservation-related operations.
 */
export interface ReservationDomainPermissions {
	// Reservation Request aggregate permissions
	canCreateReservationRequest: boolean;
	canAcceptReservationRequest: boolean;
	canRejectReservationRequest: boolean;
	canCancelReservationRequest: boolean;
	canCloseReservationRequest: boolean;
	canRequestCloseReservationRequest: boolean;
	canViewReservationRequest: boolean;
	canManageReservationRequest: boolean;
	
	// System permissions
	isSystemAccount: boolean;
	isOwner: boolean;
	canAccessReservationData: boolean;
}