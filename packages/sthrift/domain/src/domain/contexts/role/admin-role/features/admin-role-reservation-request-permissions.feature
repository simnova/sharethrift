Feature: Admin Role Reservation Request Permissions

Scenario: Admin role reservation request permissions should have canViewAllReservations
	Given I have admin role reservation request permissions
	When I access the canViewAllReservations property
	Then it should be a boolean

Scenario: Admin role reservation request permissions should have canApproveReservations
	Given I have admin role reservation request permissions
	When I access the canApproveReservations property
	Then it should be a boolean

Scenario: Admin role reservation request permissions should have canRejectReservations
	Given I have admin role reservation request permissions
	When I access the canRejectReservations property
	Then it should be a boolean

Scenario: Admin role reservation request permissions should have canCancelReservations
	Given I have admin role reservation request permissions
	When I access the canCancelReservations property
	Then it should be a boolean

Scenario: Admin role reservation request permissions should have canEditReservations
	Given I have admin role reservation request permissions
	When I access the canEditReservations property
	Then it should be a boolean
