Feature: Personal User Account Value Object

Scenario: Account value object can be created with valid props
	Given I have account props with all fields
	When I create a PersonalUserAccount instance
	Then it should be created successfully

Scenario: Account accountType getter returns correct value
	Given I have an account instance with accountType
	When I access the accountType property
	Then it should return the correct accountType value

Scenario: Account email getter returns correct value
	Given I have an account instance with email
	When I access the email property
	Then it should return the correct email value

Scenario: Account username getter returns correct value
	Given I have an account instance with username
	When I access the username property
	Then it should return the correct username value

Scenario: Account profile getter returns Profile value object
	Given I have an account instance with profile data
	When I access the profile property
	Then it should return a PersonalUserProfile instance

Scenario: Account accountType setter requires valid visa
	Given I have an account instance with a restrictive visa
	When I attempt to set accountType without permission
	Then it should throw a PermissionError

Scenario: Account email setter works with valid visa
	Given I have an account instance with a permissive visa
	When I set the email property
	Then the email should be updated

Scenario: Account allows setters when entity is new
	Given I have an account instance for a new entity
	When I set the username property
	Then the username should be updated without visa check
