Feature: Personal User Entity

Background:
	Given I have a personal user props object

Scenario: Personal user userType should be a string
	When I access the userType property
	Then it should be a string

Scenario: Personal user isBlocked should be a boolean
	When I access the isBlocked property
	Then it should be a boolean

Scenario: Personal user hasCompletedOnboarding should be a boolean
	When I access the hasCompletedOnboarding property
	Then it should be a boolean

Scenario: Personal user role reference should be readonly
	When I attempt to modify the role property
	Then the role property should be readonly

Scenario: Personal user loadRole should return a promise
	When I call the loadRole method
	Then it should return a role reference

Scenario: Personal user account should be readonly
	When I access the account property
	Then it should be an object

Scenario: Personal user schemaVersion should be readonly
	When I access the schemaVersion property
	Then it should be a string

Scenario: Personal user timestamps should be dates
	When I access the timestamp properties
	Then createdAt and updatedAt should be Date objects
