Feature: Admin Role Permissions

Scenario: Admin role permissions should contain user permissions
	Given I have admin role permissions
	When I access the userPermissions property
	Then it should be defined

Scenario: Admin role permissions should contain conversation permissions
	Given I have admin role permissions
	When I access the conversationPermissions property
	Then it should be defined

Scenario: Admin role permissions should contain listing permissions
	Given I have admin role permissions
	When I access the listingPermissions property
	Then it should be defined

Scenario: Admin role permissions should contain reservation request permissions
	Given I have admin role permissions
	When I access the reservationRequestPermissions property
	Then it should be defined
