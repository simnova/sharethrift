Feature: Personal User Role Entity

Background:
	Given I have a personal user role props object

Scenario: Personal user role name should be a string
	When I access the roleName property
	Then it should be a string

Scenario: Personal user role isDefault should be a boolean
	When I access the isDefault property
	Then it should be a boolean

Scenario: Personal user role permissions should be an object
	When I access the permissions property
	Then it should be an object with nested permission objects

Scenario: Personal user role roleType should be readonly
	When I access the roleType property
	Then it should be a string

Scenario: Personal user role createdAt should be readonly
	When I access the createdAt property
	Then it should be a Date object

Scenario: Personal user role updatedAt should be readonly
	When I access the updatedAt property
	Then it should be a Date object

Scenario: Personal user role schemaVersion should be readonly
	When I access the schemaVersion property
	Then it should be a string
