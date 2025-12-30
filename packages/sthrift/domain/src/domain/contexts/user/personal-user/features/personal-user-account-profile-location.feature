Feature: Personal User Account Profile Location Value Object

Scenario: Location value object can be created with valid props
	Given I have location props with all fields
	When I create a PersonalUserAccountProfileLocation instance
	Then it should be created successfully

Scenario: Location address1 getter returns correct value
	Given I have a location instance with address1
	When I access the address1 property
	Then it should return the correct address1 value

Scenario: Location address2 getter returns correct value
	Given I have a location instance with address2
	When I access the address2 property
	Then it should return the correct address2 value

Scenario: Location city getter returns correct value
	Given I have a location instance with city
	When I access the city property
	Then it should return the correct city value

Scenario: Location state getter returns correct value
	Given I have a location instance with state
	When I access the state property
	Then it should return the correct state value

Scenario: Location country getter returns correct value
	Given I have a location instance with country
	When I access the country property
	Then it should return the correct country value

Scenario: Location zipCode getter returns correct value
	Given I have a location instance with zipCode
	When I access the zipCode property
	Then it should return the correct zipCode value

Scenario: Location address1 setter requires valid visa
	Given I have a location instance with a restrictive visa
	When I attempt to set address1 without permission
	Then it should throw a PermissionError

Scenario: Location address1 setter works with valid visa
	Given I have a location instance with a permissive visa
	When I set the address1 property
	Then the address1 should be updated

Scenario: Location allows setters when entity is new
	Given I have a location instance for a new entity
	When I set the city property
	Then the city should be updated without visa check

Scenario: Location address2 setter works with valid visa
	Given I have a location instance with permissive visa for address2
	When I set the address2 property
	Then the address2 should be updated

Scenario: Location city setter works with valid visa
	Given I have a location instance with permissive visa for city
	When I update the city property
	Then the city should be updated

Scenario: Location state setter works with valid visa
	Given I have a location instance with permissive visa for state
	When I set the state property
	Then the state should be updated

Scenario: Location country setter works with valid visa
	Given I have a location instance with permissive visa for country
	When I set the country property
	Then the country should be updated

Scenario: Location zipCode setter works with valid visa
	Given I have a location instance with permissive visa for zipCode
	When I set the zipCode property
	Then the zipCode should be updated
