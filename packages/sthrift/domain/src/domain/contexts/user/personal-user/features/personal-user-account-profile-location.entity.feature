Feature: Personal User Account Profile Location Entity

Background:
	Given I have a location props object

Scenario: Location address1 should be a string
	When I access the address1 property
	Then it should be a string

Scenario: Location address2 can be string or null
	When I access the address2 property
	Then it should be null or a string

Scenario: Location city should be a string
	When I access the city property
	Then it should be a string

Scenario: Location state should be a string
	When I access the state property
	Then it should be a string

Scenario: Location country should be a string
	When I access the country property
	Then it should be a string

Scenario: Location zipCode should be a string
	When I access the zipCode property
	Then it should be a string
