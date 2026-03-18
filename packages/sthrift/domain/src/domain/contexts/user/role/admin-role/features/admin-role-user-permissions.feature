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

Scenario: Admin role user permissions should have canAccessAnalytics
	Given I have admin role user permissions
	When I access the canAccessAnalytics property
	Then it should be a boolean

Scenario: Admin role user permissions should have canManageRoles
	Given I have admin role user permissions
	When I access the canManageRoles property
	Then it should be a boolean

Scenario: Admin role user permissions should have canViewReports
	Given I have admin role user permissions
	When I access the canViewReports property
	Then it should be a boolean

Scenario: Admin role user permissions should have canDeleteContent
	Given I have admin role user permissions
	When I access the canDeleteContent property
	Then it should be a boolean

Scenario: Setting canBlockUsers should update the value
	Given I have admin role user permissions with canBlockUsers false
	When I set canBlockUsers to true
	Then canBlockUsers should be true

Scenario: Setting canViewAllUsers should update the value
	Given I have admin role user permissions with canViewAllUsers false
	When I set canViewAllUsers to true
	Then canViewAllUsers should be true

Scenario: Setting canEditUsers should update the value
	Given I have admin role user permissions with canEditUsers false
	When I set canEditUsers to true
	Then canEditUsers should be true

Scenario: Setting canDeleteUsers should update the value
	Given I have admin role user permissions with canDeleteUsers false
	When I set canDeleteUsers to true
	Then canDeleteUsers should be true

Scenario: Setting canManageUserRoles should update the value
	Given I have admin role user permissions with canManageUserRoles false
	When I set canManageUserRoles to true
	Then canManageUserRoles should be true

Scenario: Setting canAccessAnalytics should update the value
	Given I have admin role user permissions with canAccessAnalytics false
	When I set canAccessAnalytics to true
	Then canAccessAnalytics should be true

Scenario: Setting canManageRoles should update the value
	Given I have admin role user permissions with canManageRoles false
	When I set canManageRoles to true
	Then canManageRoles should be true

Scenario: Setting canViewReports should update the value
	Given I have admin role user permissions with canViewReports false
	When I set canViewReports to true
	Then canViewReports should be true

Scenario: Setting canDeleteContent should update the value
	Given I have admin role user permissions with canDeleteContent false
	When I set canDeleteContent to true
	Then canDeleteContent should be true
