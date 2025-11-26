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

Scenario: Admin role listing permissions should have canRejectListings
	Given I have admin role listing permissions
	When I access the canRejectListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canBlockListings
	Given I have admin role listing permissions
	When I access the canBlockListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canUnblockListings
	Given I have admin role listing permissions
	When I access the canUnblockListings property
	Then it should be a boolean

Scenario: Admin role listing permissions should have canModerateListings
	Given I have admin role listing permissions
	When I access the canModerateListings property
	Then it should be a boolean

Scenario: Setting canViewAllListings should update the value
	Given I have admin role listing permissions with canViewAllListings false
	When I set canViewAllListings to true
	Then canViewAllListings should be true

Scenario: Setting canManageAllListings should update the value
	Given I have admin role listing permissions with canManageAllListings false
	When I set canManageAllListings to true
	Then canManageAllListings should be true

Scenario: Setting canEditListings should update the value
	Given I have admin role listing permissions with canEditListings false
	When I set canEditListings to true
	Then canEditListings should be true

Scenario: Setting canDeleteListings should update the value
	Given I have admin role listing permissions with canDeleteListings false
	When I set canDeleteListings to true
	Then canDeleteListings should be true

Scenario: Setting canApproveListings should update the value
	Given I have admin role listing permissions with canApproveListings false
	When I set canApproveListings to true
	Then canApproveListings should be true

Scenario: Setting canRejectListings should update the value
	Given I have admin role listing permissions with canRejectListings false
	When I set canRejectListings to true
	Then canRejectListings should be true

Scenario: Setting canBlockListings should update the value
	Given I have admin role listing permissions with canBlockListings false
	When I set canBlockListings to true
	Then canBlockListings should be true

Scenario: Setting canUnblockListings should update the value
	Given I have admin role listing permissions with canUnblockListings false
	When I set canUnblockListings to true
	Then canUnblockListings should be true

Scenario: Setting canModerateListings should update the value
	Given I have admin role listing permissions with canModerateListings false
	When I set canModerateListings to true
	Then canModerateListings should be true
