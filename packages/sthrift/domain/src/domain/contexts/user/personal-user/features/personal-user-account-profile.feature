Feature: Personal User Account Profile Value Object

Scenario: Profile value object can be created with valid props
	Given I have profile props with all fields
	When I create a PersonalUserProfile instance
	Then it should be created successfully

Scenario: Profile firstName getter returns correct value
	Given I have a profile instance with firstName
	When I access the firstName property
	Then it should return the correct firstName value

Scenario: Profile lastName getter returns correct value
	Given I have a profile instance with lastName
	When I access the lastName property
	Then it should return the correct lastName value

Scenario: Profile aboutMe getter returns correct value
	Given I have a profile instance with aboutMe
	When I access the aboutMe property
	Then it should return the correct aboutMe value

Scenario: Profile location getter returns Location value object
	Given I have a profile instance with location data
	When I access the location property
	Then it should return a PersonalUserAccountProfileLocation instance

Scenario: Profile billing getter returns Billing value object
	Given I have a profile instance with billing data
	When I access the billing property
	Then it should return a PersonalUserAccountProfileBilling instance

Scenario: Profile firstName setter requires valid visa
	Given I have a profile instance with a restrictive visa
	When I attempt to set firstName without permission
	Then it should throw a PermissionError

Scenario: Profile firstName setter works with valid visa
	Given I have a profile instance with a permissive visa
	When I set the firstName property
	Then the firstName should be updated

Scenario: Profile allows setters when entity is new
	Given I have a profile instance for a new entity
	When I set the lastName property
	Then the lastName should be updated without visa check
