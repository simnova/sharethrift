Feature: Admin Role Listing Permissions

Scenario: Admin role listing permissions should have canViewAllListings
	Given I have admin role listing permissions
	When I access the canViewAllListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canManageAllListings
	Given I have admin role listing permissions
	When I access the canManageAllListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canEditListings
	Given I have admin role listing permissions
	When I access the canEditListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canDeleteListings
	Given I have admin role listing permissions
	When I access the canDeleteListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canApproveListings
	Given I have admin role listing permissions
	When I access the canApproveListings property
	Then it should be a boolean
