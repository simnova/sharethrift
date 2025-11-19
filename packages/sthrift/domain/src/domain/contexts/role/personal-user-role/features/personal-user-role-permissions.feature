Feature: Personal User Role Permissions

Background:
	Given I have personal user role permissions props

Scenario: Personal user role permissions should have listing permissions
	When I create a PersonalUserRolePermissions instance
	Then it should have listing permissions

Scenario: Personal user role permissions should have conversation permissions
	When I create a PersonalUserRolePermissions instance
	Then it should have conversation permissions

Scenario: Personal user role permissions should have reservation request permissions
	When I create a PersonalUserRolePermissions instance
	Then it should have reservation request permissions

Scenario: Listing permissions should be accessible as getters
	When I create a PersonalUserRolePermissions instance
	Then I can access listing permissions through getters

Scenario: Conversation permissions should be accessible as getters
	When I create a PersonalUserRolePermissions instance
	Then I can access conversation permissions through getters

Scenario: Reservation request permissions should be accessible as getters
	When I create a PersonalUserRolePermissions instance
	Then I can access reservation request permissions through getters
