Feature: Admin Role User Permissions

Scenario: Admin role user permissions should have canBlockUsers
	Given I have admin role user permissions
	When I access the canBlockUsers property
	Then it should be a boolean

Scenario: Admin role user permissions should have canViewAllUsers
	Given I have admin role user permissions
	When I access the canViewAllUsers property
	Then it should be a boolean

Scenario: Admin role user permissions should have canEditUsers
	Given I have admin role user permissions
	When I access the canEditUsers property
	Then it should be a boolean

Scenario: Admin role user permissions should have canDeleteUsers
	Given I have admin role user permissions
	When I access the canDeleteUsers property
	Then it should be a boolean

Scenario: Admin role user permissions should have canManageUserRoles
	Given I have admin role user permissions
	When I access the canManageUserRoles property
	Then it should be a boolean
