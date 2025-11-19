Feature: Personal User Role Reservation Request Permissions

Background:
	Given I have reservation request permissions props

Scenario: Reservation request permissions canCreateReservationRequest should be a boolean
	When I create a PersonalUserRoleReservationRequestPermissions instance
	Then canCreateReservationRequest should be a boolean

Scenario: Reservation request permissions canManageReservationRequest should be a boolean
	When I create a PersonalUserRoleReservationRequestPermissions instance
	Then canManageReservationRequest should be a boolean

Scenario: Reservation request permissions canViewReservationRequest should be a boolean
	When I create a PersonalUserRoleReservationRequestPermissions instance
	Then canViewReservationRequest should be a boolean

Scenario: Reservation request permissions should support setter methods
	When I create a PersonalUserRoleReservationRequestPermissions instance and modify values
	Then the values should be updated
