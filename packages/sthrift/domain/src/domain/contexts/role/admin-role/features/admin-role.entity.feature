Feature: Admin Role Entity

Background:
	Given I have an admin role props object

Scenario: Admin role roleType should be a string
	When I access the roleType property
	Then it should be a string

Scenario: Admin role roleName should be a string
	When I access the roleName property
	Then it should be a string

Scenario: Admin role isDefault should be a boolean
	When I access the isDefault property
	Then it should be a boolean

Scenario: Admin role permissions should be readonly
	When I access the permissions property
	Then it should be an object

Scenario: Admin role schemaVersion should be readonly
	When I access the schemaVersion property
	Then it should be a string

Scenario: Admin role timestamps should be dates
	When I access the timestamp properties
	Then createdAt and updatedAt should be Date objects
