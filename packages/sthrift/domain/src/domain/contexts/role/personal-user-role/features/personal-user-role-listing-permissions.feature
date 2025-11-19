Feature: Personal User Role Listing Permissions

Background:
	Given I have listing permissions props

Scenario: Listing permissions should have create permission
	When I create a PersonalUserRoleListingPermissions instance
	Then canCreateItemListing should be a boolean

Scenario: Listing permissions should have update permission
	When I create a PersonalUserRoleListingPermissions instance
	Then canUpdateItemListing should be a boolean

Scenario: Listing permissions should have delete permission
	When I create a PersonalUserRoleListingPermissions instance
	Then canDeleteItemListing should be a boolean

Scenario: Listing permissions should have view permission
	When I create a PersonalUserRoleListingPermissions instance
	Then canViewItemListing should be a boolean

Scenario: Listing permissions should have publish permission
	When I create a PersonalUserRoleListingPermissions instance
	Then canPublishItemListing should be a boolean

Scenario: Listing permissions should have unpublish permission
	When I create a PersonalUserRoleListingPermissions instance
	Then canUnpublishItemListing should be a boolean

Scenario: Listing permissions should support setter methods
	When I create a PersonalUserRoleListingPermissions instance and modify values
	Then the values should be updated
