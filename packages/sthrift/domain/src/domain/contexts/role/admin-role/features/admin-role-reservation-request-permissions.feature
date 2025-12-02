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

Scenario: Admin role reservation request permissions should have canModerateReservations
	Given I have admin role reservation request permissions
	When I access the canModerateReservations property
	Then it should be a boolean

Scenario: Setting canViewAllReservations should update the value
	Given I have admin role reservation request permissions with canViewAllReservations false
	When I set canViewAllReservations to true
	Then canViewAllReservations should be true

Scenario: Setting canApproveReservations should update the value
	Given I have admin role reservation request permissions with canApproveReservations false
	When I set canApproveReservations to true
	Then canApproveReservations should be true

Scenario: Setting canRejectReservations should update the value
	Given I have admin role reservation request permissions with canRejectReservations false
	When I set canRejectReservations to true
	Then canRejectReservations should be true

Scenario: Setting canCancelReservations should update the value
	Given I have admin role reservation request permissions with canCancelReservations false
	When I set canCancelReservations to true
	Then canCancelReservations should be true

Scenario: Setting canEditReservations should update the value
	Given I have admin role reservation request permissions with canEditReservations false
	When I set canEditReservations to true
	Then canEditReservations should be true

Scenario: Setting canModerateReservations should update the value
	Given I have admin role reservation request permissions with canModerateReservations false
	When I set canModerateReservations to true
	Then canModerateReservations should be true
